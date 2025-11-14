import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple_choice', 'fill_in_blank', 'match_pairs', 'speaking', 'listening', 'translation'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  questionKannada: String,
  audioUrl: String,
  imageUrl: String,
  
  // Multiple Choice / Fill in Blank
  options: [String],
  correctAnswer: String,
  
  // Match Pairs
  pairs: [{
    kannada: String,
    english: String
  }],
  
  // Speaking
  targetPronunciation: String,
  phoneticGuide: String,
  
  // Points
  xpReward: {
    type: Number,
    default: 10
  },
  
  hints: [String],
  explanation: String
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleKannada: String,
  description: String,
  
  unit: {
    type: Number,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  
  difficulty: {
    type: String,
    enum: ['beginner', 'elementary', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  
  // Lesson content
  vocabulary: [{
    word: String,
    kannada: String,
    pronunciation: String,
    audioUrl: String,
    example: String,
    exampleKannada: String
  }],
  
  grammar: [{
    topic: String,
    explanation: String,
    examples: [String]
  }],
  
  exercises: [exerciseSchema],
  
  // Requirements
  prerequisiteLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  
  // Rewards
  xpReward: {
    type: Number,
    default: 50
  },
  gemsReward: {
    type: Number,
    default: 5
  },
  
  // Stats
  completionCount: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  
  isPublished: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
lessonSchema.index({ unit: 1, order: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
