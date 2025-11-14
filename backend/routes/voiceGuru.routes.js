import express from "express";
import {
  startVoiceSession,
  processVoiceInput,
  endSession,
} from "../controllers/voiceGuru.controller.js";
import { protect } from "../middleware/auth.js"; // ✅ Changed from 'authenticate'

const router = express.Router();

router.post("/session/start", protect, startVoiceSession);
router.post("/session/input", protect, processVoiceInput);
router.post("/session/end/:sessionId", protect, endSession);

export default router;
