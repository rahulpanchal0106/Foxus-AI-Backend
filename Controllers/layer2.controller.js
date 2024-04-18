const { generateText } = require("../utils/Result");

require("dotenv").config();

//REQUIREMENTS: req.body must have prompt:{
//     "chapter":"<CHAPTER NAME>",
//     "levelName":"<LEVEL NAME>",
//     "subject":"<SUBJECT NAME>"
// }

var lessons = [];
async function sendLayer2(req, res) {
  const input = req.body.prompt;
  const prompt = `List out all possible lessons from chapter: ${input.chapter}. for the subject: ${input.subject}, that is of level: ${input.levelName}.  Try to write a very brief note about the lessons after the name of lessons.`;
  var messages = [];
  lessons = [];

  console.log("processing...");
  let PaLM_res;
  const context = `List all the possible lessons from the chapter: ${input.chapter} for the subject of ${input.subject} at level ${input.levelName}.   Try to write a very brief note about the lessons after the name of lessons`;
  const examples = [
    // {
    //   "input": { "content": "List out all possible lessons from chapter: Generating Code with Regular Expressions. for the subject: Reguler Expressions, that is of level: Intermediate.  Try to write a very brief note about the lessons after the name of lessons." },
    //   "output": { "content": "Sure, here are some possible lessons from the chapter: Generating Code with Regular Expressions for the subject: Reguler Expressions, that is of level: Intermediate:* **Lesson 1: Introduction to Regular Expressions*This lesson will introduce you to the basics of regular expressions, including the different types of characters that can be used in regular expressions, how to match patterns with regular expressions, and how to use regular expressions to generate code* **Lesson 2: Advanced Regular Expressions*This lesson will cover some more advanced topics in regular expressions, such as how to use regular expressions to match multiple patterns, how to use regular expressions to capture groups of characters, and how to use regular expressions to generate code that is more efficient* **Lesson 3: Using Regular Expressions with Different Programming Languages*This lesson will show you how to use regular expressions with different programming languages, such as Java, Python, and C++* **Lesson 4: Regular Expressions in the Real World*This lesson will show you how regular expressions are used in the real world, such as in web development, text processing, and data mining* **Lesson 5: Regular Expressions Cheat Sheet*This lesson will provide you with a cheat sheet of regular expressions that you can use as a reference.     I hope this helps!" }
    // },
    {
      "input": { "content": "List out all possible lessons from chapter: Security in back-end development. for the subject: Web development, that is of level: Back-end development.  Try to write a very brief note about the lessons after the name of lessons." },
      "output": { "content": " Here are some possible lessons from the chapter Security in back-end development for the subject Web development at level Back-end development:* **Introduction to security in back-end development:** This lesson would introduce students to the importance of security in back-en development and thedifferent type of attacksthat can occr* **Authentication and authorization:** This lesson would cover the basic of authentication andauthorization, includin how toimplement them securey* **Data validation and sanitization:** This lesson would cover the importance o data validation andsanitization an how toimplement them securey* **Session management:** This lesson would cover th importance of sessionmanagement an how toimplement it securey* **Error handling:** This lesson would cover th importance of errorhandling an how toimplement it securey* **Logging and monitoring:** This lesson would cover the importanc of logging andmonitoring an how toimplement them securey* **Penetration testing:** This lesson would cover th importance of penetrationtesting an how toconduct it effectivey* **Security best practices:** This lesson would cover a variety of securit best practices thatcan b implemented inback-end developmetThese are just a few possible lessons that could be covered in a chapter on security in back-end development. The specific lessons that are covered will vary depending on the level of the students and the specific needs of the organization." }
    }

  ];

  console.log(`Prompt arrived..... ${prompt}`);
  // log(`Prompt arrived..... ${prompt}`);
  messages.push({ content: prompt });
  const resp = await generateText(context, examples, messages);
  if(resp=='null' || resp=="No content generated"){
    return res.status(501).json({error:"Error from chat-bison-001"})
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
  
    lines.forEach((line) => {
      if(/^\d/.test(line)){
        const lesson = line.trim();
        lessons.push(lesson);
      }
      else if (line.startsWith("* **") || line.startsWith("*")) {
        const lesson = line.replace("* **", "").replace("*", "").trim();
        lessons.push(lesson);
      }
    });
  
    console.log("🔥🔥", lessons);
  
    const lessonsJson = lessons.map((lessonStr) => {
      const parts = lessonStr.split(/:\*{0,2}/);
      return {
        lessonName:parts[0],
        lessonContent:parts[1]
      }
    });
    console.log(lessonsJson);
  
    console.log(`Size of request payload: ${sizeInBytes} bytes`);
    res.status(200).json(lessonsJson);
  
    // console.log(messages);
    messages.push({ content: "NEXT REQUEST" });

  }
}

module.exports = sendLayer2;

// const lessonsJson = lessons.map(lessonstr => {
//     // Check if the string contains ":*"
//     const delimiterIndex = lessonstr.indexOf(':*');
//     if (delimiterIndex !== -1) {
//       // If ":*" is found, split the string into name and content
//       const [name, content] = lessonstr.split(':*');
//       return {
//         lessonName: name.trim(),
//         lessonContent: content.trim()
//       };
//     } else {
//       // If ":*" is not found, split the string by ":"
//       const [name, content] = lessonstr.split(":");
//       return {
//         lessonName: name.trim(),
//         lessonContent: content ? content.trim() : '' // Handle case where there's no content after ":"
//       };
//     }
//   });
