// Import necessary modules
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

// Secret key for JWT
const secretKey = 'secretto';

// Function to check if request is authentic
async function isAuthentic(req) {
    try {
        // Extract token from request headers
        const token = req.headers.authorization;

        if (!token) {
            return false;
        }

        // Verify token
        const decoded = await jwt.verify(token, secretKey);

        // Check if user exists in the database (you can customize this part based on your user model)
        const user = await prisma.users.findUnique({
            where: { username: decoded.username }
        });

        return user ? true : false;
    } catch (error) {
        console.error('Error in isAuthentic:', error);
        return false;
    }
}

// Middleware function to authenticate requests
async function auth(req, res, next) {
    try {
        if (await isAuthentic(req)) {
            console.log("Yea, shit's good, let it pass... 😀👍");
            next();
        } else {
            console.log("Unauthentic");
            res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = auth;
