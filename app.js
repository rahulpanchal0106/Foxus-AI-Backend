const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors  = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const rateLimit = require('express-rate-limit');

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
const getActivity = require("./Controllers/activity.controller.js")
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
    windowMs: 10000,
    max:2,
    handler: (req, res) => {
        res.status(429).json({ error:  "⚠️⚠️⚠️ server overload, please try again in a 10 seconds"});
    },
    validate: {xForwardedForHeader: false} 
});
// app.set('trust proxy', true); 




app.use(morgan('combined'))
app.post('/login', login);
//app.post('/signup', (req,res)=>{
//  res.status(401).send("Join the waitlist to get access to our app!   https://forms.gle/AfcJwz5mMZkMHADL6")
//} );        //postuser
app.post('/signup',postUser);
app.get('/',getHome);
app.post('/layer3',limiter,auth,sendLayer3);
app.post('/layer2',limiter,auth,sendLayer2);
app.post('/layer1',auth,sendLayer1)
app.post('/layer0',auth,sendLayer0)
app.post("/send", postMessage);
app.post('/quiz',getQuiz);
app.post('/doubt', postDoubt)
app.get('/activity',auth,getActivity);
// console.log(explainTopic);
module.exports = app;
