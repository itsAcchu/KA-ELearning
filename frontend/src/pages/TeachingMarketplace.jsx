import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Award, TrendingUp, Users } from "lucide-react";

export default function TeachingMarketplace() {
  const [teacherMode, setTeacherMode] = useState(false);
  const [teacherContent, setTeacherContent] = useState([]);
  const [topTeachers, setTopTeachers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkTeacherMode();
    fetchTopTeachers();
  }, []);

  const checkTeacherMode = async () => {
    const response = await fetch("/api/teacher/status", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    setTeacherMode(data.teacherMode);
  };

  const unlockTeacherMode = async () => {
    const response = await fetch("/api/teacher/unlock", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (data.success) {
      setTeacherMode(true);
      alert("🎉 Teacher Mode Unlocked!");
    } else {
      alert(data.message);
    }
  };

  const fetchTopTeachers = async () => {
    const response = await fetch("/api/teacher/leaderboard");
    const data = await response.json();
    setTopTeachers(data.teachers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-5xl font-bold text-center mb-8 text-indigo-900"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          🎓 Peer Teaching Marketplace
        </motion.h1>

        {/* Teacher Mode Status */}
        {!teacherMode ? (
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold mb-4">Unlock Teacher Mode</h2>
            <p className="text-gray-600 mb-6">
              Reach Level 5 or achieve 85% accuracy to become a teacher!
            </p>
            <button
              onClick={unlockTeacherMode}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:shadow-lg transition"
            >
              Check Eligibility
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl shadow-xl p-6 mb-8 text-white"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  ✅ Teacher Mode Active!
                </h2>
                <p className="text-white/90">
                  Create lessons and earn coins when students learn from you
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:shadow-lg transition"
              >
                + Create Content
              </button>
            </div>
          </motion.div>
        )}

        {/* Top Teachers Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="text-yellow-500" />
                Top Student Teachers
              </h3>

              <div className="space-y-4">
                {topTeachers.map((teacher, index) => (
                  <motion.div
                    key={teacher._id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:shadow-md transition"
                  >
                    <div className="text-3xl font-bold text-purple-600 w-12">
                      #{index + 1}
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                      {teacher.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{teacher.username}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users size={16} />
                          {teacher.teacherStats.studentsHelped} students
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp size={16} />
                          {teacher.teacherStats.contentCreated} content
                        </span>
                      </div>
                    </div>
                    {teacher.teacherStats.verified && (
                      <div className="text-2xl">✅</div>
                    )}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-600 font-bold">
                        <Star size={20} fill="currentColor" />
                        {teacher.teacherStats.rating.toFixed(1)}
                      </div>
                      <p className="text-sm text-gray-600">
                        💰 {teacher.teacherStats.coinsEarned} coins
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Your Teacher Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Students Helped</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Content Created</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Coins Earned</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating</span>
                  <span className="font-bold">⭐ 0.0</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4">Earning Rules</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>
                    Earn 5 coins per student who completes your content
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Get verified badge at 100+ students</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Bonus 50 coins for 4.5+ rating</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Create Content Modal */}
        {showCreateModal && (
          <CreateContentModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </div>
  );
}

function CreateContentModal({ onClose }) {
  const [contentType, setContentType] = useState("lesson");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState(3);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/teacher/content/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        type: contentType,
        title,
        description,
        difficulty,
        content: {}, // Add content builder logic
      }),
    });

    if (response.ok) {
      alert("✅ Content created successfully!");
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6">Create New Content</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["lesson", "quiz", "story"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setContentType(type)}
                  className={`py-3 rounded-xl font-semibold capitalize ${
                    contentType === type
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
              placeholder="Enter content title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none h-32"
              placeholder="Describe your content..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Difficulty: {difficulty}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition"
            >
              Create Content
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-xl border-2 border-gray-300 font-bold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
