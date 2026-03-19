# 🍏 NutriVision AI 

![NutriVision Banner](https://img.shields.io/badge/Status-Active-success) ![Next.js](https://img.shields.io/badge/Frontend-Next.js%20%7C%20React-000000?logo=next.js) ![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Fastify-339933?logo=node.js) ![AI](https://img.shields.io/badge/AI-Google%20Gemini%20Vision-FFC107?logo=google)

NutriVision is a fully-fledged, AI-powered nutritional tracking platform designed to make healthy eating radically simple. By leveraging the power of Google's Gemini 1.5 Flash Vision model, users can simply snap a photo or describe their meal to instantly receive highly accurate nutritional breakdowns, macros, and personalized dietary advice.

## ✨ Features
- **📸 Live Vision AI Integration:** Instantly identify food from photos and accurately calculate Calories, Protein, Carbs, Fats, and Fiber. Works natively with smartphone cameras.
- **📊 Interactive Analytics Dashboard:** A beautiful, dynamic dashboard powered by `Recharts` visualizing daily caloric trends (Area Charts), aggregate macros (Bar Charts), and micronutrient density (Radar Charts).
- **💬 Contextual AI Dietitian:** An embedded, real-time AI Chatbot that knows exactly what meal you are currently analyzing and can answer deeply personalized diet questions.
- **📱 Mobile-First & Secure Design:** A premium, dark-mode glassmorphism UI built specifically for responsive mobile usage. History caching is securely handled entirely in your browser via LocalStorage.

---

## 💻 Tech Stack
The architecture is decoupled into a hyper-fast micro-backend and a modern React frontend.

* **Frontend:** Next.js (App Router), React, Vanilla CSS Variables, Lucide Icons, Recharts
* **Backend:** Node.js, Fastify micro-framework, `@google/generative-ai` SDK
* **Database:** HTML5 LocalStorage (Browser Cache)

---

## 🚀 Local Development Setup

### Prerequisites
You will need Node.js installed, as well as a free [Google Gemini API Key](https://aistudio.google.com/).

### 1. Start the Backend (API Server)
The backend acts as a secure, fast communication layer and protects your Gemini API keys from the public frontend.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server securely by injecting your API key into the environment:
   ```powershell
   # Windows (PowerShell)
   $env:GEMINI_API_KEY="your_api_key_here"; node server.js
   
   # Mac/Linux
   GEMINI_API_KEY="your_api_key_here" node server.js
   ```

### 2. Start the Frontend (User Interface)
The frontend connects locally to `http://localhost:8000/api` to interface with the Node.js Fastify backend.

1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:3000`** to see the magic happen! 

---

## 🌍 Application Architecture
1. **Action:** The Next.js frontend packages user photos/text into a `FormData` object and fires an HTTP POST request to the Fastify backend.
2. **AI Vision:** The Node.js backend handles the secret API Key authentication, formats strict JSON-schema Prompts, and sends it to Google Gemini servers to identify the food.
3. **Caching & UI:** Once Gemini replies, the frontend receives a formatted JSON object. It instantly constructs a React visual card, populates the Recharts, and seamlessly saves the data to the browser's `localStorage` to permanently power the Dashboard and History tabs without needing an external external PostgreSQL/MongoDB database!
