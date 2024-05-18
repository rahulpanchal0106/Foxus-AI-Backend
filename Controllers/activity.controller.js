
const jwt = require('jsonwebtoken')
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getActivity(req,res){
    const authHeader = req.headers.authorization;
    console.log("************ ",authHeader)
    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    const username = decoded.username;

    try{
        const doc = await prisma.users.findUnique({
            where: {username: username}
        })
        console.log("Query ended\n",doc)
        res.status(200).json(doc.activity);
    }catch(err){
        console.log(err);
        return "error getting activity"
    }
    
}

module.exports = getActivity;