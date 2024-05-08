const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
async function postUser(req,res){
    try {
        // Extract user data from request body
        const { username, password } = req.body;
        const ip_address = req.ip;
        console.log(">>>>> ",ip_address)
        const activity = [];
    
        // Create a new user in the database using Prisma Client
        const newUser = await prisma.users.create({
          data: {
            ip_address,
            username,
            password,
            activity
          },
        });
    
        // Send a success response with the newly created user
        res.status(201).json(newUser);
      } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = postUser;