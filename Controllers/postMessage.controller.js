// IF YOU ARE CREATING ANY ANOTHER FUNCTION FOR PROMPT YOU HAVE TO PROVIDE  const examples = [] along with context....

require("dotenv").config();

const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const { generateText,generateText_Gemini } = require("../utils/Result");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.API_KEY_Gemini;

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});
//✅
async function postMessage(req, res) {
  const prompt = req.body.prompt;
  const messages = [];

  console.log("processing...");

  try {
    //if question is simple then don't divide propmpt into different topics
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

      const topicsText = await generateText_Gemini(
        context,
        examples,
        prompt
      );

      // const resp = result[0].candidates[0].content;
      // console.log(resp);
      const topics = topicsText.split("\n*").map((topic) => topic.trim());
      console.log(topics);

      // Replace this with actual logic to get user's choice (what user click on front-end)
      const selectedTopicIndex = 2;
      const selectedTopic = topics[selectedTopicIndex];

      try {
        const detailedExplanation = await explainTopic(selectedTopic, client);
        const quizQuestions = await generateQuiz(selectedTopic, client);
        res
          .status(200)
          .json({ topics, detailedExplanation, quiz: quizQuestions });
        console.log(detailedExplanation);
        console.log(quizQuestions);
      } catch (error) {
        console.error("Error explaining topic:", error);
        res.status(500).json({ error: "Failed to explain topic" });
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

//if prompt contain following keyword then it is considered as simple and we can directly answer is as it is ✅
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

// For getting answer directly ✅
async function getDirectAnswer(question, client) {
  const context = `Answer the following question directly and concisely: ${question}`;
  const examples = [];
  const messages = [{ content: question }];

  const topicsText = await generateText_Gemini( context, examples, question);

  console.log(topicsText);
  return topicsText;
}

// explain selected topic in detail ✅
async function explainTopic(topic, client) {
  const context = `Explain the following topic in detail, providing comprehensive information and insights: ${topic}`;
  const examples = [];
  const messages = [{ content: topic }];

  const topicsText = await generateText_Gemini( context, examples, topic);
  return topicsText;
}

//Generate quiz ✅
async function generateQuiz(topic, client) {
  const context = `Generate 5 multiple choice questions with 4 options each based on the topic: ${topic}.
  Ensure one option is correct and others are plausible distractors. Provide the correct answer for each question.`;
  const examples = [];
  const messages = [{ content: topic }];

  const quizData = await generateText_Gemini( context, examples, topic);

  // Parse and structure quiz data (e.g., into an array of question objects)
  console.log(quizData);
  const questions = parseQuizData(quizData);
  console.log(questions);
  return questions;
}

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

module.exports = postMessage;