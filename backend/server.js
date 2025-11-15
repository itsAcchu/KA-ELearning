// ⭐ LOAD .env FIRST - BEFORE ANY OTHER IMPORTS!
import dotenv from "dotenv";
dotenv.config();

// NOW import everything else
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/database.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import battleRoutes from "./routes/battle.routes.js";
import voiceGuruRoutes from "./routes/voiceGuru.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import voiceRoutes from "./routes/voice.routes.js";
import visionRoutes from "./routes/vision.routes.js";
import storyRoutes from "./routes/story.routes.js";
import voiceCoachRoutes from "./routes/voiceCoach.routes.js";

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/battle", battleRoutes);
app.use("/api/voice-guru", voiceGuruRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/vision", visionRoutes);
app.use("/api/stories", storyRoutes);
app.use('/api/voice-coach', voiceCoachRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// ==========================================
// WebSocket Battle Royale Logic
// ==========================================
const battleRooms = new Map();

io.on("connection", (socket) => {
  console.log("👤 User connected:", socket.id);

  // Join Battle Room
  socket.on("join-battle", ({ roomId, userData }) => {
    socket.join(roomId);

    if (!battleRooms.has(roomId)) {
      battleRooms.set(roomId, {
        players: [],
        currentQuestion: 0,
        questions: [],
      });
    }

    const room = battleRooms.get(roomId);
    room.players.push({
      ...userData,
      socketId: socket.id,
      eliminated: false,
      score: 0,
    });

    io.to(roomId).emit("player-joined", { players: room.players });

    // Start battle when 10 players join
    if (room.players.length === 10) {
      startBattle(roomId);
    }
  });

  // Handle Battle Answer
  socket.on("battle-answer", ({ roomId, answer, responseTime }) => {
    const room = battleRooms.get(roomId);
    if (!room) return;

    const player = room.players.find((p) => p.socketId === socket.id);
    if (!player || player.eliminated) return;

    const question = room.questions[room.currentQuestion];
    const isCorrect = answer === question.correctAnswer;

    if (!isCorrect) {
      player.eliminated = true;
      io.to(roomId).emit("player-eliminated", {
        userId: player.socketId,
        username: player.username,
      });
    } else {
      player.score += 10 + Math.max(0, 10 - responseTime);
    }

    checkBattleStatus(roomId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start Battle with Questions
function startBattle(roomId) {
  const room = battleRooms.get(roomId);
  room.currentQuestion = 0;

  // Sample Kannada questions
  room.questions = [
    {
      question: "What is ‘ನಮಸ್ಕಾರ’ in English?",
      options: ["Hello", "Goodbye", "Thank you", "Please"],
      correctAnswer: 0,
    },
    {
      question: "What is ‘ಧನ್ಯವಾದ’ in English?",
      options: ["Hello", "Goodbye", "Thank you", "Please"],
      correctAnswer: 2,
    },
  ];

  sendQuestion(roomId);
}

// Send Question
function sendQuestion(roomId) {
  const room = battleRooms.get(roomId);

  if (room.currentQuestion >= room.questions.length) {
    endBattle(roomId);
    return;
  }

  const question = room.questions[room.currentQuestion];

  io.to(roomId).emit("question-start", {
    question,
    index: room.currentQuestion,
  });

  setTimeout(() => {
    room.currentQuestion++;
    sendQuestion(roomId);
  }, 12000);
}

// Check if battle should end
function checkBattleStatus(roomId) {
  const room = battleRooms.get(roomId);
  const activePlayers = room.players.filter((p) => !p.eliminated);

  if (activePlayers.length <= 3) {
    endBattle(roomId);
  }
}

// End Battle
function endBattle(roomId) {
  const room = battleRooms.get(roomId);

  const winners = room.players
    .filter((p) => !p.eliminated)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  io.to(roomId).emit("battle-end", { winners });
  battleRooms.delete(roomId);
}

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
