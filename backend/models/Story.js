import mongoose from "mongoose";

const vocabularySchema = new mongoose.Schema({
  word: String,
  kannada: String,
  english: String,
  pronunciation: String,
});

const choiceSchema = new mongoose.Schema({
  text: String,
  textKannada: String,
  nextScene: Number,
  xpReward: Number,
  correctChoice: { type: Boolean, default: false },
});

const sceneSchema = new mongoose.Schema({
  order: Number,
  title: String,
  content: String,
  contentKannada: String,
  mission: String, // Mission objective
  imageEmoji: String, // Emoji for visual
  vocabulary: [vocabularySchema],
  choices: [choiceSchema],
  learningOutcome: String, // What user learns
  grammarTip: String, // Grammar explanation
});

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleKannada: String,
  description: String,
  mode: {
    type: String,
    enum: ["child", "adult", "parent"],
    default: "adult",
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  location: {
    type: String,
    enum: ["mysore", "bangalore", "coorg", "hampi", "karnataka"],
    required: true,
  },
  coverEmoji: String,
  scenes: [sceneSchema],
  totalVocabulary: Number,
  estimatedTime: Number,
  xpReward: { type: Number, default: 100 },
  completionCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  generatedByAI: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Story", storySchema);
