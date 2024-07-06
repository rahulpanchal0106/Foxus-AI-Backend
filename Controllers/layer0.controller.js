require("dotenv").config();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken')
//REQUIREMENTS: req.body must have prompt:"<SUBJECT NAME>"
const { generateText } = require("../utils/Result");
const { response } = require("../app");
var levels = [];
const secretKey = 'secretto';
//if prompt contain following keyword then it is considered as simple and we can directly answer is as it is
function isDirectQuestion(question) {
  const directKeywords = [
    "what",
    "who",
    "how",
    "when",
    "where",
    "definition",
    "capital",
    "formula",
    "define",
    "explain",
    "describe",
    "list",
    "name",
    "identify",
    "which",
    "is",
    "can",
    "are",
    "could",
    "should",
    "do",
    "does",
    "why",
    "must"
  ];
  return directKeywords.some((keyword) =>
    question.toLowerCase().startsWith(keyword)
  );
}
async function getDirectAnswer(question, client) {
  const context = `Answer the following question directly and concisely: ${question}`;
  const examples = [];
  const messages = [{ content: question }];

  const topicsText = await generateText(context, examples, messages);

  //console.log(topicsText);
  return topicsText;
}
async function sendLayer0(req, res) {

  //Decoding username from cookie
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = jwt.decode(token);
  
  const username = decoded.username;


  const prompt = req.body.prompt;

  
  var messages = [];
  levels = [];

  console.log("processing...");

  const { DiscussServiceClient } = require("@google-ai/generativelanguage");
  const { GoogleAuth } = require("google-auth-library");

  const MODEL_NAME = "models/chat-bison-001";
  const API_KEY = process.env.API_KEY;

  const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });

  let PaLM_res;
  const context = `List three levels of learning(Beginner,intermediate,expert) for the topic: ${prompt}. Here, do not explain in detail about the levels`;
  const examples = [
    {
      "input": { "content": "List appropriate levels of learning for the topic or subject: Three.js. " },
      "output": { "content": `Three.js is a cross-browser JavaScript library for creating and manipulating 3D graphics in web pages. It is based on WebGL, the open-standard API for rendering interactive 3D graphics within any compatible web browser.Three.js is a powerful and versatile library that can be used to create a wide variety of 3D applications, from simple 3D scenes to complex games and simulations. It is well-documented and has a large community of users and developers who can provide support and help with troubleshooting.Three.js is a great choice for anyone who wants to learn how to create 3D graphics in web pages. It is relatively easy to learn for beginners, but it also offers a lot of flexibility and power for more experienced developers.Here are three levels of learning for Three.js:
      * **Beginner:** This level is for people who are new to Three.js and want to learn the basics of how to use the library. This includes topics such as creating a scene, adding objects to the scene, and manipulating the camera.
      * **Intermediate:** This level is for people who have a basic understanding of Three.js and want to learn more advanced topics such as lighting, shadows, and animation.
      * **Expert:** This level is for people who are experienced with Three.js and want to learn how to create complex 3D applications. This includes topics such as physics, particles, and shaders.Each level of learning builds on the previous level, so it is important to start with the basics and work your way up. There are many resources available online to help you learn Three.js, including tutorials, documentation, and example code.Once you have a basic understanding of Three.js, you can start creating your own 3D applications. 
      There are many possibilities, so let your imagination run wild! ` }
    },
    {
      "input": { "content": "List appropriate levels of learning for the topic or subject: Three.js. " },
      "output": { "content": `Sure. Here are three levels of learning for the topic of 3D Portfolio Design using Three.js:
      * **Beginner:** This level is for people who are new to 3D design and want to learn the basics of Three.js. Topics covered at this level include setting up a development environment, creating basic 3D objects, and animating objects.
      * **Intermediate:** This level is for people who have a basic understanding of Three.js and want to learn more advanced topics, such as lighting, materials, and shaders. Topics covered at this level include creating more complex 3D objects, using materials to create realistic textures, and using shaders to create special effects.
      * **Expert:** This level is for people who are proficient in Three.js and want to learn how to create professional-quality 3D content. Topics covered at this level include creating 3D models from scratch, using Three.js to create interactive 3D applications, and using Three.js to create 3D animations.
      I hope this helps! `}
    },
    {
      "input": { "content": "List appropriate levels of learning for the topic or subject: Sudoku." },
      "output": { "content": `Sudoku is a logic-based, number-placement puzzle game. The objective is to fill a 9x9 grid with digits so that each row, column, and 3x3 subgrid contains all of the digits from 1 to 9.
      There are three levels of learning for Sudoku:
      * **Beginner:** This level is for people who are new to Sudoku and want to learn the basics of the game. Topics covered at this level include how to set up a Sudoku puzzle, how to identify the empty cells, and how to use the elimination method to solve the puzzle.
      * **Intermediate:** This level is for people who have a basic understanding of Sudoku and want to learn more advanced techniques, such as pattern recognition and backsolving. Topics covered at this level include how to identify common patterns in Sudoku puzzles, how to use backsolving to solve difficult puzzles, and how to solve Sudoku puzzles without using pencil marks.
      * **Expert:** This level is for people who are experienced with Sudoku and want to learn how to solve the most difficult puzzles. Topics covered at this level include how to identify and solve unique patterns, how to use advanced techniques such as x-wing and swordfish, and how to solve Sudoku puzzles in a timely manner.
      Each level of learning builds on the previous level, so it is important to start with the basics and work your way up. There are many resources available online to help you learn Sudoku, including tutorials, puzzles, and forums.
      Once you have a basic understanding of Sudoku, you can start solving puzzles of increasing difficulty. There are many different types of Sudoku puzzles available, so you can find one that is appropriate for your skill level. Sudoku is a great way to improve your problem-solving skills, and it is also a fun and challenging game.`}
    },
    {
      "input": { "content": "List appropriate levels of learning for the topic or subject: Chess." },
      "output": { "content": `Here are three levels of learning for the topic of Chess:
      * **Beginner:** This level is for people who are new to Chess and want to learn the basics of the game. Topics covered at this level include the rules of the game, how the pieces move, and basic opening principles.
      * **Intermediate:** This level is for people who have a basic understanding of Chess and want to learn more advanced topics, such as tactics, strategy, and endgame play. Topics covered at this level include common opening variations, how to identify and execute tactical motifs, and how to build a winning endgame position.
      * **Expert:** This level is for people who are proficient in Chess and want to learn how to play at the highest level. Topics covered at this level include opening preparation, endgame technique, and positional play. Topics covered at this level include studying the games of the great masters, analyzing your own games, and playing in tournaments.
      Each level of learning builds on the previous level, so it is important to start with the basics and work your way up. There are many resources available online to help you learn Chess, including tutorials, videos, and books. Once you have a basic understanding of the game, you can start playing against other people and practicing your skills.
      Chess is a complex and challenging game, but it is also very rewarding. With dedication and practice, you can improve your skills and become a better player.`}
    },
    {
      "input": { "content": "List appropriate levels of learning for the topic or subject: Embedded Systems." },
      "output": { "content": ` Embedded systems are computer systems that are designed to perform a specific task with minimal human intervention. They are used in a wide variety of applications, including automobiles, medical devices, and industrial control systems.
      There are three levels of learning for embedded systems:
      * **Beginner:** This level is for people who are new to embedded systems and want to learn the basics of how they work. Topics covered at this level include the components of an embedded system, the different types of embedded systems, and the programming languages used to develop embedded systems.
      * **Intermediate:** This level is for people who have a basic understanding of embedded systems and want to learn more advanced topics, such as hardware design, software development, and system integration. Topics covered at this level include the design of embedded systems, the development of embedded software, and the integration of embedded systems into larger systems.
      * **Expert:** This level is for people who are experienced with embedded systems and want to learn how to design and develop complex embedded systems. Topics covered at this level include the design of high-performance embedded systems, the development of real-time embedded systems, and the integration of embedded systems with other technologies.
      There are many resources available online to help you learn about embedded systems, including tutorials, documentation, and example code. You can also find many books and online courses on embedded systems.
      If you are interested in learning about embedded systems, I recommend starting with the beginner level and working your way up to the intermediate and expert levels. There is a lot to learn about embedded systems, but it is a rewarding field to work in.`}
    },
    {
      "input": { "content": "List appropriate levels of learning for the topic or subject: Machine Learning." },
      "output": { "content": ` Here are three levels of learning for the topic of machine learning:
      * **Beginner:** This level is for people who are new to machine learning and want to learn the basics. Topics covered at this level include supervised learning, unsupervised learning, and reinforcement learning.
      * **Intermediate:** This level is for people who have a basic understanding of machine learning and want to learn more advanced topics, such as deep learning and natural language processing. Topics covered at this level include neural networks, convolutional neural networks, and recurrent neural networks.
      * **Expert:** This level is for people who are proficient in machine learning and want to learn how to create and apply machine learning models to real-world problems. Topics covered at this level include machine learning algorithms, machine learning pipelines, and machine learning evaluation.
      I hope this helps!`}
    }
  ];

  console.log(`Prompt arrived..... ${prompt}`);
  const input = `List three or four levels of learning for the topic or subject: ${prompt}. do not go in details just write a brief note along with the level names. `
  // log(`Prompt arrived..... ${prompt}`);
  messages.push({ content: input });
  
  
  
  if (isDirectQuestion(prompt)) {
    // Attempt to get a direct answer
    const directAnswer = await getDirectAnswer(prompt, client);

    if (directAnswer) {
      res.status(200).json({ result: directAnswer });
    } else {
      res.status(200).json({ error: "Unable to find a direct answer" });
    }
  } else {
    const resp = await generateText(context, examples, messages);

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

    // Generate topics and explain the selected one
    messages.push({ content: prompt });

    // const topicsText = await generateText(context, examples, messages);
    lines.forEach((line) => {
      if (line.startsWith("* **") || line.startsWith("*")) {
        const level = line.replace("* **", "").replace("*", "").trim();
        levels.push(level);
      }
    });

    //console.log("🔥🔥 Levels: ", levels);

    const levelsJson = levels.map((levelStr) => {
      // Check if the string contains ":*"
      const delimiterIndex = levelStr.indexOf(":*");
      if (delimiterIndex !== -1) {
        // If ":*" is found, split the string into name and content
        const [name, content] = levelStr.split(":*");
        return {
          levelName: name.trim(),
          levelContent: content.trim(),
          subject: prompt,
        };
      } else {
        // If ":*" is not found, split the string by ":"
        const [name, content] = levelStr.split(":");
        return {
          levelName: name.trim(),
          levelContent: content ? content.trim() : "",
          subject: prompt,
        };
      }
    });
    console.log("🔥 Levels JSON: ",levelsJson);
    const dateObj = new Date();
    const currentTime = dateObj.toISOString();

    

    await prisma.users.update({
      where: { username: username },
      data: {
        activity: {
          push:{
            time: currentTime,
            layer0: {
              prompt: prompt,
              response: levelsJson,
              layer1:[],
              layer0_indecies:[],
              layer1_indecies:[],
            }
          }
        }
      }
    });
    
    console.log("layer0 data updated on db")
    console.log(`Size of request payload: ${sizeInBytes} bytes`);
    res.status(200).json(levelsJson);
  }

  // console.log(messages);
  messages.push({ content: "NEXT REQUEST" });
}

module.exports = sendLayer0;
