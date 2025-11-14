import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  
  score: {
    type: Number,
    default: 0
  },
  
  exercisesCompleted: {
    type: Number,
    default: 0
  },
  
  totalExercises: Number,
  
  attempts: {
    type: Number,
    default: 0
  },
  
  timeSpent: {
    type: Number,
    default: 0
  },
  
  answers: [{
    exerciseId: mongoose.Schema.Types.ObjectId,
    userAnswer: String,
    isCorrect: Boolean,
    attempts: Number,
    timestamp: Date
  }],
  
  weakAreas: [String],
  
  completedAt: Date,
  
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

// Compound index for user-lesson lookups
progressSchema.index({ user: 1, lesson: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
