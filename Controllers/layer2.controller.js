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
  const prompt = `List all possible lessons for chapter ${input.chapter} in ${input.subject}, at level ${input.levelName}. Provide brief notes along with lesson names.`;
  var messages = [];
  lessons = [];

  console.log("processing...");
  let PaLM_res;
  const context = `List all possible lessons from chapter ${input.chapter} for ${input.subject} at level ${input.levelName}. Provide brief notes along with the lesson names. and do not provide any additional details about each lesson`;
  const examples = [
    // {
    //   "input": { "content": "List out all possible lessons from chapter: Generating Code with Regular Expressions. for the subject: Reguler Expressions, that is of level: Intermediate.  Try to write a very brief note about the lessons after the name of lessons." },
    //   "output": { "content": "Sure, here are some possible lessons from the chapter: Generating Code with Regular Expressions for the subject: Reguler Expressions, that is of level: Intermediate:* **Lesson 1: Introduction to Regular Expressions*This lesson will introduce you to the basics of regular expressions, including the different types of characters that can be used in regular expressions, how to match patterns with regular expressions, and how to use regular expressions to generate code* **Lesson 2: Advanced Regular Expressions*This lesson will cover some more advanced topics in regular expressions, such as how to use regular expressions to match multiple patterns, how to use regular expressions to capture groups of characters, and how to use regular expressions to generate code that is more efficient* **Lesson 3: Using Regular Expressions with Different Programming Languages*This lesson will show you how to use regular expressions with different programming languages, such as Java, Python, and C++* **Lesson 4: Regular Expressions in the Real World*This lesson will show you how regular expressions are used in the real world, such as in web development, text processing, and data mining* **Lesson 5: Regular Expressions Cheat Sheet*This lesson will provide you with a cheat sheet of regular expressions that you can use as a reference.     I hope this helps!" }
    // },
    
    {
      "input": { "content": "List out all possible lessons from chapter: Functions*. for the subject: Java, that is of level: Beginner.  Try to write a very brief note about the lessons along with the name of lessons. don't explain it again" },
      "output": { "content": `Here are some possible lessons from the chapter Functions for the subject Java at level Beginner:
      * **Introduction to functions:** This lesson would introduce students to the concept of functions and how they can be used to group together related code.
      * **Defining functions:** This lesson would teach students how to define their own functions.
      * **Calling functions:** This lesson would teach students how to call functions that they have defined.
      * **Passing arguments to functions:** This lesson would teach students how to pass data into functions.
      * **Returning values from functions:** This lesson would teach students how to return values from functions.
      * **Recursion:** This lesson would teach students about recursion, which is a technique where a function calls itself.
      * **Functions and objects:** This lesson would teach students how to use functions in conjunction with objects.
      These are just a few possible lessons that could be covered in a chapter on functions. The specific lessons that are covered will vary depending on the level of the students and the specific needs of the organization.
      `}
    },
    {
      "input": { "content": "List out all possible lessons from chapter: 3. Operators. for the subject: Java, that is of level: Beginner.  Try to write a very brief note about the lessons along with the name of lessons. don't explain it again" },
      "output": { "content": `Sure, here are some possible lessons from the chapter Operators for the subject Java at level Beginner:
      * **Arithmetic Operators:** This lesson would introduce students to the arithmetic operators, which are used to perform mathematical operations on numbers.
      * **Relational Operators:** This lesson would introduce students to the relational operators, which are used to compare two values.
      * **Logical Operators:** This lesson would introduce students to the logical operators, which are used to combine two or more boolean expressions.
      * **Bitwise Operators:** This lesson would introduce students to the bitwise operators, which are used to manipulate the bits of a number.
      * **Assignment Operators:** This lesson would introduce students to the assignment operators, which are used to assign values to variables.
      * **Increment and Decrement Operators:** This lesson would introduce students to the increment and decrement operators, which are used to increase or decrease the value of a variable by 1.
      * **Conditional Operator:** This lesson would introduce students to the conditional operator, which is used to choose between two expressions based on a condition.
      * **Operator Precedence:** This lesson would introduce students to operator precedence, which is the order in which operators are evaluated in an expression.
      * **Operator Associativity:** This lesson would introduce students to operator associativity, which is the order in which operands are grouped together in an expression.
      These are just a few possible lessons that could be covered in a chapter on operators. The specific lessons that are covered will vary depending on the level of the students and the specific needs of the organization.
      `}
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
