import express from 'express';
import Achievement from '../models/Achievement.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json({ success: true, achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
