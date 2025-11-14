import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Book,
  MapPin,
  Clock,
  Star,
  ArrowLeft,
  Trophy,
  Loader,
  Sparkles,
  Users,
  Baby,
  Briefcase,
} from "lucide-react";
import axios from "axios";

const LOCATIONS = {
  mysore: { name: "Mysore", emoji: "🏰", color: "from-purple-500 to-pink-500" },
  bangalore: {
    name: "Bangalore",
    emoji: "🌆",
    color: "from-blue-500 to-cyan-500",
  },
  coorg: { name: "Coorg", emoji: "🌄", color: "from-green-500 to-emerald-500" },
  hampi: { name: "Hampi", emoji: "🕌", color: "from-orange-500 to-red-500" },
  karnataka: {
    name: "Karnataka",
    emoji: "🎭",
    color: "from-yellow-500 to-amber-500",
  },
};

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

const MODE_ICONS = {
  child: { icon: Baby, label: "Child Mode", color: "text-pink-500" },
  adult: { icon: Briefcase, label: "Adult Mode", color: "text-blue-500" },
  parent: { icon: Users, label: "Parent Mode", color: "text-green-500" },
};

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [filter, setFilter] = useState({
    mode: "",
    difficulty: "",
    location: "",
  });
  const [generatorForm, setGeneratorForm] = useState({
    mode: "adult",
    difficulty: "beginner",
    location: "bangalore",
    topic: "",
  });

  useEffect(() => {
    fetchStories();
  }, [filter]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.mode) params.append("mode", filter.mode);
      if (filter.difficulty) params.append("difficulty", filter.difficulty);
      if (filter.location) params.append("location", filter.location);

      const { data } = await axios.get(
        `http://localhost:5000/api/stories?${params}`
      );
      setStories(data.stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIStory = async () => {
    try {
      setGenerating(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/stories/generate",
        generatorForm
      );

      console.log("✅ Story generated:", data.story);
      setShowGenerator(false);
      fetchStories(); // Refresh list
      alert("🎉 AI Story generated successfully!");
    } catch (error) {
      console.error("❌ Error generating story:", error);
      alert("Failed to generate story. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-3">
              <Book className="w-10 h-10" />
              Interactive Stories
            </h1>
            <p className="text-gray-600 mb-4">
              Learn Kannada through engaging mission-based stories from
              Karnataka!
            </p>
            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition"
            >
              <Sparkles className="w-5 h-5" />
              Generate AI Story
            </button>
          </div>
        </div>

        {/* AI Story Generator Modal */}
        <AnimatePresence>
          {showGenerator && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Generate AI Story
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode
                    </label>
                    <select
                      value={generatorForm.mode}
                      onChange={(e) =>
                        setGeneratorForm({
                          ...generatorForm,
                          mode: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="child">Child Mode 👶</option>
                      <option value="adult">Adult Mode 💼</option>
                      <option value="parent">Parent Mode 👨‍👩‍👧</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={generatorForm.difficulty}
                      onChange={(e) =>
                        setGeneratorForm({
                          ...generatorForm,
                          difficulty: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      value={generatorForm.location}
                      onChange={(e) =>
                        setGeneratorForm({
                          ...generatorForm,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {Object.entries(LOCATIONS).map(
                        ([key, { name, emoji }]) => (
                          <option key={key} value={key}>
                            {emoji} {name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic (Optional)
                    </label>
                    <input
                      type="text"
                      value={generatorForm.topic}
                      onChange={(e) =>
                        setGeneratorForm({
                          ...generatorForm,
                          topic: e.target.value,
                        })
                      }
                      placeholder="e.g., visiting a market, meeting friends"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={generateAIStory}
                    disabled={generating}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
                  >
                    {generating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      "Generate Story"
                    )}
                  </button>
                  <button
                    onClick={() => setShowGenerator(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Filter Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode
              </label>
              <select
                value={filter.mode}
                onChange={(e) => setFilter({ ...filter, mode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Modes</option>
                <option value="child">Child Mode</option>
                <option value="adult">Adult Mode</option>
                <option value="parent">Parent Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={filter.location}
                onChange={(e) =>
                  setFilter({ ...filter, location: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Locations</option>
                {Object.entries(LOCATIONS).map(([key, { name, emoji }]) => (
                  <option key={key} value={key}>
                    {emoji} {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filter.difficulty}
                onChange={(e) =>
                  setFilter({ ...filter, difficulty: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 mx-auto text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Book className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              No stories found. Generate your first AI story!
            </p>
            <button
              onClick={() => setShowGenerator(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition"
            >
              <Sparkles className="w-5 h-5" />
              Generate AI Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => {
              const location = LOCATIONS[story.location];
              const ModeIcon = MODE_ICONS[story.mode]?.icon || Briefcase;
              return (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
                >
                  {/* Cover */}
                  <div
                    className={`h-48 bg-gradient-to-br ${location.color} flex items-center justify-center text-6xl relative`}
                  >
                    {story.coverEmoji || location.emoji}
                    {story.generatedByAI && (
                      <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-purple-600">
                        <Sparkles className="w-3 h-3" />
                        AI
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          DIFFICULTY_COLORS[story.difficulty]
                        }`}
                      >
                        {story.difficulty.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <ModeIcon className="w-4 h-4" />
                        {story.mode}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {location.name}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {story.title}
                    </h3>
                    <p className="text-purple-600 font-semibold mb-3">
                      {story.titleKannada}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {story.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {story.estimatedTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {story.xpReward} XP
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-green-500" />
                        {story.completionCount}
                      </div>
                    </div>

                    {/* Start Button */}
                    <Link
                      to={`/stories/${story._id}`}
                      className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition text-center"
                    >
                      Start Mission
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
