import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";

dotenv.config();

const app = express();


// cors
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-tour-planner.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // You can change this to callback(new Error('Not allowed by CORS')) 
        // if you want to be strict, but for debugging, let's allow it:
        callback(null, true); 
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// Keep this line - it handles the PREFLIGHT (OPTIONS) requests
app.options("*", cors());

app.use(express.json());

/* ---------- PORT ---------- */
const PORT = process.env.PORT || 3001;

/* ---------- STATIC FRONTEND ---------- */
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend", "dist")));

/* ---------- API KEY CHECK ---------- */
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY missing in .env");
}

/* ---------- Gemini Client ---------- */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* ---------- API Route ---------- */
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
      return res.status(500).json({ error: "Empty Gemini response" });
    }

    res.json({ text });
  } catch (err) {
    console.error("🔥 Gemini Error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

/* ---------- SPA Fallback ---------- */
app.use((req, res) => {
  res.sendFile(
    path.resolve(__dirname, "frontend", "dist", "index.html")
  );
});

/* ---------- Server ---------- */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
