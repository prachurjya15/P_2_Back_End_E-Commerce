const Products=require('./models/products');
const Orders=require('./models/orders');
const User=require('./models/users');

async function getProductList(req,res,next){
    const {limit=25,offset=0,tag}=req.query;
    console.log(req.query);
    try{
        res.json(await Products.list({offset:Number(offset),limit:Number(limit),tag:tag}));
    }
    catch(e){
          next(e);
    }
}

async function getProductById(req,res,next){
    const {id}=req.params;
    try{
       const data=await Products.getById(id);
       if(!data){
           res.json({"error":"no such Product"});
           return;
       }
       res.json(data);
    }
    catch(e){
         next(e);
    }
}

async function createProduct(req,res,next){
   if(!req.isAdmin){
       res.status(403).json({"MSG":"FORBIDDEN"});
       return;
   }
    try{
    const product=await Products.create(req.body);
    res.json(product);
    }
    catch(e){
        res.status(403).json({"error":"unable to create product"})
    }
}

async function editProduct(req,res,next){
    if(!req.isAdmin){
        res.status(403).json({"MSG":"FORBIDDEN"});
        return;
    }
     try{
        const product=await Products.edit(req.params.id,req.body);
        res.json(product);    
     }catch(e){
         res.json({"error":"unable to edit product"});
     }
}

async function deleteProduct(req,res,next){
    if(!req.isAdmin){
        res.status(403).json({"MSG":"FORBIDDEN"});
        return;
    }
    try{
          const product=await Products.delete(req.params.id);
          res.json({"msg":"Successfully Removed From DB"})      
       }
       catch(e){
           res.status(500).json({"error":"unable to delete!"})
       }
}
async function createOrder(req,res,next){
        const fields=req.body;
        if(!req.body.isAdmin){
            fields.username=req.user.username;
        }
         try{
           const order=await Orders.create(fields);
           res.json(order);
         }catch(e){
             res.status(500).json({"error":"unable to place a new order"})
         }
}

async function getOrders(req,res,next){
          try{
               const {limit=20,offset=0,id,status}=req.query;
            //    console.log(req.query);
            //    if(!req.body.isAdmin){
            //        const username=req.user.username;
            //    }
               console.log(req);
               const orders=await Orders.get(limit,offset,status,req.user.username);
               console.log(orders);
               return res.json(orders);  
          }
          catch(e){
              console.log(e);
              res.status(500).json({"error":"unable to get /orders"})
          }
}

async function createUser(req,res,next){
    try{
    const user=await User.createUser(req.body);
    const {username,email}=user;
    res.json({username,email});
    }
    catch(e){
        console.log(e);
        res.json({err:"error in creating new user"});
    } 
}

async function getUsers(req,res,next){
    const {username}=req.query;
      try{
         const user=await User.get(username);
         res.json({user});
      }
      catch(e){
          console.log(e);
          res.json({err:"error in getting user"});
      }
}

async function deleteUser(req,res,next){
    const {username}=req.body;
       try{
           await User.remove(username);
           res.json({msg:"deleted user from DB"});       
       }
       catch(e){
           console.log(e);
           res.json({err:"error in delteing the user"});
       }
}

async function editUser(req,res,next){
    try{
      const user=await User.editUser(req.user.username,req.body);
      res.json(user);
    }
    catch(e){
        console.log(e);
        res.json({"err":"error in editing"});
    } 
}



module.exports={
    getProductList,
    getProductById,
    createProduct,
    editProduct,
    deleteProduct,
    getOrders,
    createOrder,
    createUser,
    editUser,
    deleteUser,
    getUsers
}


