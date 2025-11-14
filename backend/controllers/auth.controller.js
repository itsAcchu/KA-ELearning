import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Existing signup and login functions...

export const signup = async (req, res) => {
  try {
    const { name, email, password, district } = req.body;

    // text (❌ invalid) → removed

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      district: district || "Bengaluru Urban",
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        district: user.district,
        xp: user.xp,
        level: user.level,
        gems: user.gems,
        streak: user.streak,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // text (❌ invalid) → removed

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        district: user.district,
        xp: user.xp,
        level: user.level,
        gems: user.gems,
        streak: user.streak,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADD THIS NEW FUNCTION
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // text (❌ invalid) → removed

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      district: user.district,
      xp: user.xp,
      level: user.level,
      gems: user.gems,
      streak: user.streak,
      lessonsCompleted: user.lessonsCompleted,
      totalStudyTime: user.totalStudyTime,
      dailyXP: user.dailyXP,
      dailyGoalXP: user.dailyGoalXP,
      achievements: user.achievements,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
