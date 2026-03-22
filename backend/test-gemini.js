require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function check() {
  try {
    const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];
    for (const m of modelsToTry) {
      console.log(`Trying ${m}...`);
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent('Say hello');
        console.log(`SUCCESS: ${m} -> ${result.response.text()}`);
      } catch (err) {
        console.log(`FAILED: ${m} -> ${err.message}`);
      }
    }
  } catch(e) {
    console.error(e);
  }
}
check();