const CDP = require("chrome-remote-interface");
const v8ToIstanbul = require("v8-to-istanbul");
const url = require("url");
const path = require("path");
const fs = require("fs");
const minimatch = require("minimatch")
const mkdirp = require("mkdirp");
const istanbul = require("istanbul-lib-coverage");
const { exec, execSync } = require("child_process");
const fromRoot = path.join.bind(null, __dirname);
const v8CoverageFolder = fromRoot(".v8-coverage");
const istanbulCoverageFolder = "./.nyc_output";

const config ={
  src_root: "./",
  include_globs:["*"]
}

function beforeTest() {
  if (cdp) {
    const callCount = true;
    const detailed = true;
    return Promise.all([
      cdp.Profiler.enable(),
      cdp.Profiler.startPreciseCoverage(callCount, detailed),
    ]);
  }

  return null;
}
function afterTest() {
  if (cdp) {
    return cdp.Profiler.takePreciseCoverage().then(handleRawC8Coverage);
  }
  return null;
}
function url_to_path(url){
    return url.replace(/http:\/\/[^\/]*/, config.src_root).replace(/\?.*/,"");
}
function handleRawC8Coverage(c8coverage) {
    makeFolder();
  //We keep all files matching the any globs in the config
  let appC8coverages = c8coverage.result.filter((script) => {
    try{
      const path = url_to_path(script.url)
      return config.include_globs.find(glob=>minimatch(path,glob))!==undefined
    }catch(e){return false}
  });

  // The following logic is taken from the current cypress coverage plugin
  // We load previous coverage file if it exists
  const filename = path.join(istanbulCoverageFolder, "out.json");
  const previousCoverage = fs.existsSync(filename)
    ? JSON.parse(fs.readFileSync(filename, "utf8"))
    : {};
  const coverageMap = istanbul.createCoverageMap(previousCoverage);
  // We merge and write
  return Promise.all(
    appC8coverages.map((file) => {
      return convertToIstanbul(url_to_path(file.url), file.functions).then(
        (istanbulCoverage) => {
          coverageMap.merge(istanbulCoverage);
        }
      );
    })
  ).then(() => {
    fs.writeFileSync(filename, JSON.stringify(coverageMap, null, 2), "utf8");
    return cdp.Profiler.stopPreciseCoverage();
  });
}

function log(msg) {
    // todo: put in place a correct way to log things
  //console.log(msg);
}

let cdp;

const makeFolder = () => {
  // if (!fs.existsSync(v8CoverageFolder)) {
  //   mkdirp.sync(v8CoverageFolder)
  // }
  if (!fs.existsSync(istanbulCoverageFolder)) {
    console.log("making folder: %s", istanbulCoverageFolder);
    mkdirp.sync(istanbulCoverageFolder);
  }
};

const convertToIstanbul = async (jsFilename, functionsC8coverage) => {
  const map=undefined
  if(fs.existsSync(`${jsFilename}.map`))
  {
    map = JSON.parse(fs.readFileSync(`${jsFilename}.map`));
    map.sourcesContent = map.sources.filter(fs.existsSync).map((f) =>fs.readFileSync(f, "utf-8"));
  }
  const sourceMapConfig = (map==undefined || map.sourcesContent.length==0)?undefined:{sourceMap:{sourcemap:map}}
  const converter = v8ToIstanbul(jsFilename,undefined,sourceMapConfig);
  await converter.load(); // this is required due to the async source-map dependency.
  // provide an array of coverage information in v8 format.

  // const c8coverage = require('./.v8-coverage/coverage.json')
  // const appCoverage = c8coverage.result[0].functions
  converter.applyCoverage(functionsC8coverage);

  // output coverage information in a form that can
  // be consumed by Istanbul.
  // console.info(JSON.stringify(converter.toIstanbul(), null, 2))
  return converter.toIstanbul();
};

function browserLaunchHandler(browser, launchOptions) {
  if (browser.name !== "chrome") {
    return log(
      ` Warning: An unsupported browser is used, output will not be logged to console: ${browser.name}`
    );
  }

  // find how Cypress is going to control Chrome browser
  const rdpArgument = launchOptions.args.find((arg) =>
    arg.startsWith("--remote-debugging-port")
  );
  if (!rdpArgument) {
    return log(
      `Could not find launch argument that starts with --remote-debugging-port`
    );
  }
  const rdp = parseInt(rdpArgument.split("=")[1]);
  const tryConnect = () => {
    new CDP({
      port: rdp,
    })
      .then((_cdp) => {
        cdp = _cdp;
        cdp.on("disconnect", () => {
          cdp = null;
        });
      })
      .catch(() => {
        setTimeout(tryConnect, 100);
      });
  };

  tryConnect();
}

function convert_report([format,location]){
    format = format??"html"
    location = location??"./coverage"
    console.log("executing " ,"npx nyc report "+`--reporter=${format} --report-dir=${location}`)
    execSync("npx nyc report "+`--reporter=${format} --report-dir=${location}`)
    return null;
}

function register(on, cypress_config) {
  config.src_root=cypress_config.env.v8_coverage.src_root
  config.include_globs = cypress_config.env.v8_coverage.include
  on("before:browser:launch", browserLaunchHandler);
  on("task", {
    beforeTest,
    afterTest,
    convert_report
  });
}

module.exports = register;
