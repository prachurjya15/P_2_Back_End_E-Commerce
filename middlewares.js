// FOR CORS INTERACTION
function cors(req, res, next) {
    const origin = req.headers.origin
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, XMODIFY')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', '86400')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
    next();
}
// FOR ERROR HANDLING IN ROUTES
function errorHandler(err,req,res,next){
    console.error(err);
    if(headersSent){
        return next(err);
    }
     return res.json({"error":"Internal Server Error!!"});
}
// FOR NOT FOUND 404
function notFound(req,res){
    res.json({"error":"Snap!..No such Links Found! :( "});
}


module.exports={cors:cors,errorHandler,notFound}