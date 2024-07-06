const { generateText } = require("../utils/Result");

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken')

require("dotenv").config();

//REQUIREMENTS: req.body must have prompt:{
// "levelName": "<LEVEL NAME>",
// "levelContent": "<LEVEL INFO>",
// "subject":"<SUBJECT NAME>" }

async function postLayer1(req, res) {
    //Decoding username from cookie
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    
    const username = decoded.username;

  const input = req.body.prompt; //should contain levelName, levelContent and Subject
  const prompt = `List possible chapters for the ${input.levelName} level  Subject: ${input.subject}. It must be a final list of all the possible chapters. Let me give you a brief intro: ${input.levelContent},here please try to provide more number of chapters  if possible along with the topics that are to be included as per the brief intro.Additionally do not give any additional information about the chapters.`;
  var messages = [];

  console.log("processing...");

  let PaLM_res;
  const level = req.body.level;
  var index = req.body.index;
  // const context = `Give an array of possible lessons for the given topic ${prompt}. Consider the name of level : ${}`;
  const context = `List possible chapters for the ${input.levelName} level  Subject: ${input.subject}. It must be a final list of all the possible chapters. Let me give you a brief intro: ${input.levelContent}, here please try to provide more number of chapters  if possible along with the topics that are to be included as per the brief intro. Additionally do not give any additional information about the chapters`;
  const examples = [
    {
      "input": { "content": "List possible chapters for the Beginner level topic, that is about: This level is for people who are new to Java and want to learn the basics of the language. Topics covered at this level include variables, data types, operators, control flow statements, and arrays., and of the Subject: Java. It must be a final list of all the possible chapters" },
      "output": { "content": `
      Here are some possible chapters for a beginner-level Java tutorial:
* **Introduction to Java**
  * What is Java?
  * History of Java
  * Features of Java
  * Installing and configuring Java
* **Variables and data types**
  * Variables
  * Data types
  * Primitive data types
  * Reference data types
* **Operators**
  * Arithmetic operators
  * Relational operators
  * Logical operators
  * Assignment operators
* **Control flow statements**
  * If statement
  * Switch statement
  * While loop
  * Do-while loop
  * For loop
* **Arrays**
  * What is an array?
  * Creating and initializing arrays
  * Accessing elements of an array
  * Traversing an array
* **Functions**
  * What is a function?
  * Creating and calling functions
  * Passing arguments to functions
  * Returning values from functions
* **Classes and objects**
  * What is a class?
  * Creating and instantiating classes
  * Accessing members of a class
  * Inheritance
  * Polymorphism
* **Interfaces**
  * What is an interface?
  * Implementing interfaces
  * Using interfaces
* **Exception handling**
  * What is an exception?
  * Throwing exceptions
  * Catching exceptions
  * Handling exceptions
* **Input/output**
  * Reading input from the user
  * Writing output to the console
  * Reading input from a file
  * Writing output to a file
* **Networking**
  * Creating a socket connection
  * Sending and receiving data over a socket connection
* **GUI programming**
  * Creating a graphical user interface
  * Using Swing components
  * Handling events
* **Database programming**
  * Connecting to a database
  * Creating and manipulating database tables
  * Executing SQL queries
* **Web development**
  * Creating a web application
  * Using servlets and JSP
  * Handling HTTP requests and responses
These are just some of the many topics that could be covered in a beginner-level Java tutorial. The specific topics covered will vary depending on the intended audience and the level of detail desired.
      `}
    },
    {
      "input": { "content": "List possible chapters for the Intermediate level topic, that is about: This level is for people who have a basic understanding of Physics and want to learn more advanced topics, such as thermodynamics, quantum mechanics, and relativity. Topics covered at this level include heat, light, and atoms., and of the Subject: Physics. It must be a final list of all the possible chapters" },
      "output": { "content": `
      Here is a list of possible chapters for the Intermediate level topic, that is about: This level is for people who have a basic understanding of Physics and want to learn more advanced topics, such as thermodynamics, quantum mechanics, and relativity. Topics covered at this level include heat, light, and atoms., and of the Subject: Physics.
* **Thermodynamics**
    * Introduction to thermodynamics
    * The first law of thermodynamics
    * The second law of thermodynamics
    * Entropy
    * Statistical mechanics
* **Quantum mechanics**
    * Introduction to quantum mechanics
    * The wave nature of matter
    * The uncertainty principle
    * The Schrödinger equation
    * Quantum states and operators
    * Quantum mechanics of atoms and molecules
* **Relativity**
    * Introduction to relativity
    * Special relativity
    * General relativity
    * Black holes
    * The Big Bang
This list is just a suggestion, and the specific chapters that are included in a course will vary depending on the instructor and the level of the students.`}
    }
    
  ];

  console.log(`Prompt arrived..... ${prompt}`);

  // log(`Prompt arrived..... ${prompt}`);
  messages.push({ content: prompt });
  const resp = await generateText(context, examples, messages);
  
  if(resp=='null'){
    return res.status(501).json({error:"Error from chat-bison-001"})
  }else if(resp=="No content generated"){
    res.status(501).json({error:"No response from PaLM2"})
  }else{

    // if(sizeInBytes>=20000){
    //     messages.pop();
    // }
    messages.push({ content: resp });
  
    function getArraySizeInBytes(arr) {
      var jsonString = JSON.stringify(arr);
      var bytes = Buffer.from(jsonString).length;
      return bytes;
    }
    var sizeInBytes = getArraySizeInBytes(messages);
  
    // console.log(`\n⚡Prompt: ${convo.prompt}\n✨Response:${convo.resp}`);
    //console.log(`✨ ${resp}`);
  
    const lines = resp.split("\n");
    const topics = [];
  
    lines.forEach((line) => {
      if (
        line.startsWith("* **") ||
        line.startsWith("*") ||
        line.startsWith(" *")||
        line.match(/^\d/)
      ) {
        const topicName = line.replace("* **", "").replace("*", "").trim();
        topics.push(topicName);
      }
    });
  
    console.log("🔥🔥 Chapters: ", topics);
    const output = {
      chapters: topics,
      level: input.levelName,
      subject: input.subject,
      levelContent: input.levelContent
    };
    console.log(`Size of request payload: ${sizeInBytes} bytes`);
    res.status(200).json(output);

    const userHistory = await prisma.users.findUnique({
      where: { username: username}
    })
    const history_array = userHistory.activity;
    
    //console.log("l0_index: ",index);

    //const max_l1_length = history_array[history_array.length-1].layer0.response.length;
    const max_l1_length = 15
    
    var layer1_updated = history_array[history_array.length-1].layer0.layer1;

    layer1_updated.length = max_l1_length;
    
    for (let i = 0; i < layer1_updated.length; i++) {
      if (layer1_updated[i] === undefined) {
        layer1_updated[i] = null;
      }
    }
    // const layer0_indecies = req.body.layer0_indecies;
    if(history_array[history_array.length-1].layer0.layer1_indecies.length!=0){
      index=history_array[history_array.length-1].layer0.layer1_indecies[history_array[history_array.length-1].layer0.layer1_indecies.length-1]
    }
    history_array[history_array.length-1].layer0.layer0_indecies.push(index)
    
    layer1_updated[index] = 
    {
      prompt: input,
      response: output,
      layer2:[]
    }
    
    //console.log("🟩🟩🟩🟩 ",layer1_updated, "\n CCCCCCCCCC ",max_l1_length, "\n UUUUU ",layer1_updated.length)
      await prisma.users.update(
        {
        where: { username: username },
        data: {
          activity: history_array
        }
      }
    );
    
    console.log("layer1 data updated on db")
  
    // console.log(messages);
    messages.push({ content: "NEXT REQUEST" });
  }
}

module.exports = postLayer1;
