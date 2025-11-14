import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import Progress from "../models/Progress.js";

// Get user progress
export const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate("lesson", "title unit level")
      .sort({ updatedAt: -1 });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update progress
export const updateProgress = async (req, res) => {
  try {
    const { lessonId, completed, score, timeSpent } = req.body;

    let progress = await Progress.findOne({
      user: req.user.id,
      lesson: lessonId,
    });

    if (progress) {
      progress.completed = completed || progress.completed;
      progress.score = score || progress.score;
      progress.timeSpent += timeSpent || 0;
      await progress.save();
    } else {
      progress = await Progress.create({
        user: req.user.id,
        lesson: lessonId,
        completed: completed || false,
        score: score || 0,
        timeSpent: timeSpent || 0,
      });
    }

    // Update user's current lesson and last accessed
    const user = await User.findById(req.user.id);
    user.currentLesson = lessonId;
    user.lastAccessedAt = new Date();

    // Calculate progress percentage
    const totalLessons = await Lesson.countDocuments();
    const completedLessons = await Progress.countDocuments({
      user: req.user.id,
      completed: true,
    });
    user.progressPercentage = Math.round(
      (completedLessons / totalLessons) * 100
    );

    await user.save();

    res.json({
      progress,
      message: "Progress updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get continue learning data
export const getContinueLearning = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "currentLesson",
      "title description unit level"
    );

    if (!user.currentLesson) {
      // Get first lesson if no current lesson
      const firstLesson = await Lesson.findOne().sort({ unit: 1, level: 1 });
      return res.json({
        lesson: firstLesson,
        progressPercentage: 0,
        lastAccessed: null,
        message: "Start your Kannada journey!",
      });
    }

    // Get next incomplete lesson
    const nextLesson = await Lesson.findOne({
      _id: { $ne: user.currentLesson._id },
      unit: user.currentUnit,
    }).sort({ level: 1 });

    res.json({
      currentLesson: user.currentLesson,
      nextLesson: nextLesson,
      progressPercentage: user.progressPercentage || 0,
      lastAccessed: user.lastAccessedAt,
      currentUnit: user.currentUnit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
