const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.API_KEY;

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

async function generateText(context = "", examples = [], messages = []) {
  try {
    const result = await client.generateMessage({
      model: MODEL_NAME,
      temperature: 0.6, // Adjust as needed
      candidateCount: 1,
      top_k: 50,
      top_p: 0.9,
      prompt: { context, examples, messages },
    });
    return result[0].candidates[0].content;
  } catch (error) {
    console.error("Error in generateText:", error);
    return null; // Re-throw for handling in the calling function
  }
}

module.exports = { generateText };