import mongoose from 'mongoose';

const sceneSchema = new mongoose.Schema({
  order: Number,
  title: String,
  content: String,
  contentKannada: String,
  imageUrl: String,
  audioUrl: String,
  
  vocabulary: [{
    word: String,
    translation: String,
    pronunciation: String
  }],
  
  choices: [{
    text: String,
    textKannada: String,
    nextScene: Number,
    xpReward: Number
  }]
});

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleKannada: String,
  description: String,
  
  location: {
    type: String,
    enum: ['mysore', 'bangalore', 'coorg', 'hampi', 'karnataka'],
    required: true
  },
  
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  
  coverImage: String,
  
  scenes: [sceneSchema],
  
  totalVocabulary: Number,
  estimatedTime: Number, // in minutes
  
  xpReward: {
    type: Number,
    default: 100
  },
  
  completionCount: {
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
});

const Story = mongoose.model('Story', storySchema);

export default Story;
