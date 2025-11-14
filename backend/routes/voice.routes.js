import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import {
  getVoiceExercises,
  checkPronunciation,
} from "../controllers/voice.controller.js";

const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"));
    }
  },
});

// Protected routes
router.use(protect); // Apply auth to all routes below

router.get("/exercises", getVoiceExercises);
router.post("/check", upload.single("audio"), checkPronunciation);

export default router;
