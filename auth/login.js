const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkCreds(u, p) {
  try {
    const user = await prisma.users.findUnique({
      where: {
        username: u,
      },
    });

    if (!user) {
      return false; // User not found
    }
    if(user.password === p) return true
    else return 'wp';

  } catch (error) {
    console.error("Error checking credentials:", error);
    throw error; // Throw the error to be caught and handled by the caller
  }
}

async function login(req, res) {
  console.log("... login ... \n");
  const { username, password } = req.body;
  try {
    const matched = await checkCreds(username, password);
    if (matched==true) {
      console.log("✅✅✅ Matched!");
      res.status(200).send("You are logged in");
    } else if(matched == 'wp') {
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
