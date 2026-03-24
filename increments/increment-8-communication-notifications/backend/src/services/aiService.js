const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateQuizFromText = async (text, subject, difficulty, count) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `Generate a quiz for the subject "${subject}" based on the following text.
  Difficulty: ${difficulty}
  Number of questions: ${count}
  Format should be a JSON array of objects with: 
  "question_text", "question_type" (MCQ), "options" (array of 4 strings), "correct_answer", "explanation".
  
  Text: ${text.substring(0, 10000)}`; // Basic limit

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonText = response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(jsonText);
};

module.exports = { generateQuizFromText };
