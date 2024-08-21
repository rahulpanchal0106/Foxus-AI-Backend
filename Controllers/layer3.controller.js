const { generateText_PaLM2, generateText_Gemini } = require("../utils/Result");

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken')

require("dotenv").config();
//REQUIREMENTS: req.body must have prompt:{
// "lessonName": "<LESSON NAME>",
// "lessonContent": "<LESSON INFO>",
// "chapter":"<CHAPTER NAME>",
// "levelName":"<LEVEL NAME>",
// "subject":"<SUBJECT NAME>"
// }
async function sendLesson3(req, res) {
   //Decoding username from cookie
   const authHeader = req.headers.authorization;
   const token = authHeader.split(' ')[1];
   const decoded = jwt.decode(token);
   
   const username = decoded.username;

  const input = req.body.prompt;
  var index = req.body.index;
  //console.log("🐸🐸🐸 ",input)
  const prompt = `Teach me in details and give comprehensive insights with suitable examples about the lesson: ${input.lessonName}. Here is a quick intro about this lesson: ${input.lessonContent}. The lesson must be in context of the chapter: ${input.chapter}. This lesson is a part of the subject: ${input.subject}. Each lesson-name should be written along with a note like this, LESSONNAME: LESSON NOTE`;
  var messages = [];

  console.log("processing...");
  
  // const { DiscussServiceClient } = require("@google-ai/generativelanguage");
  // const { GoogleAuth } = require("google-auth-library");

  // const MODEL_NAME = "models/chat-bison-001";
  // const API_KEY = process.env.API_KEY;

  // const client = new DiscussServiceClient({
  //   authClient: new GoogleAuth().fromAPIKey(API_KEY),
  // });

  let PaLM_res;
  const context = `Teach in details and give comprehensive insights with examples about the lesson: ${input.lessonName}. Here is a quick intro about this lesson: ${input.lessonContent}. The lesson should be in context of the chapter: ${input.chapter}. This lesson is a part of the subject: ${input.subject}. I have ${input.levelName} level experience. Please include any example of the code if this subject or lesson or chapter requires one for better understanding.`;
  const examples = [];

  console.log(`Prompt arrived..... ${prompt}`);
  // log(`Prompt arrived..... ${prompt}`);
  messages.push({ content: prompt });
  // const resp = await generateText_PaLM2(context, examples, messages);
  const resp = await generateText_Gemini(context, examples, prompt);

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
  console.log(`✨ ${resp}`);
  console.log(`Size of request payload: ${sizeInBytes} bytes`);
  if(resp=="No content generated"){
    res.status(501).json({error:"No response from PaLM2"})
  }else{

    res.status(200).json({ result: `${resp}` });
  }

  // console.log(messages);
  messages.push({ content: "NEXT REQUEST" });

  const userHistory = await prisma.users.findUnique({
    where: { username: username}
  })
  const history_array = userHistory.activity;
  
  const layer1_indecies = history_array[history_array.length-1].layer0.layer1_indecies;
  const layer0_indecies = history_array[history_array.length-1].layer0.layer0_indecies;
  //console.log("}}}}}}}}} layer1_indecies ", layer1_indecies);
  // var layer3_updated = history_array[history_array.length-1].layer0.layer1[history_array[history_array.length-1].layer0.layer1.length -1].layer2[history_array[history_array.length-1].layer0.layer1[history_array[history_array.length-1].layer0.layer1.length -1].layer2.length-1].layer3
  var layer3_updated = history_array[history_array.length-1].layer0.layer1[layer0_indecies[layer0_indecies.length-1]].layer2[layer1_indecies[layer1_indecies.length-1]].layer3
  const max_l3_length = 17;
  layer3_updated.length = max_l3_length;
  for (let i = 0; i < layer3_updated.length; i++) {
    if (layer3_updated[i] === undefined) {
      layer3_updated[i] = null;
    }
  }
  
  layer3_updated[index]= {
    prompt: input,
    response: resp,
    
  };

  
  await prisma.users.update({
    where: {username: username},
    data:{
      activity: history_array
    }
  })
  console.log("layer3 data updated on db")
}

module.exports = sendLesson3;
