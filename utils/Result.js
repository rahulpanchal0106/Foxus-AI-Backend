const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY_PaLM2 = process.env.API_KEY_PaLM2;

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY_PaLM2),
});

async function generateText_PaLM2(context = "", examples = [], messages = []) {
  try {
    console.log(messages);
    const result = await client.generateMessage({
      model: MODEL_NAME,
      temperature: 0.6, // Adjust as needed
      candidateCount: 1,
      top_k: 50,
      top_p: 0.9,
      prompt: { context, examples, messages },
    });

    //handling undefined cases
    if (result[0] && result[0].candidates[0]) {
      return result[0].candidates[0].content;
  } else {
      console.log(result);
      return "No content generated"; // Or throw an error, log a message, etc.
  }
  } catch (error) {
    console.error("Error in generateText:", error);
    return "null"; // Re-throw for handling in the calling function
  }
}

async function generateText_Gemini(context = "", examples = [],prompt){
  const genAI = new GoogleGenerativeAI(process.env.API_KEY_Gemini);
  const generationConfig = {
      stopSequences: ["red"],
      maxOutputTokens: 200,
      temperature: 0.1, 
      topP: 0.3,        
      topK: 10,       
  };
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro",generationConfig:generationConfig });
  try{
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
  }catch(e){
      console.log(e)
      return "null";
  }

}

module.exports = { generateText_PaLM2,generateText_Gemini };