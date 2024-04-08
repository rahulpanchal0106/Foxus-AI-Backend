const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors  = require("cors");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();


const getAllUsers = require("./Controllers/getAllUsers.js");
const postUser = require("./Controllers/postUser.js");
const getHome = require("./Controllers/getHome.js");
const postMessage = require("./Controllers/postMessage.js");
app.use(express.json());
app.use(cors());

app.get("/users", getAllUsers);
app.post("/users", postUser);
app.get("/", getHome);
app.post("/send", postMessage); //need to add a session auth here
// console.log(explainTopic);

module.exports = app;
