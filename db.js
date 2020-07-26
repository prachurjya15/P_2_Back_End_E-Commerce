const mongoose=require("mongoose");
const MONGO_URI="mongodb+srv://fs-node:QWERTYUIOP@cluster0.spfxr.mongodb.net/shop?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI ||'mongodb://localhost/shop_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true
});
module.exports=mongoose;