import express from "express";
import {
  analyzeImage,
  getSupportedObjects,
} from "../controllers/vision.controller.js";

const router = express.Router();

router.post("/analyze", analyzeImage);
router.get("/objects", getSupportedObjects);

export default router;
