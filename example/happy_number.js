function isHappy(number){
   if (number===1)return true;
   if (number === 4) return false;
   return isHappy(Array.from(number.toString()).map(c=>Math.pow(parseInt(c),2)).reduce((a,b)=>a+b)) 
}
n = Math.round(Math.random()*10000);
console.log("Is %d Happy ? %s",n,isHappy(n))