import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
console.log('Testing @google/genai with key prefix:', key ? key.slice(0, 4) : 'NO_KEY');

const ai = new GoogleGenAI({ apiKey: key });

const testModels = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-pro-latest'];

for (const m of testModels) {
  try {
    const response = await ai.models.generateContent({
      model: m,
      contents: 'Reply with the single word: OK'
    });
    console.log(`SUCCESS with ${m}:`, response.text?.trim());
  } catch (err) {
    console.log(`FAILED with ${m}:`, err.message?.slice(0, 120));
  }
}
