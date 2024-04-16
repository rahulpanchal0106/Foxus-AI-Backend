const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors  = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();

const getAllUsers=require('./Controllers/getAllUsers.controller.js')
const postUser= require('./auth/signup.js')
const getHome = require('./Controllers/getHome.controller.js')
const sendLayer3 = require('./Controllers/layer3.controller.js')
const sendLayer2 = require('./Controllers/layer2.controller.js')
const sendLayer1 = require('./Controllers/layer1.controller.js')
const sendLayer0 = require('./Controllers/layer0.controller.js')
const getQuiz = require('./Controllers/gQuiz.controller.js')
const postDoubt = require('./Controllers/doubt.controller.js')
const auth = require('./auth/auth.js')
const postMessage = require("./Controllers/postMessage.controller.js");
const { login } = require("./auth/login.js");

app.use(express.json());
app.use(cors());

app.use(morgan('combined'))
app.post('/login', login);
app.post('/signup',postUser);
app.get('/',getHome);
app.post('/layer3',auth,sendLayer3);
app.post('/layer2',auth,sendLayer2);
app.post('/layer1',auth,sendLayer1)
app.post('/layer0',auth,sendLayer0)
app.post("/send", postMessage);
app.post('/quiz',getQuiz);
app.post('/doubt', postDoubt)
// console.log(explainTopic);
module.exports = app;
