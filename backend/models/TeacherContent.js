import mongoose from "mongoose";

const teacherContentSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: ["lesson", "quiz", "story"], required: true },
    difficulty: { type: Number, min: 1, max: 5 },
    content: mongoose.Schema.Types.Mixed,
    learners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: { type: Number, default: 0 },
    coinsEarned: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("TeacherContent", teacherContentSchema);
