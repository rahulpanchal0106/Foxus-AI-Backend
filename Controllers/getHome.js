function getHome(req,res){
    console.log("Root endpoint");
    res.send("Root Endpoint");
    return;
}
module.exports=getHome;