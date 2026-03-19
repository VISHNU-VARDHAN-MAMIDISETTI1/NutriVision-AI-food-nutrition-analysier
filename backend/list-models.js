const { GoogleGenerativeAI } = require("@google/generative-ai");

async function list() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // get models using fetch directly since sdk might not expose listModels clearly
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    console.log(data.models.map(m => m.name).join("\n"));
}

list();
