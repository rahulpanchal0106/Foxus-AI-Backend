require("dotenv").config();
//REQUIREMENTS: req.body must have prompt:"<SUBJECT NAME>"
const { generateText } = require("../utils/Result");
var levels = [];
//if prompt contain following keyword then it is considered as simple and we can directly answer is as it is

async function sendLayer0(req, res) {
  const prompt = req.body.prompt;
  var messages = [];
  levels = [];

  console.log("processing...");

  let PaLM_res;
  const context = `solve ${prompt} this in few words`;
  const examples = [];

  console.log(`Prompt arrived..... ${prompt}`);
  messages.push({ content: prompt });
  const resp = await generateText(context, examples, messages);

  messages.push({ content: resp });

  console.log(`✨ ${resp}`);
res.status(200).json(resp)
  // console.log(messages);
  messages.push({ content: "NEXT REQUEST" });
}

module.exports = sendLayer0;
