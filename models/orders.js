const cuid=require("cuid");
const {isEmail}=require("validator");
const mongoose = require("../db");
const User=require("../models/users");

const OrderSchema=new mongoose.Schema({
    _id:{type:String,default:cuid},
    buyerEmail:{type:String,validate:{validator:isEmail},required:true},
    products:[{type:String,index:true,ref:"Products",required:true}],
    status:{type:String,index:true,default:'CREATED',enum:['CREATED','PENDING','COMPLETED']}
})
const Order=mongoose.model("orders",OrderSchema);

async function createOrder(fields){
    const order=await new Order(fields).save();
    await order.populate('products').execPopulate();
    return order;
}

async function getOrders(limit,offset,status,username){
    if(!username){
        return new Error("not orders");
    }
    console.log(username);
    const user=await User.get(username);
    if(username==="admin"){
        const ans=await Order.find();
        return ans;
    }
    const order= await Order.findOne({buyerEmail:user.email}).populate('products').exec()
    return order;   
}
module.exports={
      create:createOrder,
      get:getOrders
}
