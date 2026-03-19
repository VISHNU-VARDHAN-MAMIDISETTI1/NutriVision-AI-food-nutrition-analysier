const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const multipart = require('@fastify/multipart');

fastify.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"]
});

fastify.register(multipart, {
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Mock AI Service Logic since Gemini API key isn't provided directly yet
fastify.post('/api/analyze-food', async (request, reply) => {
    const parts = request.parts();
    let hasImage = false;
    let textDesc = null;
    let imageBuffer = null;
    let mimeType = 'image/jpeg'; // default

    for await (const part of parts) {
        if (part.file) {
            hasImage = true;
            mimeType = part.mimetype;
            imageBuffer = await part.toBuffer();
        } else {
            textDesc = part.value;
        }
    }

    if (!hasImage && !textDesc) {
        return reply.status(400).send({ error: "Must provide image or text description" });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Returning mock data.");
            throw new Error("No API Key");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Identify the food in this input and provide macronutrient (protein, carbs, fats, fiber in grams) and micronutrient details, 
        and an estimate of total calories.
        
        Respond ONLY with a valid JSON strictly matching this structure:
        {
            "name": "Identified food name",
            "calories": 0,
            "macros": {"protein": 0, "carbs": 0, "fats": 0, "fiber": 0},
            "micros": {"vitamin_a": "0%", "vitamin_c": "0%", "calcium": "0%", "iron": "0%"},
            "health_score": 0_to_10
        }
        `;

        let promptContent = [prompt];
        if (hasImage && imageBuffer) {
            promptContent.push({
                inlineData: {
                    data: imageBuffer.toString("base64"),
                    mimeType
                }
            });
        }
        if (textDesc) {
            promptContent.push(`\nUser provided text description: ${textDesc}`);
        }

        const result = await model.generateContent(promptContent);
        const response = await result.response;
        const text = response.text();

        // Clean markdown backticks if any
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanedText);

    } catch (err) {
        console.error("Gemini API Error:", err);
        if (err.message === "No API Key") {
            return {
                name: textDesc || "Delicious Healthy Salad (Mock Vision)",
                calories: 320,
                macros: { protein: 25, carbs: 12, fats: 18 },
                micros: { "Vitamin A": "40%", "Vitamin C": "25%", "Omega-3": "High", "Iron": "15%" },
                health_score: 9.2
            };
        }
        return reply.status(500).send({ error: err.message || "Failed to analyze image with AI" });
    }
});

fastify.post('/api/chat', async (request, reply) => {
    const { message, context } = request.body || {};

    if (!message) {
        return reply.status(400).send({ error: "Message is required" });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("No API Key");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = "You are NutriVision's AI Dietitian. You provide evidence-based, concise, and helpful nutritional advice. Keep answers under 3 sentences unless asked for details.";
        let fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;
        if (context) fullPrompt += `\nContext (e.g., current food they are looking at): ${context}`;

        const result = await model.generateContent(fullPrompt);
        return { reply: result.response.text() };

    } catch (err) {
        console.error("Gemini Chat Error:", err);
        if (err.message === "No API Key") {
            return {
                reply: `As your NutriVision AI Dietitian, I see you're asking about "${message}". Since you are looking at ${context || "your food"}, I recommend balanced portions and staying hydrated!`
            };
        }
        return reply.status(500).send({ error: err.message || "Failed to generate AI chat response" });
    }
});

// Health check
fastify.get('/', async (request, reply) => {
    return { status: "ok", message: "NutriVision Node API is running" };
});

const start = async () => {
    try {
        await fastify.listen({ port: 8000, host: '0.0.0.0' });
        console.log("Server listening at http://localhost:8000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
