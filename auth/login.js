const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

async function checkCreds(u, p) {
  try {
    const user = await prisma.users.findUnique({
      where: { username: u }
    });

    if (!user) {
      return false; // User not found
    }
    if (user.password === p) {
      console.log("Password is correct!");
      return user;
    } else {
      return null; // Wrong password
    }

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

    if (matched) {
      const userHistory = await prisma.users.findUnique({
        where: { username: username }
      });

      if (userHistory) {
        const updatedActivity = [...userHistory.activity, { loginTime: currentTime }];

        await prisma.users.update({
          where: { username: username },
          data: {
            activity: updatedActivity
          }
        });
        console.log(">> pushed to db");
      }

      const secretKey = 'secretto';
      console.log("✅✅✅ Matched! ", username, password);
      const token = jwt.sign({ username: matched.username }, secretKey, { expiresIn: '24h' });

      res.status(200).send({ token });
    } else if (matched === null) {
      console.log("🔴🔴🔴 Wrong password");
      res.status(401).send("Wrong Password");
    } else {
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
