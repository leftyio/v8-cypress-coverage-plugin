function add (a, b) {
  console.log('in function add')
  return a + b
}

function sub (a, b) {
  console.log('in function sub')
  return a - b
}

let querystring = window.location.search
if(querystring && querystring==='?sub'){
  console.log('Substracting 3-2 %d, 3-(-10) %d',sub(3,2),sub(3,-10))
}else{
// call add twice to check code coverage counter
console.log('adding 2 + 3 %d, 1 - 10 %d', add(2, 3), add(1, -10))
}
console.log(querystring)

