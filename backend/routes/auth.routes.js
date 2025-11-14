import express from "express";
import { signup, login, getProfile } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, getProfile); // ADD THIS LINE

export default router;
