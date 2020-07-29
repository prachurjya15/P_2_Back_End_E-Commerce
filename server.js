const express=require("express");
const bodyParser=require("body-parser");
const auth=require("./auth");
const cookieParser=require("cookie-parser");


const app=express();

const api=require('./api');
const middlewares = require("./middlewares");

const port=process.env.PORT||3000;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(middlewares.cors);

app.use(cookieParser())
app.get("/",(req,res)=>{res.json({"msg":"Hey User,Welcome to E-Commerce API..Please refer README.md to know how to use"})})

app.post('/login', auth.authenticate,auth.login);

app.get('/products',auth.ensureUser,api.getProductList);
app.get("/products/:id",auth.ensureUser,api.getProductById);
app.post('/products',auth.ensureUser,api.createProduct);
app.put('/products/:id',auth.ensureUser,api.editProduct);
app.delete('/products/:id',auth.ensureUser,api.deleteProduct);

app.get('/orders',auth.ensureUser,api.getOrders);
app.post('/orders',auth.ensureUser,api.createOrder);

app.post('/users',api.createUser);
app.post('/users/edit',auth.ensureUser,api.editUser);
app.post('/users/delete',auth.ensureUser,api.deleteUser);

app.use(middlewares.errorHandler);
app.use(middlewares.notFound);

app.listen(port,()=>{console.log(`Hosted with ❤  on port ${port}`);});

// mongodb+srv://fs-node:<password>@cluster0.spfxr.mongodb.net/<dbname>?retryWrites=true&w=majority

/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://fs-node:<password>@cluster0.spfxr.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

*/