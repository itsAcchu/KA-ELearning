import VoiceSession from "../models/VoiceSession.js";
import axios from "axios";

export const startVoiceSession = async (req, res) => {
  try {
    const { sessionType } = req.body;

    const session = new VoiceSession({
      userId: req.user._id,
      sessionType: sessionType || "conversation",
      context: {
        userLevel: req.user.level || 1,
        weakAreas: [], // In production, calculate from user progress
      },
    });

    await session.save();

    res.json({
      success: true,
      sessionId: session._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const processVoiceInput = async (req, res) => {
  try {
    const { sessionId, audioData } = req.body;

    // For now, return mock data - integrate actual APIs in production
    const transcript = "ನಮಸ್ಕಾರ"; // Mock transcript
    const aiResponse = "ನಮಸ್ಕಾರ! ನೀವು ಹೇಗಿದ್ದೀರಿ?"; // Mock AI response
    const audioUrl = "/audio/response.mp3"; // Mock audio URL

    // Save to session
    const session = await VoiceSession.findById(sessionId);
    if (session) {
      session.conversationHistory.push(
        { role: "user", content: transcript },
        { role: "guru", content: aiResponse, audioUrl: audioUrl }
      );
      await session.save();
    }

    res.json({
      success: true,
      transcript,
      response: aiResponse,
      audioUrl: audioUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await VoiceSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    session.active = false;
    session.duration = Date.now() - session.createdAt;
    await session.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { voiceSessionsCompleted: 1 },
    });

    res.json({
      success: true,
      message: "Session ended successfully",
      duration: session.duration,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
