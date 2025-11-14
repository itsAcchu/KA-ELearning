import express from 'express';
import { 
  createBattleRoom, 
  joinBattleRoom, 
  submitBattleAnswer,
  getBattleLeaderboard
} from '../controllers/battle.controller.js';
import { protect } from '../middleware/auth.js'; // ✅ Changed from 'authenticate'

const router = express.Router();

router.post('/create', protect, createBattleRoom);
router.post('/join/:roomId', protect, joinBattleRoom);
router.post('/answer', protect, submitBattleAnswer);
router.get('/leaderboard', getBattleLeaderboard);

export default router;