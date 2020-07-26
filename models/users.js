const mongoose=require("../db");
const bcrypt=require("bcrypt");
const {isEmail,isAlphaNumeric}=require("validator");
const cuid=require("cuid");

const SALT_ROUNDS=10;

const UserScahema=new mongoose.Schema({
    _id:{type:String,default:cuid},
    username:usernameSchema(),
    password:{type:String,maxLength:120,required:true},
    email:{type:String,validate:{validator:isEmail},required:true}
})

function usernameSchema(){
    return {
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        minLength:3,
        maxLength:150,
        // validate:[{validator:isAlphaNumeric,message:props=>`${props} not a alphanumeric`}]
    }

}
const User=mongoose.model('User',UserScahema);

async function get(username){
    const user=User.findOne({username:username});
    return user;
}

async function list(){
    const list=User.find();
    return list;
}

async function remove(username){
    await User.deleteOne({username:username});
}

async function createUser(fields){
     const user=new User(fields);
     await hashPassWord(user);
     await user.save(); 
     return user;
}
async function hashPassWord(user){ 
    user.password=await bcrypt.hash(user.password,SALT_ROUNDS);
}

async function editUser({username,change}){
   const user=await User.findOne({username:username});
    Object.keys(user).forEach((key)=>{
        user[key]=change[key];
    })
    if(change.password){
        await hashPassWord(user);
    }
    await user.save();
    return user;
}


module.exports={
    get,list,remove,editUser,createUser
}