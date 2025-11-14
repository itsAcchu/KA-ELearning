import Battle from "../models/Battle.js";
import User from "../models/User.js";

export const createBattleRoom = async (req, res) => {
  try {
    const { difficulty } = req.body;
    const roomId = `battle_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const questions = await generateBattleQuestions(difficulty || 3, 10);

    const battle = new Battle({
      roomId,
      questions,
      participants: [
        {
          userId: req.user._id,
          username: req.user.username || "Player",
        },
      ],
    });

    await battle.save();

    res.json({
      success: true,
      roomId,
      battle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const joinBattleRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const battle = await Battle.findOne({ roomId, status: "waiting" });

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Room not found or already started",
      });
    }

    if (battle.participants.length >= 10) {
      return res.status(400).json({
        success: false,
        message: "Room is full",
      });
    }

    battle.participants.push({
      userId: req.user._id,
      username: req.user.username || "Player",
    });

    if (battle.participants.length === 10) {
      battle.status = "active";
      battle.startTime = new Date();
    }

    await battle.save();

    res.json({
      success: true,
      battle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitBattleAnswer = async (req, res) => {
  try {
    const { roomId, questionIndex, answer, responseTime } = req.body;

    const battle = await Battle.findOne({ roomId, status: "active" });

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    const participant = battle.participants.find(
      (p) => p.userId.toString() === req.user._id.toString()
    );

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: "Not a participant",
      });
    }

    const question = battle.questions[questionIndex];
    const isCorrect = answer === question.correctAnswer;

    if (!isCorrect) {
      participant.eliminated = true;
      participant.eliminatedAt = new Date();
    } else {
      const timeBonus = Math.max(0, 10 - responseTime);
      participant.score += 10 + timeBonus;
    }

    await battle.save();

    res.json({
      success: true,
      correct: isCorrect,
      eliminated: participant.eliminated,
      score: participant.score,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBattleLeaderboard = async (req, res) => {
  try {
    const battles = await Battle.find({ status: "completed" })
      .populate("winners.userId", "username")
      .sort("-endTime")
      .limit(50);

    const leaderboard = battles.flatMap((battle) =>
      battle.winners.map((winner) => ({
        username: winner.userId?.username || "Unknown",
        position: winner.position,
        reward: winner.reward,
        date: battle.endTime,
      }))
    );

    res.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function generateBattleQuestions(difficulty, count) {
  // Sample questions - in production, fetch from database
  const questionBank = [
    {
      question: 'What is the Kannada word for "Hello"?',
      options: ["ನಮಸ್ಕಾರ", "ಧನ್ಯವಾದ", "ಹೌದು", "ಇಲ್ಲ"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      question: 'How do you say "Thank you" in Kannada?',
      options: ["ನಮಸ್ಕಾರ", "ಧನ್ಯವಾದ", "ದಯವಿಟ್ಟು", "ಕ್ಷಮಿಸಿ"],
      correctAnswer: 1,
      difficulty: 1,
    },
    {
      question: 'What does "ಹೌದು" mean in English?',
      options: ["No", "Maybe", "Yes", "Please"],
      correctAnswer: 2,
      difficulty: 1,
    },
    {
      question: 'Translate "Good morning" to Kannada:',
      options: ["ಶುಭ ರಾತ್ರಿ", "ಶುಭೋದಯ", "ಶುಭ ಸಂಜೆ", "ನಮಸ್ಕಾರ"],
      correctAnswer: 1,
      difficulty: 2,
    },
    {
      question: 'What is "Water" in Kannada?',
      options: ["ಹಾಲು", "ನೀರು", "ಚಹಾ", "ಕಾಫಿ"],
      correctAnswer: 1,
      difficulty: 1,
    },
    {
      question: 'How do you say "I am learning Kannada"?',
      options: [
        "ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ",
        "ನಾನು ಕನ್ನಡ ಮಾತನಾಡುತ್ತೇನೆ",
        "ನಾನು ವಿದ್ಯಾರ್ಥಿ",
        "ನಾನು ಶಿಕ್ಷಕ",
      ],
      correctAnswer: 0,
      difficulty: 3,
    },
    {
      question: 'What does "ಕರ್ನಾಟಕ" refer to?',
      options: ["A language", "A state", "A city", "A festival"],
      correctAnswer: 1,
      difficulty: 2,
    },
    {
      question: 'Translate "Food" to Kannada:',
      options: ["ಊಟ", "ತಿಂಡಿ", "ಊಟ", "ಭೋಜನ"],
      correctAnswer: 0,
      difficulty: 2,
    },
    {
      question: 'What is the correct way to say "How are you?" in Kannada?',
      options: [
        "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ",
        "ಧನ್ಯವಾದ",
        "ನಮಸ್ಕಾರ",
      ],
      correctAnswer: 0,
      difficulty: 2,
    },
    {
      question: 'What does "ಪುಸ್ತಕ" mean?',
      options: ["Pen", "Book", "Paper", "Bag"],
      correctAnswer: 1,
      difficulty: 1,
    },
  ];

  // Shuffle and return requested count
  return questionBank
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((q) => ({ ...q }));
}
