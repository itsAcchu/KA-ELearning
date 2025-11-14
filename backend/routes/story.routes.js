import express from "express";
import {
  generateAIStory,
  getAllStories,
  getStoryById,
  completeStory,
} from "../controllers/storyAI.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// AI story generation
router.post("/generate", generateAIStory);

// Get stories
router.get("/", getAllStories);
router.get("/:id", getStoryById);

// Complete story (protected)
router.post("/:id/complete", protect, completeStory);

export default router;
