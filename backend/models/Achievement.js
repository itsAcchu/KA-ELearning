import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  icon: String,
  category: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'master', 'special'],
    default: 'beginner'
  },
  
  // Unlock criteria
  criteria: {
    type: {
      type: String,
      enum: ['lessons_completed', 'xp_earned', 'streak_days', 'perfect_lessons', 'speaking_practice', 'custom'],
      required: true
    },
    target: Number,
    description: String
  },
  
  rewards: {
    xp: {
      type: Number,
      default: 0
    },
    gems: {
      type: Number,
      default: 50
    }
  },
  
  unlockedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  isSecret: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
