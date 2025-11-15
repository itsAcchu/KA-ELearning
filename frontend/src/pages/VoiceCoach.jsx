import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle,
  XCircle,
  SkipForward,
  RefreshCw,
  Brain,
  Trophy,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

// Connect Socket.IO client (optional for battles)
const socket = io("http://localhost:5000");

export default function VoiceCoach() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [targetPhrase, setTargetPhrase] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questionResults, setQuestionResults] = useState([]);

  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser. Please use Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "kn-IN";

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      setTranscript(transcript);
      analyzePronunciation(transcript, confidence);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      if (event.error === "no-speech") alert("No speech detected. Try again.");
    };

    recognitionRef.current.onend = () => setIsRecording(false);

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Start Quiz
  const startQuiz = async () => {
    try {
      const questions = [];
      for (let i = 0; i < 5; i++) {
        const { data } = await axios.get(
          "http://localhost:5000/api/voice-coach/phrase?difficulty=beginner"
        );
        questions.push(data.phrase);
      }
      setQuizQuestions(questions);
      setTargetPhrase(questions[0]);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setCorrectAnswers(0);
      setQuizCompleted(false);
      setQuestionResults([]);
      setAnalysis(null);
      setTranscript("");
    } catch (error) {
      console.error("Error starting quiz:", error);
      alert("Failed to start quiz. Please try again.");
    }
  };

  const startRecording = () => {
    setTranscript("");
    setAnalysis(null);
    setIsRecording(true);
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  // Analyze pronunciation via backend
  const analyzePronunciation = async (userTranscript, confidence) => {
    if (!targetPhrase) return;
    try {
      setAnalyzing(true);
      const { data } = await axios.post("http://localhost:5000/api/voice-coach/analyze", {
        userTranscript,
        confidence,
        targetPhrase: targetPhrase.kannada,
        currentXP: 0,
        currentLevel: 1,
      });

      const result = data.analysis;
      setAnalysis(result);

      const isCorrect = result.accuracyScore >= 70;

      setQuestionResults(prev => [
        ...prev,
        {
          question: targetPhrase.kannada,
          userAnswer: userTranscript,
          score: result.accuracyScore,
          isCorrect,
        },
      ]);

      if (isCorrect) setCorrectAnswers(prev => prev + 1);
    } catch (error) {
      console.error("Error analyzing pronunciation:", error);
      alert("Failed to analyze pronunciation. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= 5) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(nextIndex);
      setTargetPhrase(quizQuestions[nextIndex]);
      setTranscript("");
      setAnalysis(null);
    }
  };

  const skipQuestion = () => {
    setQuestionResults(prev => [
      ...prev,
      { question: targetPhrase.kannada, userAnswer: "Skipped", score: 0, isCorrect: false },
    ]);
    nextQuestion();
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setTargetPhrase(null);
    setTranscript("");
    setAnalysis(null);
    setQuestionResults([]);
  };

  const speakKannada = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "kn-IN";
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreEmoji = (score) => {
    if (score >= 80) return "🎉";
    if (score >= 60) return "👍";
    return "💪";
  };

  // ----------------- RENDER -----------------
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-900 to-teal-700 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center"
        >
          <Brain className="w-24 h-24 mx-auto mb-6 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Kannada Pronunciation Quiz</h1>
          <p className="text-xl text-gray-600 mb-8">Test your Kannada pronunciation skills with 5 random questions!</p>
          <button
            onClick={startQuiz}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-xl hover:shadow-lg transition-all"
          >
            Start Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((correctAnswers / 5) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-900 to-teal-700 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-3xl w-full"
        >
          <div className="text-center mb-8">
            <Trophy className="w-32 h-32 mx-auto mb-6 text-yellow-500" />
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Quiz Complete! 🎉</h1>
            <div className="text-6xl font-bold text-purple-600 mb-4">{correctAnswers} / 5</div>
            <p className="text-2xl text-gray-600">
              You got {correctAnswers} correct out of 5 questions ({percentage}%)
            </p>
          </div>

          <div className="mb-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Results:</h2>
            {questionResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 ${
                  result.isCorrect ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-800">
                      Question {index + 1}: {result.question}
                    </div>
                    <div className="text-sm text-gray-600">Your answer: {result.userAnswer}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.isCorrect ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600" />
                    )}
                    <span className="text-2xl font-bold">{result.score}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={restartQuiz}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-xl hover:shadow-lg transition-all"
          >
            <RefreshCw className="inline w-6 h-6 mr-2" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-900 to-teal-700 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Kannada Pronunciation Quiz</h1>
              <p className="text-gray-600">Question {currentQuestionIndex + 1} of 5</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-full"
            />
          </div>
        </motion.div>

        {/* Question Card */}
        {targetPhrase && (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Say this in Kannada:</h2>
              <div className="text-6xl font-bold text-purple-600 mb-4">{targetPhrase.kannada}</div>
              <div className="text-2xl text-gray-600 mb-2">{targetPhrase.english}</div>
              <div className="text-xl text-gray-500">Pronunciation: {targetPhrase.pronunciation}</div>
              <button
                onClick={() => speakKannada(targetPhrase.kannada)}
                className="mt-4 px-6 py-2 bg-purple-100 text-purple-700 rounded-xl font-semibold hover:bg-purple-200 transition-all"
              >
                <Volume2 className="inline w-5 h-5 mr-2" /> Listen
              </button>
            </div>

            {/* Recording Controls */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={analyzing}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRecording ? <><MicOff className="inline w-6 h-6 mr-2" /> Stop Recording</> :
                <><Mic className="inline w-6 h-6 mr-2" /> Start Recording</>}
              </button>

              <button
                onClick={skipQuestion}
                disabled={analyzing}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward className="inline w-6 h-6 mr-2" /> Skip
              </button>
            </div>

            {/* Transcript */}
            {transcript && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-600 mb-1">You said:</div>
                <div className="text-2xl font-bold text-gray-800">{transcript}</div>
              </motion.div>
            )}

            {/* Analysis Result */}
            <AnimatePresence>
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className={`p-6 rounded-xl ${getScoreColor(analysis.accuracyScore)}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold">
                        Accuracy Score: {analysis.accuracyScore}% {getScoreEmoji(analysis.accuracyScore)}
                      </div>
                      {analysis.accuracyScore >= 70 ?
                        <CheckCircle className="w-12 h-12 text-green-600" /> :
                        <XCircle className="w-12 h-12 text-red-600" />}
                    </div>
                    <div className="text-lg">{analysis.analysis.explanation}</div>
                  </div>

                  <button
                    onClick={nextQuestion}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-xl hover:shadow-lg transition-all"
                  >
                    Next Question →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {analyzing && (
              <div className="text-center text-purple-600 font-semibold">
                <Sparkles className="inline w-6 h-6 mr-2 animate-spin" />
                Analyzing your pronunciation...
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
