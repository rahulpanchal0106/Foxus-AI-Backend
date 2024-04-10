require("dotenv").config();
//REQUIREMENTS: req.body must have prompt:"<SUBJECT NAME>"
const { generateText } = require("../utils/Result");
var levels = [];
//if prompt contain following keyword then it is considered as simple and we can directly answer is as it is
function isDirectQuestion(question) {
  const directKeywords = [
    "what is",
    "who is",
    "how many",
    "when did",
    "definition",
    "capital",
    "formula",
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

  console.log(topicsText);
  return topicsText;
}
async function sendLayer0(req, res) {
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
  const context = `List appropriate levels for the topic: ${prompt}. And Do not give any extra tips, just give what's being asked.`;
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

  const lines = resp.split("\n");
  if (isDirectQuestion(prompt)) {
    // Attempt to get a direct answer
    const directAnswer = await getDirectAnswer(prompt, client);

    if (directAnswer) {
      res.status(200).json({ result: directAnswer }); 
    } else {
      res.status(200).json({ error: "Unable to find a direct answer" });
    }
  } else {
    // Generate topics and explain the selected one
    const context = `Give name of 5 topics related to ${prompt} in one word only`;
    const examples = [];
    console.log(`Prompt arrived..... ${prompt}`);
    messages.push({ content: prompt });

    const topicsText = await generateText(context, examples, messages);
    lines.forEach((line) => {
      if (line.startsWith("* **") || line.startsWith("*")) {
        const level = line.replace("* **", "").replace("*", "").trim();
        levels.push(level);
      }
    });

    console.log("🔥🔥", levels);

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
          levelContent: content ? content.trim() : "", // Handle case where there's no content after ":"
          subject: prompt,
        };
      }
    });
    console.log(levelsJson);

    console.log(`Size of request payload: ${sizeInBytes} bytes`);
    res.status(200).json(levelsJson);
  }

  // console.log(messages);
  messages.push({ content: "NEXT REQUEST" });
}

module.exports = sendLayer0;
