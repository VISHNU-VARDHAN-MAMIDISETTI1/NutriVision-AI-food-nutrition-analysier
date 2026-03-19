from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.ai_service import NutriVisionAI

app = FastAPI(title="NutriVision API")

# Setup CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_service = NutriVisionAI()

@app.get("/")
async def root():
    return {"status": "ok", "message": "NutriVision API is running"}

@app.post("/api/analyze-food")
async def analyze_food(image: UploadFile = File(None), text: str = Form(None)):
    if not image and not text:
         raise HTTPException(status_code=400, detail="Must provide either an image or text description of food.")
         
    if image:
        # Read the file content
        content = await image.read()
        return await ai_service.analyze_food_image(content, image.filename)
    elif text:
        return await ai_service.analyze_food_text(text)

@app.post("/api/chat")
async def chat(message: str = Form(...), context: str = Form(None)):
    return await ai_service.chat_with_dietitian(message, context)
