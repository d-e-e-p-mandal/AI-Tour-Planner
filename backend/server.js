import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- API KEY CHECK ---------- */
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY missing in .env");
}

/* ---------- Gemini Client ---------- */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* ---------- Route ---------- */
app.post("/generate-trip", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty Gemini response");
    }

    res.json({ text });
  } catch (err) {
    console.error("🔥 Gemini Error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

/* ---------- Server ---------- */
app.listen(3001, () => {
  console.log("✅ Server running at http://localhost:3001");
});