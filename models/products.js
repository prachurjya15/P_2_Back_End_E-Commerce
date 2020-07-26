const cuid=require("cuid");
const mongoose=require("../db");
const {isURL} =require("validator");

const URLSchema=(opts={})=>{
    const {required}=opts;
    return {
        type:String,
        required:!required?false:true,
        validate:{validator:isURL,message:props=>`${props.value} is not a valid URL`}
    }
}

const productSchema=new mongoose.Schema({
    _id:{ type:String,default:cuid },
    description:{type:String,required:true},
    imgThumb:URLSchema({required:true}),
    img:URLSchema({required:true}),
    link:URLSchema(),
    userId:{type:String,required:true},
    userName:{type:String,required:true},
    userLink:URLSchema(),
    tags:{ type:[String], index:true}
});



const Product=mongoose.model("Products",productSchema);

async function create(fields){
    try{
     const product=await new Product(fields).save();
     console.log(product);
     return product;
    }
    catch(e){
        console.log(e);
        throw new Error(e);
    }
}


async function list({offset,limit,tag}){
    try{
    const query=tag?{tags:tag}:{};
    const product=await Product.find(query).limit(limit).skip(offset);
    return product;}
    catch(e){
         return new Error(e);  
    }
}

async function getById(id){
       const product=await Product.findById(id);
       return product;   
}
async function edit(id,body){
    console.log(body);
    try{
    const product=await Product.findById(id);
    console.log(product);
    Object.keys(body).forEach((key)=>{
          product[key]=body[key];
    })
    await product.save();
    return product;
}
catch(e){
    console.log("error in editing"+" "+e);
    return new Error(e);
}
    
}
async function deleteById(id){
    try{
      await Product.deleteOne({_id:id});
    }
    catch(e){
        console.log("problem in delte"+" "+e);
        return new Error(e);
    }

} 

module.exports={
    list:list,
    getById:getById,
    create:create,
    edit,
    delete:deleteById
}