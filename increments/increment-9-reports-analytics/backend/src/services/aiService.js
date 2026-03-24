const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateQuizFromText = async (text, subject, difficulty, count) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `Generate a quiz for the subject "${subject}" based on the following text.
  Difficulty: ${difficulty}
  Number of questions: ${count}
  IMPORTANT: Return ONLY a raw JSON array. NO markdown formatting, no backticks, no preamble. 
  Each object in the array must have: 
  "question_text", "question_type" (MCQ), "options" (array of 4 strings), "correct_answer", "explanation".
  
  Text: ${text.substring(0, 10000)}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    
    // Robust extraction: find the first '[' and last ']'
    const start = rawText.indexOf('[');
    const end = rawText.lastIndexOf(']');
    
    if (start === -1 || end === -1) {
        console.error("AI Response does not contain a JSON array:", rawText);
        throw new Error("AI failed to return a valid quiz format.");
    }

    const jsonText = rawText.substring(start, end + 1).trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini AI Error:", error.message);
    if (error.status === 402 || error.status === 429) {
        throw new Error("Gemini API Quota exceeded or key restricted.");
    }
    throw error;
  }
};

module.exports = { generateQuizFromText };
