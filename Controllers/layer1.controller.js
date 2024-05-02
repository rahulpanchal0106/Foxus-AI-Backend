const { generateText } = require("../utils/Result");

require("dotenv").config();

//REQUIREMENTS: req.body must have prompt:{
// "levelName": "<LEVEL NAME>",
// "levelContent": "<LEVEL INFO>",
// "subject":"<SUBJECT NAME>" }

async function postLayer1(req, res) {
  const input = req.body.prompt; //should contain levelName, levelContent and Subject
  const prompt = `List possible chapters for the ${input.levelName} level topic, that is about: ${input.levelContent}, and of the Subject: ${input.subject}. It must be a final list of all the possible chapters`;
  var messages = [];

  console.log("processing...");

  let PaLM_res;
  const level = req.body.level;
  // const context = `Give an array of possible lessons for the given topic ${prompt}. Consider the name of level : ${}`;
  const context = `List possible chapters for the topic content: ${input.levelContent}, for topic level: ${input.levelName}, and the Subject: ${input.subject}. It must be a final list of all the possible chapters`;
  const examples = [];

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
    console.log(`✨ ${resp}`);
  
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
  
    console.log("🔥🔥", topics);
    const output = {
      chapters: topics,
      level: input.levelName,
      subject: input.subject,
      levelContent: input.levelContent
    };
    console.log(`Size of request payload: ${sizeInBytes} bytes`);
    res.status(200).json(output);
  
    // console.log(messages);
    messages.push({ content: "NEXT REQUEST" });
  }
}

module.exports = postLayer1;
