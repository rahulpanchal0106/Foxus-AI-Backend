require("dotenv").config();
//REQUIREMENTS: req.body must have prompt:"<SUBJECT NAME>"
const { generateText } = require("../utils/Result");
var levels = [];
//if prompt contain following keyword then it is considered as simple and we can directly answer is as it is

async function sendLayer0(req, res) {
  const input = req.body.prompt;
  const lesson = req.body.lessonName;
  const chapter = req.body.chapter;
  const subject = req.body.subject;
  const lessonExplaination = req.body.lessonExplaination;
  console.log(`🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥`,lesson,chapter,subject,lessonExplaination)
  const prompt = `I have a doubt on the lesson:${lesson} from chapter:${chapter} of the subject:${subject}. The doubt is, ${input}`
  var messages = [];
  levels = [];

  console.log("processing...");

  let PaLM_res;
  const context = `Answer the asked doubt on the lesson name:${lesson} from chapter:${chapter} of the subject:${subject}, The question will be regardning the following lesson: ${lessonExplaination}`;
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
