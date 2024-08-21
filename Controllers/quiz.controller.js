
const { generateText_PaLM2 } = require("../utils/Result");

require("dotenv").config();

async function generatequiz(req, res) {
  const input = req.body.prompt;
  const prompt = `Generate 2 Multiple choice question  quiz. question must contain four option A) , B), C), D) and question must start with it's question number and after each question provide answer for it respectively. questions must be one liner  from the text of: ${input.data}.Generate quiz directly no other chit-chat`;
  var messages = [];

  console.log("processing...");


  let PaLM_res;
  const context = `Generate 2 Multiple choice question  quiz. question must contain four option A) , B), C), D) and question must start with it's question number and after each question provide answer for them. questions must be one liner from the text of: ${input.data} .Generate quiz directly no other chit-chat`;
  const examples = [];

  console.log(`Prompt arrived..... ${prompt}`);
  // // log(`Prompt arrived..... ${prompt}`);
  messages.push({ content: prompt });
  const resp = await generateText_PaLM2(context, examples, messages);

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

  console.log(`✨ ${resp}`);
  console.log(`Size of request payload: ${sizeInBytes} bytes`);
  // const questions = parseQuizData(resp);
  // console.log(questions);
  res.status(200).json({ result: `${resp}` });


  console.log(messages);
 messages.push({ content: "NEXT REQUEST" });
}

module.exports = generatequiz;

