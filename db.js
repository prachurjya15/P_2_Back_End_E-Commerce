require("dotenv").config();
const mongoose=require("mongoose");
// const MONGO_URI="mongodb+srv://fs-node:QWERTYUIOP@cluster0.spfxr.mongodb.net/shop?retryWrites=true&w=majority";
const MONGO_URI=process.env.MONGO_URI;
mongoose.connect(MONGO_URI ||'mongodb://localhost/shop_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true
});
module.exports=mongoose;