const { generateText } = require("../utils/Result");

require("dotenv").config();
//REQUIREMENTS: req.body must have prompt:{
// "lessonName": "<LESSON NAME>",
// "lessonContent": "<LESSON INFO>",
// "chapter":"<CHAPTER NAME>",
// "levelName":"<LEVEL NAME>",
// "subject":"<SUBJECT NAME>"
// }
async function sendLesson3(req, res) {
  const input = req.body.prompt;
  console.log("🐸🐸🐸 ",input)
  const prompt = `Teach me in details and give comprehensive insights with suitable examples about the lesson: ${input.lessonName}. Here is a quick intro about this lesson: ${input.lessonContent}. The lesson must be in context of the chapter: ${input.chapter}. This lesson is a part of the subject: ${input.subject}.`;
  var messages = [];

  console.log("processing...");
  
  const { DiscussServiceClient } = require("@google-ai/generativelanguage");
  const { GoogleAuth } = require("google-auth-library");

  const MODEL_NAME = "models/chat-bison-001";
  const API_KEY = process.env.API_KEY;

  const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });

  let PaLM_res;
  const context = `Teach in details and give comprehensive insights with examples about the lesson: ${input.lessonName}. Here is a quick intro about this lesson: ${input.lessonContent}. The lesson should be in context of the chapter: ${input.chapter}. This lesson is a part of the subject: ${input.subject}. I have ${input.levelName} level experience. Please include any example of the code if this subject or lesson or chapter requires one for better understanding.`;
  const examples = [];

  console.log(`Prompt arrived..... ${prompt}`);
  // log(`Prompt arrived..... ${prompt}`);
  messages.push({ content: prompt });
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
  console.log(`✨ ${resp}`);
  console.log(`Size of request payload: ${sizeInBytes} bytes`);
  if(resp=="No content generated"){
    res.status(501).json({error:"No response from PaLM2"})
  }else{

    res.status(200).json({ result: `${resp}` });
  }

  // console.log(messages);
  messages.push({ content: "NEXT REQUEST" });
}

module.exports = sendLesson3;
