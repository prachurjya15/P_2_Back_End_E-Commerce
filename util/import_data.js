const mongoose=require("../db");
const productFile=require("../products.json");
const Products=require("../models/products");
console.log(productFile[0]);
(async function(){
    for(let i=10;i<productFile.length;i++){ 
    try{
       await Products.create(productFile[i]);
       mongoose.disconnect();
    }
       catch(e){
           console.log("error in creating",e);
       } 
    }   
})();
mongoose.disconnect();