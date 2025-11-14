import mongoose from "mongoose";

const battleSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        score: { type: Number, default: 0 },
        eliminated: { type: Boolean, default: false },
        eliminatedAt: Date,
      },
    ],
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        difficulty: Number,
      },
    ],
    currentQuestionIndex: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["waiting", "active", "completed"],
      default: "waiting",
    },
    winners: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        position: Number,
        reward: Number,
      },
    ],
    startTime: Date,
    endTime: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Battle", battleSchema);
