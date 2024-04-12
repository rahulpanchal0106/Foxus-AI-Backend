const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const secretKey = 'secretto';

async function isAuthentic(req) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {authentic: false, message: 'Token header missing "Bearer" prefix'};
        }
        const token = authHeader.split(' ')[1];

        const decoded = jwt.decode(token);
        if (decoded.exp <= Date.now() / 1000) {
            console.log("expired ⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕")
            return { authentic: false, message: 'Token is expired' };
        }

        const verifiedToken = await jwt.verify(token, secretKey);
        const user = await prisma.users.findUnique({
            where: { username: verifiedToken.username }
        });
        return user ? {authentic: true, message: 'Token has been verified'} : {authentic: false, message: 'Invalid token'};
    } catch (error) {
        console.error('Error in isAuthentic:', error);
        return {authentic: false, message: 'Error in isAuthentic()'};
    }
}


async function auth(req, res, next) {
    try {
        const jwtAuth = await isAuthentic(req);
        if (jwtAuth.authentic) {
            console.log("Token is verified");
            next();
        } else {
            console.log();
            res.status(401).json({ message: jwtAuth.message });
        }
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = auth;
