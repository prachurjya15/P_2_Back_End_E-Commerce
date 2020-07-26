const passport=require("passport");
const Strategy=require("passport-local").Strategy;
const jwt=require("jsonwebtoken");
const bcrypt=require('bcrypt');
const User=require('./models/users');
require("dotenv").config();

const jwtSecret=process.env.JWT_SECRET||'mark it zero'
const adminPassword=process.env.ADMIN_PASSWORD||'qwerty'
const jwtOpts={ algorithm:'HS256', expiresIn:'30d'}

passport.use(adminStrategy());
const authenticate=passport.authenticate('local',{session:false});

async function login(req,res,next){
    try{
    const token=jwt.sign({username:req.user.username}, jwtSecret, jwtOpts);
    console.log(token);
    res.cookie('jwt', token, { httpOnly:true});
    res.json({token});
    }
    catch(e){
        console.log("error",e,"ERRRROR");
        res.send({err:"error"});
    }

 }
async function sign (payload) {
    try{
    const token=jwt.sign(payload, jwtSecret, jwtOpts)
    return token
    }
    catch(e){
        console.log("error in sigining jwt")
         throw new Error(e);
    }
}

async function ensureUser(req,res,next){
    try{
      const jwtString=req.headers.authorization||req.cookies.jwt;
      console.log(jwtString);
      if(!jwtString){
          res.status(401).json({"error":"unauthorized"});
          return;
      }
      const payload=await verify(jwtString);
      req.user=payload;
      console.log(payload);
      if(req.user.username==="admin"){
          console.log("heree");
           req.isAdmin=true;
      }  
     return next(); 
    } 
    catch(e){
        console.log(e);
         res.json({"msg":"unauthorized"});
    }
 }
async function verify(jwtString=""){
    jwtString =jwtString.replace(/^Bearer /i,'');
    try {
        const payload = await jwt.verify(jwtString, jwtSecret)
        return payload
    }
    catch (err) {
        err.statusCode = 401
        throw err
    }
}


function adminStrategy(){
    return new Strategy(async function(username,password,cb){
        const isAdmin=(username=='admin')&&(password===adminPassword);
        if(isAdmin){
           return cb(null,{username:'admin'});
        }
        try{
            const user=await User.get(username);
            console.log(user);
            if(!user){
                return cb(null,false);   
            }
            const isUser=await bcrypt.compare(password,user.password);
            if(isUser){
                return cb(null,{username:user.username});
            } 
        }
        catch(e){
        }  
        return cb(null,false);  
    })
}

module.exports={ensureUser,authenticate,login} 