import express from "express";
import {
  chatWithAI,
  getQuickPhrases,
  translateText,
} from "../controllers/ai.controller.js";

const router = express.Router();

// Chatbot - NO AUTH for demo (works without login)
router.post("/chat", chatWithAI);
router.get("/phrases", getQuickPhrases);
router.post("/translate", translateText);

export default router;
