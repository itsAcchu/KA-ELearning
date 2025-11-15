import express from "express";
import {
  analyzePronunciation,
  getPracticePhrase,
  startVoiceSession,
} from "../controllers/voiceCoach.controller.js";

const router = express.Router();

router.post("/analyze", analyzePronunciation);
router.get("/phrase", getPracticePhrase);
router.post("/start", startVoiceSession);

export default router;
