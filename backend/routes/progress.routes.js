import express from 'express';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user progress
router.get('/', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id }).populate('lesson');
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update lesson progress
router.post('/:lessonId', protect, async (req, res) => {
  try {
    const { score, exercisesCompleted, answers } = req.body;
    
    let progress = await Progress.findOne({
      user: req.user.id,
      lesson: req.params.lessonId
    });
    
    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        lesson: req.params.lessonId,
        score,
        exercisesCompleted,
        answers
      });
    } else {
      progress.score = score;
      progress.exercisesCompleted = exercisesCompleted;
      progress.answers = answers;
    }
    
    await progress.save();
    
    // Update user XP
    const user = await User.findById(req.user.id);
    const result = user.addXP(req.body.xpEarned || 50);
    user.lessonsCompleted += 1;
    await user.save();
    
    res.json({
      success: true,
      progress,
      user: {
        xp: user.xp,
        level: user.level,
        leveledUp: result.leveledUp
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
