import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: '🐘'
  },
  district: {
    type: String,
    required: [true, 'Please select a district']
  },
  
  // Gamification
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  gems: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: null
  },
  
  // Learning Stats
  lessonsCompleted: {
    type: Number,
    default: 0
  },
  totalStudyTime: {
    type: Number,
    default: 0
  },
  
  // Daily Goals
  dailyXP: {
    type: Number,
    default: 0
  },
  dailyGoalXP: {
    type: Number,
    default: 50
  },
  lastDailyReset: {
    type: Date,
    default: Date.now
  },
  
  // Achievements
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  
  // Settings
  soundEnabled: {
    type: Boolean,
    default: true
  },
  musicEnabled: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'en'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate level from XP
userSchema.methods.calculateLevel = function() {
  this.level = Math.floor(this.xp / 500) + 1;
  return this.level;
};

// Add XP and check for level up
userSchema.methods.addXP = function(amount) {
  const oldLevel = this.level;
  this.xp += amount;
  this.dailyXP += amount;
  this.calculateLevel();
  
  const leveledUp = this.level > oldLevel;
  if (leveledUp) {
    this.gems += 100; // Bonus gems for leveling up
  }
  
  return { leveledUp, newLevel: this.level, xp: this.xp };
};

// Update streak
userSchema.methods.updateStreak = function() {
  const today = new Date().toDateString();
  const lastActivity = this.lastActivityDate ? new Date(this.lastActivityDate).toDateString() : null;
  
  if (!lastActivity) {
    this.streak = 1;
    this.lastActivityDate = new Date();
    return this.streak;
  }
  
  if (lastActivity === today) {
    return this.streak; // Already counted today
  }
  
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (lastActivity === yesterday) {
    this.streak += 1;
    this.lastActivityDate = new Date();
  } else {
    this.streak = 1; // Streak broken
    this.lastActivityDate = new Date();
  }
  
  return this.streak;
};

// Reset daily XP if needed
userSchema.methods.checkDailyReset = function() {
  const today = new Date().toDateString();
  const lastReset = new Date(this.lastDailyReset).toDateString();
  
  if (today !== lastReset) {
    this.dailyXP = 0;
    this.lastDailyReset = new Date();
  }
};

const User = mongoose.model('User', userSchema);

export default User;
