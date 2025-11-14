import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Karnataka Districts for district-based leaderboards
const KARNATAKA_DISTRICTS = [
  "Bagalkot",
  "Ballari",
  "Belagavi",
  "Bengaluru Rural",
  "Bengaluru Urban",
  "Bidar",
  "Chamarajanagar",
  "Chikkaballapur",
  "Chikkamagaluru",
  "Chitradurga",
  "Dakshina Kannada",
  "Davanagere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Haveri",
  "Kalaburagi",
  "Kodagu",
  "Kolar",
  "Koppal",
  "Mandya",
  "Mysuru",
  "Raichur",
  "Ramanagara",
  "Shivamogga",
  "Tumakuru",
  "Udupi",
  "Uttara Kannada",
  "Vijayapura",
  "Yadgir",
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: "🐘",
    },
    district: {
      type: String,
      enum: KARNATAKA_DISTRICTS,
      default: "Bengaluru Urban",
    },

    // Gamification
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    gems: {
      type: Number,
      default: 0,
    },
    coins: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
      default: null,
    },

    // Learning Stats
    lessonsCompleted: {
      type: Number,
      default: 0,
    },
    totalStudyTime: {
      type: Number,
      default: 0,
    },
    stats: {
      accuracy: { type: Number, default: 0 },
      totalQuestions: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
    },

    // Daily Goals
    dailyXP: {
      type: Number,
      default: 0,
    },
    dailyGoalXP: {
      type: Number,
      default: 50,
    },
    lastDailyReset: {
      type: Date,
      default: Date.now,
    },

    // NEW: Teacher Mode Fields
    teacherMode: {
      type: Boolean,
      default: false,
    },
    teacherStats: {
      studentsHelped: { type: Number, default: 0 },
      contentCreated: { type: Number, default: 0 },
      coinsEarned: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      verified: { type: Boolean, default: false },
    },

    // NEW: Battle Royale Stats
    battleStats: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      topPosition: { type: Number, default: 0 },
    },

    // NEW: Voice Sessions
    voiceSessionsCompleted: {
      type: Number,
      default: 0,
    },

    // Achievements
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],

    // Settings
    soundEnabled: {
      type: Boolean,
      default: true,
    },
    musicEnabled: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: "en",
    },

    storyProgress: [
      {
        storyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Story",
        },
        completed: {
          type: Boolean,
          default: false,
        },
        scenesCompleted: {
          type: Number,
          default: 0,
        },
        completedAt: Date,
      },
    ],
    storiesCompleted: {
      type: Number,
      default: 0,
    },

    // ------------------------------------
    // ✅ NEW FIELDS YOU ASKED TO ADD
    // ------------------------------------
    currentLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },
    currentUnit: {
      type: Number,
      default: 1,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
    // ------------------------------------
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate level from XP
userSchema.methods.calculateLevel = function () {
  this.level = Math.floor(this.xp / 500) + 1;
  return this.level;
};

// Add XP and check for level up
userSchema.methods.addXP = function (amount) {
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
userSchema.methods.updateStreak = function () {
  const today = new Date().toDateString();
  const lastActivity = this.lastActivityDate
    ? new Date(this.lastActivityDate).toDateString()
    : null;

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
userSchema.methods.checkDailyReset = function () {
  const today = new Date().toDateString();
  const lastReset = new Date(this.lastDailyReset).toDateString();

  if (today !== lastReset) {
    this.dailyXP = 0;
    this.lastDailyReset = new Date();
  }
};

const User = mongoose.model("User", userSchema);

export default User;
