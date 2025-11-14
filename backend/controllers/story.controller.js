import Story from "../models/Story.js";
import User from "../models/User.js";

// Get all published stories
export const getAllStories = async (req, res) => {
  try {
    const { location, difficulty } = req.query;

    const filter = { isPublished: true };
    if (location) filter.location = location;
    if (difficulty) filter.difficulty = difficulty;

    const stories = await Story.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: stories.length,
      stories,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stories",
    });
  }
};

// Get story by ID
export const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.json({
      success: true,
      story,
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch story",
    });
  }
};

// Complete story and award XP
export const completeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { scenesCompleted, vocabularyLearned } = req.body;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Update story completion count
    story.completionCount += 1;
    await story.save();

    // Award XP to user
    const user = await User.findById(req.user._id);
    user.xp += story.xpReward;
    user.storiesCompleted = (user.storiesCompleted || 0) + 1;

    // Update user's story progress
    if (!user.storyProgress) {
      user.storyProgress = [];
    }

    const existingProgress = user.storyProgress.find(
      (p) => p.storyId.toString() === id
    );

    if (existingProgress) {
      existingProgress.completed = true;
      existingProgress.completedAt = new Date();
      existingProgress.scenesCompleted = scenesCompleted;
    } else {
      user.storyProgress.push({
        storyId: id,
        completed: true,
        completedAt: new Date(),
        scenesCompleted,
      });
    }

    await user.save();

    res.json({
      success: true,
      xpEarned: story.xpReward,
      totalXP: user.xp,
      message: "Story completed successfully!",
    });
  } catch (error) {
    console.error("Error completing story:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete story",
    });
  }
};

// Get user's progress for a specific story
export const getStoryProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const progress = user.storyProgress?.find(
      (p) => p.storyId.toString() === req.params.id
    );

    res.json({
      success: true,
      progress: progress || { completed: false },
    });
  } catch (error) {
    console.error("Error fetching story progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
    });
  }
};
