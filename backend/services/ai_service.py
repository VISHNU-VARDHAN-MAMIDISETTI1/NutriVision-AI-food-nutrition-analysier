import os
import google.generativeai as genai
import json

class NutriVisionAI:
    def __init__(self):
        # Configure Gemini API
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if api_key:
            genai.configure(api_key=api_key)
            self.vision_model = genai.GenerativeModel('gemini-1.5-flash')
            self.chat_model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            print("Warning: GEMINI_API_KEY environment variable not set.")
            self.vision_model = None
            self.chat_model = None

    async def analyze_food_text(self, text: str):
        """Analyze food based on text description to get nutritional info"""
        if not self.chat_model:
            return self._mock_nutrition_data(text)
            
        prompt = f"""
        Analyze the following food and provide macronutrient (protein, carbs, fats in grams) and micronutrient details, 
        and an estimate of total calories. 
        Food: {text}
        
        Respond ONLY with a valid JSON strictly matching this structure:
        {{
            "name": "Identified food name",
            "calories": 0,
            "macros": {{"protein": 0, "carbs": 0, "fats": 0}},
            "micros": {{"vitamin_a": "0%", "vitamin_c": "0%", "calcium": "0%", "iron": "0%"}},
            "health_score": 0_to_10
        }}
        """
        try:
            response = self.chat_model.generate_content(prompt)
            # Remove Markdown code blocks if present
            cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)
        except Exception as e:
            print(f"Error calling Gemini: {e}")
            return self._mock_nutrition_data(text)

    async def analyze_food_image(self, image_bytes: bytes, filename: str):
        """Analyze food image using Gemini Vision to get nutritional info"""
        if not self.vision_model:
            return self._mock_nutrition_data("Unknown Food from Image")
            
        # In a real app we'd need to properly format image for Gemini
        # For simplicity, sending bytes to a placeholder logic
        # You can replace this with actual multi-modal API call
        
        prompt = """
        Identify the food in this image and provide macronutrient (protein, carbs, fats in grams) and micronutrient details, 
        and an estimate of total calories.
        
        Respond ONLY with a valid JSON strictly matching this structure:
        {
            "name": "Identified food name",
            "calories": 0,
            "macros": {"protein": 0, "carbs": 0, "fats": 0},
            "micros": {"vitamin_a": "0%", "vitamin_c": "0%", "calcium": "0%", "iron": "0%"},
            "health_score": 0_to_10
        }
        """
        
        try:
            image_parts = [
                {
                    "mime_type": "image/jpeg", # simplified
                    "data": image_bytes
                }
            ]
            response = self.vision_model.generate_content([prompt, image_parts[0]])
            cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)
        except Exception as e:
            print(f"Error calling Gemini Vision: {e}")
            return self._mock_nutrition_data("Food identified from image (mock)")

    async def chat_with_dietitian(self, message: str, context: str = None):
        """Chatbot logic for dietitian Q&A"""
        if not self.chat_model:
            return {"reply": f"Mock dietitian says: I see you are asking about '{message}'."}
            
        system_prompt = """
        You are NutriVision's AI Dietitian. You provide evidence-based, concise, and helpful 
        nutritional advice. Keep answers under 3 sentences unless asked for details.
        """
        
        full_prompt = f"{system_prompt}\n\nUser Question: {message}"
        if context:
            full_prompt += f"\nContext (e.g., current food they are analyzing): {context}"
            
        try:
            response = self.chat_model.generate_content(full_prompt)
            return {"reply": response.text.strip()}
        except Exception as e:
            print(f"Error calling Gemini Chat: {e}")
            return {"reply": "Sorry, I am having trouble connecting to my knowledge base right now."}
            
    def _mock_nutrition_data(self, name: str):
        """Fallback mock data"""
        return {
            "name": name,
            "calories": 250,
            "macros": {"protein": 10, "carbs": 30, "fats": 10},
            "micros": {"vitamin_a": "10%", "vitamin_c": "15%", "calcium": "5%", "iron": "8%"},
            "health_score": 7
        }
