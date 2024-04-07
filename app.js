const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

const getAllUsers=require('./Controllers/getAllUsers.js')
const postUser= require('./Controllers/postUser.js')
const getHome = require('./Controllers/getHome.js')
app.use(express.json());

app.get('/users', getAllUsers);
app.post('/users',postUser);
app.get('/',getHome);

module.exports=app;