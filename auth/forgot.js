const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//ON HOLD
const forgot=async(req,res)=>{
    //Get username
    const username = req.body.username;
    //Fetch their doc
    const uerDoc = await prisma.users.findUnique({
        where:{
            username:username
        }
    });
    //update the doc   //oopsie, we dont have user's email to verify. 
    //done!
}