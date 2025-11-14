import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import socketService from "../services/socket.service";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

export default function BattleRoyale() {
  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameStatus, setGameStatus] = useState("waiting"); // waiting, playing, eliminated, won
  const [myScore, setMyScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = socketService.connect();

    socketService.onPlayerJoined((data) => {
      setPlayers(data.players);
      if (data.players.length === 10) {
        setGameStatus("playing");
      }
    });

    socketService.onQuestionStart((question) => {
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setTimeLeft(10);
    });

    socketService.onPlayerEliminated((data) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.userId === data.userId ? { ...p, eliminated: true } : p
        )
      );

      if (data.userId === socket.id) {
        setGameStatus("eliminated");
      }
    });

    socketService.onBattleEnd((data) => {
      if (data.winners.some((w) => w.userId === socket.id)) {
        setGameStatus("won");
        setShowConfetti(true);
      }
    });

    return () => socketService.disconnect();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && gameStatus === "playing" && !selectedAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedAnswer) {
      handleAutoElimination();
    }
  }, [timeLeft, gameStatus, selectedAnswer]);

  const createRoom = async () => {
    const response = await fetch("/api/battle/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty: 3 }),
    });
    const data = await response.json();
    setRoomId(data.roomId);
    socketService.joinBattleRoom(data.roomId, { username: "Player" });
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null || timeLeft === 0) return;

    setSelectedAnswer(answerIndex);
    const responseTime = 10 - timeLeft;

    socketService.submitAnswer({
      roomId,
      questionIndex: currentQuestion.index,
      answer: answerIndex,
      responseTime,
    });
  };

  const handleAutoElimination = () => {
    setGameStatus("eliminated");
    socketService.submitAnswer({
      roomId,
      questionIndex: currentQuestion.index,
      answer: -1,
      responseTime: 10,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {showConfetti && <Confetti />}

      {gameStatus === "waiting" && (
        <div className="max-w-2xl mx-auto mt-20 text-center">
          <motion.h1
            className="text-6xl font-bold text-white mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            ⚔️ Battle Royale Arena
          </motion.h1>

          {!roomId ? (
            <motion.button
              onClick={createRoom}
              className="bg-yellow-500 text-black px-12 py-4 rounded-full text-2xl font-bold hover:bg-yellow-400 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Battle Room
            </motion.button>
          ) : (
            <div>
              <p className="text-white text-xl mb-4">Waiting for players...</p>
              <p className="text-yellow-400 text-3xl font-bold">
                {players.length} / 10
              </p>
              <div className="mt-8 grid grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-20 rounded-lg ${
                      i < players.length ? "bg-green-500" : "bg-gray-700"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {gameStatus === "playing" && currentQuestion && (
        <div className="max-w-4xl mx-auto mt-10">
          {/* Timer */}
          <div className="mb-8">
            <div className="bg-gray-800 rounded-full h-4 overflow-hidden">
              <motion.div
                className={`h-full ${
                  timeLeft > 5
                    ? "bg-green-500"
                    : timeLeft > 2
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / 10) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
            <p className="text-center text-white text-2xl mt-2">{timeLeft}s</p>
          </div>

          {/* Question */}
          <motion.div
            className="bg-white rounded-2xl p-8 mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-6 rounded-xl text-xl font-semibold transition ${
                    selectedAnswer === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Players Grid */}
          <div className="grid grid-cols-5 gap-2">
            {players.map((player, index) => (
              <motion.div
                key={player.userId}
                className={`p-3 rounded-lg text-center ${
                  player.eliminated ? "bg-red-900" : "bg-green-600"
                }`}
                animate={player.eliminated ? { scale: 0.8, opacity: 0.5 } : {}}
              >
                <p className="text-white font-bold">{player.username}</p>
                <p className="text-yellow-300">{player.score}</p>
                {player.eliminated && <p className="text-red-300">💥</p>}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {gameStatus === "eliminated" && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <motion.h1
              className="text-8xl mb-8"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              💥
            </motion.h1>
            <h2 className="text-5xl font-bold text-red-500 mb-4">
              ELIMINATED!
            </h2>
            <p className="text-white text-2xl mb-8">Better luck next time</p>
            <button
              onClick={() => navigate("/learn")}
              className="bg-blue-500 text-white px-8 py-3 rounded-full text-xl hover:bg-blue-600"
            >
              Back to Learning
            </button>
          </div>
        </motion.div>
      )}

      {gameStatus === "won" && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <motion.h1
              className="text-8xl mb-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              🏆
            </motion.h1>
            <h2 className="text-6xl font-bold text-yellow-400 mb-4">
              VICTORY!
            </h2>
            <p className="text-white text-2xl mb-2">
              You finished in the top 3!
            </p>
            <p className="text-green-400 text-3xl font-bold mb-8">
              +100 Coins | +50 XP
            </p>
            <button
              onClick={() => navigate("/learn")}
              className="bg-yellow-500 text-black px-8 py-3 rounded-full text-xl font-bold hover:bg-yellow-400"
            >
              Continue Learning
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
