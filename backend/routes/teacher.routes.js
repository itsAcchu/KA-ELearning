import express from "express";
import {
  unlockTeacherMode,
  createContent,
  getContent,
  earnFromContent,
  getTeacherLeaderboard,
  getTeacherStatus,
} from "../controllers/teacher.controller.js";
import { protect } from "../middleware/auth.js"; // ✅ Changed from 'authenticate'

const router = express.Router();

router.get("/status", protect, getTeacherStatus);
router.post("/unlock", protect, unlockTeacherMode);
router.post("/content/create", protect, createContent);
router.get("/content", getContent);
router.post("/content/:contentId/earn", protect, earnFromContent);
router.get("/leaderboard", getTeacherLeaderboard);

export default router;
