async function login(req,res){
    console.log("... login ... \n");
    const matched = checkCreds(username,password);
    if(matched){
        console.log("✅✅✅ Matched!");
        res.status(200).send("You are logged in");
    }else{
        console.log("🔴🔴🔴 No matched!")
        res.status(401).send("Not logged in");
    }
}