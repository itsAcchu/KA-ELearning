import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Volume2,
} from "lucide-react";
import { useUserStore } from "../store/userStore";

export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, lessonsCompleted } = useUserStore();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  // Lesson Data - Add more lessons here
  const lessons = {
    1: {
      title: "Greetings",
      icon: "👋",
      description: "Learn common Kannada greetings",
      xp: 50,
      questions: [
        {
          question: 'How do you say "Hello" in Kannada?',
          kannada: "ನಮಸ್ಕಾರ",
          options: ["Namaskara", "Dhanyavada", "Chennaagide", "Shubhodaya"],
          correct: 0,
          translation: "Hello/Greetings",
        },
        {
          question: 'What does "ಧನ್ಯವಾದ" mean?',
          kannada: "ಧನ್ಯವಾದ",
          options: ["Hello", "Thank you", "Goodbye", "Good morning"],
          correct: 1,
          translation: "Thank you",
        },
        {
          question: 'How do you say "How are you?" in Kannada?',
          kannada: "ಹೇಗಿದ್ದೀರಿ",
          options: ["Namaskara", "Heegiddeeri", "Chennaagide", "Sari"],
          correct: 1,
          translation: "How are you?",
        },
        {
          question: 'What does "ಚೆನ್ನಾಗಿದೆ" mean?',
          kannada: "ಚೆನ್ನಾಗಿದೆ",
          options: ["Hello", "Thank you", "I am fine", "Goodbye"],
          correct: 2,
          translation: "I am fine",
        },
        {
          question: 'How do you say "Good morning" in Kannada?',
          kannada: "ಶುಭೋದಯ",
          options: ["Shubhodaya", "Shubha ratri", "Namaskara", "Vidaya"],
          correct: 0,
          translation: "Good morning",
        },
      ],
    },
    2: {
      title: "Numbers",
      icon: "🔢",
      description: "Learn Kannada numbers 1-10",
      xp: 50,
      questions: [
        {
          question: 'What is "One" in Kannada?',
          kannada: "ಒಂದು",
          options: ["Ondu", "Eradu", "Mooru", "Naaku"],
          correct: 0,
          translation: "One",
        },
        {
          question: 'What is "Five" in Kannada?',
          kannada: "ಐದು",
          options: ["Naaku", "Aidu", "Aaru", "Elu"],
          correct: 1,
          translation: "Five",
        },
        {
          question: 'What is "Ten" in Kannada?',
          kannada: "ಹತ್ತು",
          options: ["Ombattu", "Hattu", "Entu", "Aidu"],
          correct: 1,
          translation: "Ten",
        },
      ],
    },
    3: {
      title: "Colors",
      icon: "🎨",
      description: "Learn colors in Kannada",
      xp: 50,
      questions: [
        {
          question: 'What is "Red" in Kannada?',
          kannada: "ಕೆಂಪು",
          options: ["Kempu", "Bili", "Hasiru", "Nili"],
          correct: 0,
          translation: "Red",
        },
        {
          question: 'What is "Blue" in Kannada?',
          kannada: "ನೀಲಿ",
          options: ["Kempu", "Hasiru", "Nili", "Bili"],
          correct: 2,
          translation: "Blue",
        },
        {
          question: 'What is "Green" in Kannada?',
          kannada: "ಹಸಿರು",
          options: ["Kempu", "Hasiru", "Nili", "Bili"],
          correct: 1,
          translation: "Green",
        },
      ],
    },
    // Your existing lessons 1-3 stay the same, just add these after them:

    4: {
      title: "Family",
      icon: "👨‍👩‍👧‍👦",
      description: "Learn family terms",
      xp: 50,
      questions: [
        {
          question: "What is 'Mother' in Kannada?",
          kannada: "ಅಮ್ಮ",
          options: ["Amma", "Appa", "Akka", "Anna"],
          correct: 0,
          translation: "Mother",
        },
        {
          question: "What is 'Father' in Kannada?",
          kannada: "ಅಪ್ಪ",
          options: ["Amma", "Appa", "Thambi", "Thayi"],
          correct: 1,
          translation: "Father",
        },
        {
          question: "What does 'ಅಕ್ಕ' mean?",
          kannada: "ಅಕ್ಕ",
          options: ["Brother", "Elder Sister", "Mother", "Younger Sister"],
          correct: 1,
          translation: "Elder Sister",
        },
        {
          question: "What is 'Son' in Kannada?",
          kannada: "ಮಗ",
          options: ["Maga", "Magalu", "Anna", "Thambi"],
          correct: 0,
          translation: "Son",
        },
        {
          question: "What is 'Daughter' in Kannada?",
          kannada: "ಮಗಳು",
          options: ["Maga", "Magalu", "Amma", "Akka"],
          correct: 1,
          translation: "Daughter",
        },
      ],
    },
    5: {
      title: "Food",
      icon: "🍛",
      description: "Learn food vocabulary",
      xp: 50,
      questions: [
        {
          question: "What is 'Rice' in Kannada?",
          kannada: "ಅನ್ನ",
          options: ["Anna", "Roti", "Dose", "Idli"],
          correct: 0,
          translation: "Rice",
        },
        {
          question: "What is 'Water' in Kannada?",
          kannada: "ನೀರು",
          options: ["Haalu", "Neeru", "Bele", "Tovve"],
          correct: 1,
          translation: "Water",
        },
        {
          question: "What does 'ಹಾಲು' mean?",
          kannada: "ಹಾಲು",
          options: ["Water", "Milk", "Tea", "Coffee"],
          correct: 1,
          translation: "Milk",
        },
        {
          question: "What is 'Bread' in Kannada?",
          kannada: "ರೊಟ್ಟಿ",
          options: ["Roti", "Dose", "Anna", "Idli"],
          correct: 0,
          translation: "Bread/Roti",
        },
        {
          question: "What is 'Coffee' in Kannada?",
          kannada: "ಕಾಫಿ",
          options: ["Haalu", "Neeru", "Kaapi", "Tovve"],
          correct: 2,
          translation: "Coffee",
        },
      ],
    },
    6: {
      title: "Shopping",
      icon: "🛒",
      description: "Learn shopping phrases",
      xp: 75,
      questions: [
        {
          question: "How do you say 'How much?'",
          kannada: "ಎಷ್ಟು",
          options: ["Eshtu", "Kodi", "Beda", "Sari"],
          correct: 0,
          translation: "How much?",
        },
        {
          question: "What does 'ಕೊಡಿ' mean?",
          kannada: "ಕೊಡಿ",
          options: ["Give me", "Take", "Buy", "Sell"],
          correct: 0,
          translation: "Give me",
        },
        {
          question: "How do you say 'Too expensive'?",
          kannada: "ತುಂಬಾ ದುಬಾರಿ",
          options: ["Thumba dubari", "Chennaagide", "Swalpa", "Sari"],
          correct: 0,
          translation: "Too expensive",
        },
        {
          question: "What is 'Shop' in Kannada?",
          kannada: "ಅಂಗಡಿ",
          options: ["Angadi", "Mane", "Beedhi", "Shaale"],
          correct: 0,
          translation: "Shop",
        },
        {
          question: "How do you say 'I want'?",
          kannada: "ನನಗೆ ಬೇಕು",
          options: ["Nanage beku", "Nanage ide", "Nanage illa", "Nanu"],
          correct: 0,
          translation: "I want",
        },
      ],
    },
    7: {
      title: "Directions",
      icon: "🗺️",
      description: "Learn direction words",
      xp: 75,
      questions: [
        {
          question: "What is 'Left' in Kannada?",
          kannada: "ಎಡ",
          options: ["Eda", "Bala", "Munche", "Hinde"],
          correct: 0,
          translation: "Left",
        },
        {
          question: "What is 'Right' in Kannada?",
          kannada: "ಬಲ",
          options: ["Eda", "Bala", "Munche", "Hinde"],
          correct: 1,
          translation: "Right",
        },
        {
          question: "What does 'ಮುಂದೆ' mean?",
          kannada: "ಮುಂದೆ",
          options: ["Left", "Right", "Forward", "Behind"],
          correct: 2,
          translation: "Forward/Ahead",
        },
        {
          question: "What is 'Where' in Kannada?",
          kannada: "ಎಲ್ಲಿ",
          options: ["Elli", "Yaava", "Hege", "Yaake"],
          correct: 0,
          translation: "Where",
        },
        {
          question: "How do you say 'Near'?",
          kannada: "ಹತ್ತಿರ",
          options: ["Hatthira", "Doora", "Elli", "Alli"],
          correct: 0,
          translation: "Near",
        },
      ],
    },
    8: {
      title: "Restaurant",
      icon: "🍽️",
      description: "Learn restaurant phrases",
      xp: 75,
      questions: [
        {
          question: "What is 'Menu' in Kannada?",
          kannada: "ಮೆನು",
          options: ["Menu", "Thinnu", "Kudee", "Plate"],
          correct: 0,
          translation: "Menu",
        },
        {
          question: "How do you say 'Delicious'?",
          kannada: "ರುಚಿಯಾಗಿದೆ",
          options: ["Ruchiyaagide", "Kharab", "Thumba", "Sari"],
          correct: 0,
          translation: "It's delicious",
        },
        {
          question: "What is 'Bill' in Kannada?",
          kannada: "ಬಿಲ್",
          options: ["Bill", "Duddu", "Khaali", "Menu"],
          correct: 0,
          translation: "Bill",
        },
        {
          question: "How do you say 'Spicy'?",
          kannada: "ಖಾರ",
          options: ["Uppitu", "Kaara", "Huli", "Thinnu"],
          correct: 1,
          translation: "Spicy",
        },
        {
          question: "What does 'ತಿನ್ನು' mean?",
          kannada: "ತಿನ್ನು",
          options: ["Drink", "Eat", "Cook", "Taste"],
          correct: 1,
          translation: "Eat",
        },
      ],
    },
    9: {
      title: "Weather",
      icon: "⛅",
      description: "Learn weather terms",
      xp: 75,
      questions: [
        {
          question: "What is 'Rain' in Kannada?",
          kannada: "ಮಳೆ",
          options: ["Male", "Bisi", "Taanu", "Haava"],
          correct: 0,
          translation: "Rain",
        },
        {
          question: "What is 'Hot' in Kannada?",
          kannada: "ಬಿಸಿ",
          options: ["Male", "Bisi", "Taanu", "Thanda"],
          correct: 1,
          translation: "Hot",
        },
        {
          question: "What does 'ತಂಪು' mean?",
          kannada: "ತಂಪು",
          options: ["Hot", "Rain", "Cold", "Wind"],
          correct: 2,
          translation: "Cold/Cool",
        },
        {
          question: "What is 'Sun' in Kannada?",
          kannada: "ಸೂರ್ಯ",
          options: ["Surya", "Chandra", "Nakshatra", "Megha"],
          correct: 0,
          translation: "Sun",
        },
        {
          question: "What is 'Cloud' in Kannada?",
          kannada: "ಮೋಡ",
          options: ["Male", "Moda", "Bisi", "Haava"],
          correct: 1,
          translation: "Cloud",
        },
      ],
    },
    10: {
      title: "Health",
      icon: "🏥",
      description: "Learn health vocabulary",
      xp: 75,
      questions: [
        {
          question: "What is 'Doctor' in Kannada?",
          kannada: "ವೈದ್ಯ",
          options: ["Vaidya", "Aaspatre", "Aushadha", "Novu"],
          correct: 0,
          translation: "Doctor",
        },
        {
          question: "What is 'Medicine' in Kannada?",
          kannada: "ಔಷಧ",
          options: ["Vaidya", "Aushadha", "Novu", "Jvara"],
          correct: 1,
          translation: "Medicine",
        },
        {
          question: "What does 'ನೋವು' mean?",
          kannada: "ನೋವು",
          options: ["Doctor", "Medicine", "Pain", "Hospital"],
          correct: 2,
          translation: "Pain",
        },
        {
          question: "What is 'Hospital' in Kannada?",
          kannada: "ಆಸ್ಪತ್ರೆ",
          options: ["Aaspatre", "Vaidya", "Aushadha", "Clinic"],
          correct: 0,
          translation: "Hospital",
        },
        {
          question: "What is 'Fever' in Kannada?",
          kannada: "ಜ್ವರ",
          options: ["Novu", "Jvara", "Thale", "Neeru"],
          correct: 1,
          translation: "Fever",
        },
      ],
    },
    11: {
      title: "Business",
      icon: "💼",
      description: "Learn business vocabulary",
      xp: 100,
      questions: [
        {
          question: "What is 'Work' in Kannada?",
          kannada: "ಕೆಲಸ",
          options: ["Kelasa", "Vyapaara", "Duddu", "Office"],
          correct: 0,
          translation: "Work",
        },
        {
          question: "What is 'Money' in Kannada?",
          kannada: "ಹಣ",
          options: ["Hana", "Duddu", "Kelasa", "Bank"],
          correct: 0,
          translation: "Money",
        },
        {
          question: "What does 'ವ್ಯಾಪಾರ' mean?",
          kannada: "ವ್ಯಾಪಾರ",
          options: ["Work", "Money", "Business", "Office"],
          correct: 2,
          translation: "Business",
        },
        {
          question: "What is 'Meeting' in Kannada?",
          kannada: "ಸಭೆ",
          options: ["Sabhe", "Kelasa", "Office", "Vyapaara"],
          correct: 0,
          translation: "Meeting",
        },
        {
          question: "What is 'Agreement' in Kannada?",
          kannada: "ಒಪ್ಪಂದ",
          options: ["Sari", "Oppanda", "Kelasa", "Sabhe"],
          correct: 1,
          translation: "Agreement",
        },
      ],
    },
    12: {
      title: "Travel",
      icon: "✈️",
      description: "Learn travel phrases",
      xp: 100,
      questions: [
        {
          question: "What is 'Airport' in Kannada?",
          kannada: "ವಿಮಾನ ನಿಲ್ದಾಣ",
          options: ["Vimana nildana", "Railway", "Bus stop", "Hotel"],
          correct: 0,
          translation: "Airport",
        },
        {
          question: "What is 'Ticket' in Kannada?",
          kannada: "ಟಿಕೆಟ್",
          options: ["Ticket", "Baggage", "Passport", "Visa"],
          correct: 0,
          translation: "Ticket",
        },
        {
          question: "What does 'ಪ್ರಯಾಣ' mean?",
          kannada: "ಪ್ರಯಾಣ",
          options: ["Airport", "Journey", "Hotel", "Ticket"],
          correct: 1,
          translation: "Journey/Travel",
        },
        {
          question: "What is 'Hotel' in Kannada?",
          kannada: "ಹೋಟೆಲ್",
          options: ["Hotel", "Mane", "Angadi", "Aaspatre"],
          correct: 0,
          translation: "Hotel",
        },
        {
          question: "What is 'Bus' in Kannada?",
          kannada: "ಬಸ್",
          options: ["Car", "Bus", "Train", "Auto"],
          correct: 1,
          translation: "Bus",
        },
      ],
    },
    13: {
      title: "Culture",
      icon: "🎭",
      description: "Learn cultural terms",
      xp: 100,
      questions: [
        {
          question: "What is 'Festival' in Kannada?",
          kannada: "ಹಬ್ಬ",
          options: ["Habba", "Sanje", "Raatri", "Dina"],
          correct: 0,
          translation: "Festival",
        },
        {
          question: "What is 'Dance' in Kannada?",
          kannada: "ನೃತ್ಯ",
          options: ["Naatya", "Sangeetha", "Chithra", "Nataka"],
          correct: 0,
          translation: "Dance",
        },
        {
          question: "What does 'ಸಂಗೀತ' mean?",
          kannada: "ಸಂಗೀತ",
          options: ["Dance", "Music", "Art", "Drama"],
          correct: 1,
          translation: "Music",
        },
        {
          question: "What is 'Temple' in Kannada?",
          kannada: "ದೇವಾಲಯ",
          options: ["Devalaya", "Mane", "Angadi", "Shaale"],
          correct: 0,
          translation: "Temple",
        },
        {
          question: "What is 'Tradition' in Kannada?",
          kannada: "ಸಂಪ್ರದಾಯ",
          options: ["Habba", "Sampradaya", "Naatya", "Riti"],
          correct: 1,
          translation: "Tradition",
        },
      ],
    },
    14: {
      title: "Literature",
      icon: "📚",
      description: "Learn literature terms",
      xp: 100,
      questions: [
        {
          question: "What is 'Book' in Kannada?",
          kannada: "ಪುಸ್ತಕ",
          options: ["Pustaka", "Kathe", "Kavana", "Patra"],
          correct: 0,
          translation: "Book",
        },
        {
          question: "What is 'Story' in Kannada?",
          kannada: "ಕಥೆ",
          options: ["Pustaka", "Kathe", "Kavana", "Nataka"],
          correct: 1,
          translation: "Story",
        },
        {
          question: "What does 'ಕವನ' mean?",
          kannada: "ಕವನ",
          options: ["Book", "Story", "Poem", "Letter"],
          correct: 2,
          translation: "Poem",
        },
        {
          question: "What is 'Writer' in Kannada?",
          kannada: "ಲೇಖಕ",
          options: ["Lekha", "Lekhaka", "Kathe", "Pustaka"],
          correct: 1,
          translation: "Writer/Author",
        },
        {
          question: "What is 'Reading' in Kannada?",
          kannada: "ಓದುವುದು",
          options: ["Bareyuva", "Oduvudu", "Maatanaduvudu", "Keluvudu"],
          correct: 1,
          translation: "Reading",
        },
      ],
    },
    15: {
      title: "Technology",
      icon: "💻",
      description: "Learn tech vocabulary",
      xp: 100,
      questions: [
        {
          question: "What is 'Computer' in Kannada?",
          kannada: "ಗಣಕ",
          options: ["Ganaka", "Phone", "Internet", "Email"],
          correct: 0,
          translation: "Computer",
        },
        {
          question: "What is 'Internet' in Kannada?",
          kannada: "ಅಂತರ್ಜಾಲ",
          options: ["Ganaka", "Antarjala", "Email", "Website"],
          correct: 1,
          translation: "Internet",
        },
        {
          question: "What does 'ದೂರವಾಣಿ' mean?",
          kannada: "ದೂರವಾಣಿ",
          options: ["Computer", "Internet", "Telephone", "Email"],
          correct: 2,
          translation: "Telephone",
        },
        {
          question: "What is 'Website' in Kannada?",
          kannada: "ಜಾಲತಾಣ",
          options: ["Jalatana", "Ganaka", "Antarjala", "Email"],
          correct: 0,
          translation: "Website",
        },
        {
          question: "What is 'App' in Kannada?",
          kannada: "ಆ್ಯಪ್",
          options: ["Phone", "App", "Computer", "Internet"],
          correct: 1,
          translation: "App/Application",
        },
      ],
    },
  };

  const lesson = lessons[lessonId];

  useEffect(() => {
    if (!lesson) {
      navigate("/learn");
    }
  }, [lesson, navigate]);

  if (!lesson) return null;

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === lesson.questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestion < lesson.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Lesson complete
        const finalScore = score + (isCorrect ? 1 : 0);
        const earnedXP = Math.floor(
          (finalScore / lesson.questions.length) * lesson.xp
        );

        // Add XP
        addXP(earnedXP);

        // Mark lesson as completed
        completeLesson(parseInt(lessonId));

        setLessonComplete(true);
      }
    }, 2000);
  };

  const speakKannada = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "kn-IN";
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (lessonComplete) {
    const finalScore = score;
    const totalQuestions = lesson.questions.length;
    const percentage = Math.floor((finalScore / totalQuestions) * 100);
    const earnedXP = Math.floor((percentage / 100) * lesson.xp);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6" />
          </motion.div>

          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Lesson Complete! 🎉
          </h1>

          <div className="bg-gradient-to-r from-teal-100 to-teal-200 rounded-2xl p-6 mb-6">
            <p className="text-3xl font-bold text-teal-700 mb-2">
              {finalScore} / {totalQuestions}
            </p>
            <p className="text-gray-700">Questions Correct</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-orange-600" />
              <p className="text-3xl font-bold text-orange-600">
                +{earnedXP} XP
              </p>
            </div>
            <p className="text-gray-700">Experience Points Earned</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              to="/learn"
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition transform hover:scale-105"
            >
              Continue Learning
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = lesson.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / lesson.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/learn"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Lessons</span>
          </Link>

          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-teal-600">
              {score} / {lesson.questions.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{lesson.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {lesson.title}
                </h2>
                <p className="text-gray-600 text-sm">{lesson.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Question</p>
              <p className="text-xl font-bold text-gray-800">
                {currentQuestion + 1} / {lesson.questions.length}
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Question */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                {question.question}
              </h3>
              {question.kannada && (
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6 inline-block">
                  <p className="text-5xl font-bold text-white mb-3">
                    {question.kannada}
                  </p>
                  <button
                    onClick={() => speakKannada(question.kannada)}
                    className="bg-white text-purple-600 px-6 py-2 rounded-xl font-bold hover:bg-purple-50 transition flex items-center gap-2 mx-auto"
                  >
                    <Volume2 className="w-5 h-5" />
                    Listen
                  </button>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correct;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                      whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className={`p-6 rounded-2xl font-bold text-lg transition-all ${
                        showCorrect
                          ? "bg-green-500 text-white"
                          : showWrong
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-gray-300 text-gray-700"
                          : "bg-gradient-to-r from-teal-100 to-teal-200 text-gray-800 hover:from-teal-200 hover:to-teal-300"
                      } ${
                        selectedAnswer !== null
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showCorrect && <CheckCircle className="w-6 h-6" />}
                        {showWrong && <XCircle className="w-6 h-6" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Result Message */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-6 p-6 rounded-2xl text-center ${
                      selectedAnswer === question.correct
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <p
                      className={`text-2xl font-bold mb-2 ${
                        selectedAnswer === question.correct
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedAnswer === question.correct
                        ? "🎉 Correct!"
                        : "❌ Incorrect"}
                    </p>
                    <p className="text-gray-700">{question.translation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
