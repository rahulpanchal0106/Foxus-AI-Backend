const { generateText } = require("../utils/Result");
// // structure the quizData into appropriate formate ✅
function parseQuizData(quizData) {
    const questions = [];
    const lines = quizData.trim().split("\n");
    let currentQuestion = null;
  
    for (const line of lines) {
      if (line.startsWith("Q:")) {
        currentQuestion = { question: line.substring(2).trim(), options: [], answer: null };
        questions.push(currentQuestion);
      } else if (line.match(/^[A-D]:/)) {
        const optionLetter = line.substring(0, 2).trim();
        const optionText = line.substring(2).trim();
        currentQuestion.options.push({ letter: optionLetter, text: optionText });
        if (line.includes("(Correct)")) {
          currentQuestion.answer = optionLetter;
        }
      }
    }
  
    return questions;
  }

  async function generateQuiz(topic, client) {
    const context = `Generate 5 multiple choice questions with 4 options each based on the topic: ${topic}.
    Ensure one option is correct and others are plausible distractors. Provide the correct answer for each question.`;
    const examples = [];
    const messages = [{ content: topic }];
  
    const quizData = await generateText( context, examples, messages);
  
    // Parse and structure quiz data (e.g., into an array of question objects)
    console.log(quizData);
    const questions = parseQuizData(quizData);
    console.log(questions);
    return questions;
  }
  

async function quiz(req,res){
    const selectedTopic = req.body.prompt;

    try {
        const quizQuestions = await generateQuiz(selectedTopic, client);
        res.status(200).json({quiz: quizQuestions });
        // console.log(detailedExplanation);
        console.log(quizQuestions);
      } catch (error) {
        console.error("Error Geerating Quiz:", error);
        res.status(500).json({ error: "Failed to Generate Quiz" });
      }
}

module.exports = quiz;
