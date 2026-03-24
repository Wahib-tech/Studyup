const dotenv = require("dotenv");
dotenv.config();

async function checkApi() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Response Status:", response.status);
    if (data.models) {
      console.log("Models Available:");
      data.models.forEach(m => console.log(m.name));
    } else {
      console.log("Error Response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Fetch Error:", error.message);
  }
}

checkApi();
