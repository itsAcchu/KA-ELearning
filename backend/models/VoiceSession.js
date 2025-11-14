import mongoose from "mongoose";

const voiceSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationHistory: [
      {
        role: { type: String, enum: ["user", "guru"] },
        content: String,
        audioUrl: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    context: mongoose.Schema.Types.Mixed,
    sessionType: {
      type: String,
      enum: ["practice", "quiz", "doubt", "conversation"],
    },
    duration: Number,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("VoiceSession", voiceSessionSchema);
