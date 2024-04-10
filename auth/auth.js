async function auth(req,res,next){
    
    console.log("Yea, shit's good, let it pass... 😀👍")
    next();
}
module.exports=auth;