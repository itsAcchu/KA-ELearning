import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, CheckCircle, XCircle } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("kannada_auth_token");

      const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLesson(data);
      } else {
        setLesson(getDemoLesson(id));
      }
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
      setLesson(getDemoLesson(id));
    } finally {
      setLoading(false);
    }
  };

  const getDemoLesson = (lessonId) => {
    const demoLessons = {
      1: {
        title: "Greetings (ನಮಸ್ಕಾರಗಳು)",
        description: "Learn basic Kannada greetings",
        exercises: [
          {
            question: 'How do you say "Hello" in Kannada?',
            options: ["ನಮಸ್ಕಾರ", "ಧನ್ಯವಾದ", "ಹೇಗಿದೀರಿ", "ವಿದಾಯ"],
            correct: 0,
            explanation: 'ನಮಸ್ಕಾರ (Namaskāra) means "Hello" or "Greetings"',
          },
          {
            question: 'What does "ಧನ್ಯವಾದ" mean?',
            options: ["Goodbye", "Thank you", "Hello", "Please"],
            correct: 1,
            explanation: 'ಧನ್ಯವಾದ (Dhanyavāda) means "Thank you"',
          },
          {
            question: 'How do you say "How are you?" in Kannada?',
            options: ["ನಮಸ್ಕಾರ", "ಹೇಗಿದೀರಿ", "ವಿದಾಯ", "ಧನ್ಯವಾದ"],
            correct: 1,
            explanation: 'ಹೇಗಿದೀರಿ (Hēgidīri) means "How are you?"',
          },
          {
            question: 'What does "ವಿದಾಯ" mean?',
            options: ["Hello", "Thank you", "Goodbye", "Please"],
            correct: 2,
            explanation: 'ವಿದಾಯ (Vidāya) means "Goodbye"',
          },
          {
            question: 'Choose the correct translation for "Good morning"',
            options: ["ಶುಭ ರಾತ್ರಿ", "ಶುಭೋದಯ", "ಶುಭ ಸಂಧ್ಯೆ", "ನಮಸ್ಕಾರ"],
            correct: 1,
            explanation: 'ಶುಭೋದಯ (Śubhōdaya) means "Good morning"',
          },
        ],
      },
      2: {
        title: "Numbers (ಸಂಖ್ಯೆಗಳು)",
        description: "Learn numbers in Kannada",
        exercises: [
          {
            question: 'What is "one" in Kannada?',
            options: ["ಎರಡು", "ಒಂದು", "ಮೂರು", "ನಾಲ್ಕು"],
            correct: 1,
            explanation: 'ಒಂದು (Ondu) means "one"',
          },
          {
            question: 'How do you say "five"?',
            options: ["ಎರಡು", "ಮೂರು", "ಐದು", "ಆರು"],
            correct: 2,
            explanation: 'ಐದು (Aidu) means "five"',
          },
          {
            question: 'What does "ಹತ್ತು" mean?',
            options: ["Five", "Eight", "Ten", "Twenty"],
            correct: 2,
            explanation: 'ಹತ್ತು (Hattu) means "ten"',
          },
          {
            question: 'Choose "three" in Kannada',
            options: ["ಎರಡು", "ಮೂರು", "ನಾಲ್ಕು", "ಐದು"],
            correct: 1,
            explanation: 'ಮೂರು (Mūru) means "three"',
          },
          {
            question: 'What is "seven" in Kannada?',
            options: ["ಆರು", "ಏಳು", "ಎಂಟು", "ಒಂಬತ್ತು"],
            correct: 1,
            explanation: 'ಏಳು (Ēḷu) means "seven"',
          },
        ],
      },
      3: {
        title: "Colors (ಬಣ್ಣಗಳು)",
        description: "Learn color names in Kannada",
        exercises: [
          {
            question: 'What is "red" in Kannada?',
            options: ["ನೀಲಿ", "ಕೆಂಪು", "ಹಸಿರು", "ಹಳದಿ"],
            correct: 1,
            explanation: 'ಕೆಂಪು (Kempu) means "red"',
          },
          {
            question: 'How do you say "blue"?',
            options: ["नೀಲಿ", "ಕೆಂಪು", "ಬಿಳಿ", "ಕಪ್ಪು"],
            correct: 0,
            explanation: 'ನೀಲಿ (Nīli) means "blue"',
          },
          {
            question: 'What does "ಹಸಿರು" mean?',
            options: ["Red", "Green", "Yellow", "White"],
            correct: 1,
            explanation: 'ಹಸಿರು (Hasiru) means "green"',
          },
          {
            question: 'Choose "yellow" in Kannada',
            options: ["ಹಳದಿ", "ಕೆಂಪು", "ನೀಲಿ", " ಕಪ್ಪು"],
            correct: 0,
            explanation: 'ಹಳದಿ (Haḷadi) means "yellow"',
          },
          {
            question: 'What is "white" in Kannada?',
            options: ["ಕಪ್ಪು", "ಬಿಳಿ", "ಕೆಂಪು", "ನೀಲಿ"],
            correct: 1,
            explanation: 'ಬಿಳಿ (Biḷi) means "white"',
          },
        ],
      },
    };

    return demoLessons[lessonId] || demoLessons["1"];
  };

  const handleAnswerSelect = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect =
      selectedAnswer === lesson.exercises[currentQuestion].correct;

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const handleNext = () => {
    if (currentQuestion < lesson.exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const finalScore = Math.round((score / lesson.exercises.length) * 100);

    try {
      const token = localStorage.getItem("kannada_auth_token");
      await fetch(`${API_BASE_URL}/progress/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: id,
          completed: true,
          score: finalScore,
          timeSpent: 300,
        }),
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }

    navigate("/learn", {
      state: {
        lessonCompleted: true,
        score: finalScore,
      },
    });
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "kn-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Lesson not found</p>
        <Button onClick={() => navigate("/learn")} className="mt-4">
          Back to Learning Path
        </Button>
      </div>
    );
  }

  const exercise = lesson.exercises[currentQuestion];
  const progress = ((currentQuestion + 1) / lesson.exercises.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/learn")}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Learning Path
      </button>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">{lesson.title}</h2>
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {lesson.exercises.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {exercise.question}
          </h3>
          {exercise.audio && (
            <button
              onClick={() => speak(exercise.question)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Volume2 className="w-6 h-6 text-primary-600" />
            </button>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {exercise.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === exercise.correct;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  showCorrect
                    ? "bg-success/20 border-2 border-success"
                    : showWrong
                    ? "bg-error/20 border-2 border-error"
                    : isSelected
                    ? "bg-primary-100 border-2 border-primary-600"
                    : "bg-white border-2 border-gray-200 hover:border-primary-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">{option}</span>
                  {showCorrect && (
                    <CheckCircle className="w-6 h-6 text-success" />
                  )}
                  {showWrong && <XCircle className="w-6 h-6 text-error" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg ${
              selectedAnswer === exercise.correct
                ? "bg-success/10 border border-success"
                : "bg-error/10 border border-error"
            }`}
          >
            <p className="font-medium mb-2">
              {selectedAnswer === exercise.correct
                ? "✅ Correct!"
                : "❌ Incorrect"}
            </p>
            <p className="text-sm text-gray-700">{exercise.explanation}</p>
          </motion.div>
        )}

        {!showResult && (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full mt-6"
          >
            Check Answer
          </Button>
        )}
      </Card>

      <div className="text-center text-gray-600">
        Score: {score} / {lesson.exercises.length}
      </div>
    </div>
  );
}
