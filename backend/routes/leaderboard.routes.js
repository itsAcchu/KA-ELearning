import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { district } = req.query;
    const query = district ? { district } : {};
    
    const leaders = await User.find(query)
      .sort({ xp: -1 })
      .limit(100)
      .select('name avatar district xp level');
    
    res.json({ success: true, leaders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
