import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log(
  "🔑 GROQ API:",
  process.env.GROQ_API_KEY ? "Loaded ✅" : "❌ Missing"
);
console.log("🔑 Key starts with:", process.env.GROQ_API_KEY?.substring(0, 8));

/* -----------------------------------------------------------
   MAIN CHAT CONTROLLER
----------------------------------------------------------- */

export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // SYSTEM RULES FOR KANNADA LEARNING
    const messages = [
      {
        role: "system",
        content: `You are a Kannada learning assistant.

Rules:
1. Reply in Kannada FIRST, then English in brackets
2. Include pronunciation using hyphens (Na-mas-kaa-ra)
3. Keep responses short & friendly
4. Teach new words naturally
5. Add emojis to make learning fun 😊

Example:
User: "How to say hello?"
AI: "ನಮಸ್ಕಾರ (Namaskāra) — 'Hello' 🙏  
Pronunciation: Na-mas-kaa-ra"`,
      },

      ...conversationHistory,

      { role: "user", content: message },
    ];

    // GROQ REQUEST
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const botMessage = response.choices[0].message.content;

    return res.json({
      message: botMessage,
      timestamp: new Date(),
      conversationHistory: [
        ...conversationHistory,
        { role: "user", content: message },
        { role: "assistant", content: botMessage },
      ],
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      message: "Failed to get AI response",
      error: error.message,
    });
  }
};

/* -----------------------------------------------------------
   QUICK PHRASES
----------------------------------------------------------- */

export const getQuickPhrases = async (req, res) => {
  try {
    const phrases = [
      {
        kannada: "ನಮಸ್ಕಾರ",
        english: "Hello",
        pronunciation: "Namaskāra",
        category: "greetings",
      },
      {
        kannada: "ಧನ್ಯವಾದ",
        english: "Thank you",
        pronunciation: "Dhanyavāda",
        category: "greetings",
      },
      {
        kannada: "ಹೇಗಿದ್ದೀರಿ?",
        english: "How are you?",
        pronunciation: "Hēgiddīri?",
        category: "greetings",
      },
      {
        kannada: "ನನ್ನ ಹೆಸರು",
        english: "My name is",
        pronunciation: "Nanna hesaru",
        category: "introduction",
      },
      {
        kannada: "ದಯವಿಟ್ಟು",
        english: "Please",
        pronunciation: "Dayaviṭṭu",
        category: "politeness",
      },
      {
        kannada: "ಕ್ಷಮಿಸಿ",
        english: "Sorry",
        pronunciation: "Kṣamisi",
        category: "politeness",
      },
    ];

    res.json(phrases);
  } catch (error) {
    console.error("Quick phrases error:", error);
    res.status(500).json({ message: "Failed to fetch phrases" });
  }
};

/* -----------------------------------------------------------
   TEXT TRANSLATION
----------------------------------------------------------- */

export const translateText = async (req, res) => {
  try {
    const { text, targetLanguage = "kannada" } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const prompt =
      targetLanguage === "kannada"
        ? `Translate this to Kannada with pronunciation: "${text}"\nFormat: ಕನ್ನಡ (kannada) - meaning`
        : `Translate this Kannada text to English: "${text}"`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
    });

    const translation = response.choices[0].message.content;

    res.json({
      originalText: text,
      translation,
      targetLanguage,
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({
      message: "Failed to translate text",
      error: error.message,
    });
  }
};
