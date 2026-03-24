const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const result = await genAI.listModels();
    console.log("Available Models:");
    result.models.forEach(m => console.log(m.name));
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
