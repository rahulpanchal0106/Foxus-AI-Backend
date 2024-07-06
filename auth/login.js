const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken')

async function checkCreds(u, p) {
  try {
    const user = await prisma.users.findUnique({
      where: { username: u }
  });

    if (!user) {
      return false; // User not found
    }
    if(user.password === p){
        console.log("Passewrod is correct!")
        return user;
    }
    else return null;

  } catch (error) {
    console.error("Error checking credentials:", error);
    throw error; // Throw the error to be caught and handled by the caller
  }
}

async function login(req, res) {
  console.log("... login ... \n");
  const { username, password } = req.body;
  var dateObj = new Date();
  const currentTime = dateObj.toISOString();
  try {


    const matched = await checkCreds(username, password);

    const userHistory = await prisma.users.findUnique({
      where: { username: username}
    })
    //console.log("~~~~~~~~~~~~~~~~ ",userHistory)
    

    await prisma.users.update({
      where: { username: username },
      data: {
        activity:{
          push:{
            loginTime: currentTime
          }
        }
      }
    })
    console.log(">> pushed to db")
    
    if (matched) {
        const secretKey = 'secretto'
      console.log("✅✅✅ Matched! ", username, password);
      const token = jwt.sign({ username: matched.username}, secretKey, { expiresIn: '24h' });
      //console.log(token);
      
      res.status(200).send({token});
    } else if(matched === null) {
        console.log("🔴🔴🔴 Wrong password");
        res.status(401).send("Wrong Password");
    } else{
        console.log("🔴🔴🔴 No match found!");
        res.status(401).send("No match found");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  login,
};
