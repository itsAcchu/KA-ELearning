import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Star,
  Trophy,
  Sparkles,
  CheckCircle,
  Target,
  Book,
  Lightbulb,
  X,
  Award,
  Clock,
  Brain,
} from "lucide-react";
import axios from "axios";

export default function StoryReader() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showOutcome, setShowOutcome] = useState(false);
  const [completedStory, setCompletedStory] = useState(false);
  const [learnedVocabulary, setLearnedVocabulary] = useState([]);
  const [grammarTips, setGrammarTips] = useState([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/stories/${id}`
      );
      setStory(data.story);
    } catch (error) {
      console.error("Error fetching story:", error);
      alert("Failed to load story");
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = (choice) => {
    // Award XP
    const newXP = earnedXP + choice.xpReward;
    setEarnedXP(newXP);

    // Collect vocabulary and grammar from current scene
    const currentScene = story.scenes[currentSceneIndex];
    if (currentScene.vocabulary) {
      setLearnedVocabulary((prev) => [...prev, ...currentScene.vocabulary]);
    }
    if (currentScene.grammarTip) {
      setGrammarTips((prev) => [...prev, currentScene.grammarTip]);
    }

    // Show learning outcome
    setShowOutcome(true);

    // Wait 2 seconds then move to next scene or complete story
    setTimeout(() => {
      setShowOutcome(false);

      // ✅ CHECK IF THIS IS THE LAST SCENE
      if (currentSceneIndex >= story.scenes.length - 1) {
        // THIS IS THE LAST SCENE - Complete the story
        completeStory();
      } else {
        // Move to next scene
        setCurrentSceneIndex(currentSceneIndex + 1);
      }
    }, 2000);
  };

  const completeStory = async () => {
    try {
      await axios.post(`http://localhost:5000/api/stories/${id}/complete`, {
        scenesCompleted: story.scenes.length,
        vocabularyLearned: learnedVocabulary.length,
      });
      setCompletedStory(true);
    } catch (error) {
      console.error("Error completing story:", error);
      // Still show completion screen even if API fails
      setCompletedStory(true);
    }
  };

  const speakKannada = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "kn-IN";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const calculateTimeSpent = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
    return timeSpent > 0 ? timeSpent : 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto text-purple-600 animate-bounce mb-4" />
          <p className="text-gray-600 font-semibold">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Story not found</p>
          <Link to="/stories" className="text-purple-600 underline mt-4 block">
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const currentScene = story.scenes[currentSceneIndex];
  const uniqueVocab = Array.from(
    new Set(learnedVocabulary.map((v) => v.kannada))
  ).map((kannada) => learnedVocabulary.find((v) => v.kannada === kannada));

  // ✅ STORY COMPLETION SCREEN
  if (completedStory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl w-full"
        >
          {/* Trophy Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", duration: 0.8 }}
            className="text-center mb-8"
          >
            <Trophy className="w-32 h-32 mx-auto text-yellow-500 mb-4" />
            <h1 className="text-5xl font-bold text-purple-600 mb-2">
              Mission Complete! 🎉
            </h1>
            <p className="text-2xl text-gray-700">{story.title}</p>
            <p className="text-xl text-purple-600 font-semibold">
              {story.titleKannada}
            </p>
          </motion.div>

          {/* XP Earned */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center justify-center gap-3 text-4xl font-bold text-orange-600 mb-2">
              <Star className="w-10 h-10" />+{earnedXP} XP Earned!
            </div>
            <p className="text-center text-gray-600">
              You've completed all {story.scenes.length} scenes!
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-purple-50 rounded-xl p-6 text-center"
            >
              <Book className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Scenes</p>
              <p className="text-3xl font-bold text-purple-600">
                {story.scenes.length}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-green-50 rounded-xl p-6 text-center"
            >
              <Sparkles className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Vocabulary</p>
              <p className="text-3xl font-bold text-green-600">
                {uniqueVocab.length}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="bg-blue-50 rounded-xl p-6 text-center"
            >
              <Brain className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Grammar Tips</p>
              <p className="text-3xl font-bold text-blue-600">
                {grammarTips.length}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="bg-orange-50 rounded-xl p-6 text-center"
            >
              <Clock className="w-8 h-8 mx-auto text-orange-600 mb-2" />
              <p className="text-sm text-gray-600">Time</p>
              <p className="text-3xl font-bold text-orange-600">
                {calculateTimeSpent()} min
              </p>
            </motion.div>
          </div>

          {/* What You Learned */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-600" />
              What You Learned
            </h2>

            {/* Vocabulary Section */}
            {uniqueVocab.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Vocabulary ({uniqueVocab.length} words)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {uniqueVocab.map((word, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4"
                    >
                      <div className="font-bold text-purple-700 text-lg">
                        {word.kannada}
                      </div>
                      <div className="text-gray-600">{word.english}</div>
                      <div className="text-xs text-purple-500">
                        ({word.pronunciation})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grammar Tips Section */}
            {grammarTips.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Grammar Tips ({grammarTips.length})
                </h3>
                <div className="space-y-2">
                  {grammarTips.map((tip, index) => (
                    <div
                      key={index}
                      className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl"
                    >
                      <p className="text-green-800">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex gap-4"
          >
            <button
              onClick={() => navigate("/stories")}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition text-lg"
            >
              Explore More Stories
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition text-lg"
            >
              Replay Story
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ✅ REGULAR STORY READING VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/stories"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Stories
          </Link>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">{story.title}</h3>
              <div className="flex items-center gap-2 text-orange-600 font-bold">
                <Star className="w-5 h-5" />
                {earnedXP} XP
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((currentSceneIndex + 1) / story.scenes.length) * 100
                  }%`,
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Scene {currentSceneIndex + 1} of {story.scenes.length}
            </p>
          </div>
        </div>

        {/* Main Story Card */}
        <motion.div
          key={currentSceneIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6"
        >
          {/* Scene Image/Emoji */}
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-12 text-center">
            <div className="text-8xl mb-4">{currentScene.imageEmoji}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentScene.title}
            </h2>
          </div>

          {/* Mission */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <div className="flex items-start gap-3">
              <Target className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">🎯 Mission:</h3>
                <p className="text-yellow-800">{currentScene.mission}</p>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="p-8">
            <div className="mb-6">
              <p className="text-xl text-gray-800 leading-relaxed mb-4">
                {currentScene.content}
              </p>
              <div className="flex items-start gap-2 bg-purple-50 p-4 rounded-xl">
                <button
                  onClick={() => speakKannada(currentScene.contentKannada)}
                  className="text-purple-600 hover:text-purple-700 transition"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <p className="text-lg text-purple-700 font-semibold">
                  {currentScene.contentKannada}
                </p>
              </div>
            </div>

            {/* Vocabulary */}
            {currentScene.vocabulary && currentScene.vocabulary.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Book className="w-5 h-5 text-purple-600" />
                  📘 Vocabulary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentScene.vocabulary.map((word, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedWord(word);
                        setShowVocabulary(true);
                        speakKannada(word.kannada);
                      }}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 text-left hover:border-purple-400 transition"
                    >
                      <div className="font-bold text-purple-700 text-lg mb-1">
                        {word.kannada}
                      </div>
                      <div className="text-sm text-gray-600">
                        {word.english}
                      </div>
                      <div className="text-xs text-purple-500 mt-1">
                        ({word.pronunciation})
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Grammar Tip */}
            {currentScene.grammarTip && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">
                      💡 Grammar Tip:
                    </h4>
                    <p className="text-green-800">{currentScene.grammarTip}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Choices */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">
                What will you do?
              </h3>
              <div className="space-y-3">
                {currentScene.choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(choice)}
                    className="w-full p-4 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl text-left hover:border-purple-500 hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">
                          {choice.text}
                        </p>
                        <p className="text-purple-600 font-medium">
                          {choice.textKannada}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-orange-600 font-bold">
                        <Star className="w-5 h-5" />+{choice.xpReward}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Learning Outcome Modal */}
        <AnimatePresence>
          {showOutcome && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full"
              >
                <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                  Great Choice!
                </h3>
                <p className="text-center text-gray-600 mb-6">
                  {currentScene.learningOutcome}
                </p>
                <div className="text-center text-sm text-gray-500">
                  {currentSceneIndex >= story.scenes.length - 1
                    ? "Completing story..."
                    : "Moving to next scene..."}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vocabulary Modal */}
        <AnimatePresence>
          {showVocabulary && selectedWord && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVocabulary(false)}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-md w-full relative"
              >
                <button
                  onClick={() => setShowVocabulary(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                  <div className="text-6xl text-purple-600 font-bold mb-4">
                    {selectedWord.kannada}
                  </div>
                  <button
                    onClick={() => speakKannada(selectedWord.kannada)}
                    className="mb-4 p-3 bg-purple-100 rounded-full hover:bg-purple-200 transition"
                  >
                    <Volume2 className="w-6 h-6 text-purple-600" />
                  </button>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedWord.english}
                  </h3>
                  <p className="text-lg text-purple-600 mb-4">
                    Pronunciation: {selectedWord.pronunciation}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
