function fly(n) {
  console.log(n);
  if (n === 1) return;
  if (n % 2 === 0) fly(n / 2);
  else fly(n * 3 + 1);
}
querystring = window.location.search;
if (querystring && querystring === "?fly") {
  console.log("Flying", 23);
  fly(23);
}
