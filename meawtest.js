// let User_and_Promontion =  "UAP0000200000051";
// const ArraySplitNumSring = User_and_Promontion.split("P");
// let NumPromotion = parseInt(ArraySplitNumSring[1]);
// NumPromotion ++; // Add 1 for new promotion or generate
// let GenPromotion = "";
// console.log(NumPromotion);
// for(let i=0; i< 13-NumPromotion.toString().length ;i++){
//    GenPromotion += "0";
// }
// GenPromotion += NumPromotion;

// console.log(GenPromotion + "");
var now = new Date();
now.setHours( now.getHours() + 7 );
year = now.getFullYear();
month = now.getMonth();
dt = now.getDate();
Full_YMD = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();

console.log(now.toLocaleDateString())