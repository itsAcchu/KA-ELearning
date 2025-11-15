import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, User, Mail, Award, Calendar } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { xp, level, streak, gems, lessonsCompleted } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-lg border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-teal-600" />
            <span className="font-semibold text-gray-700">
              Back to Dashboard
            </span>
          </motion.button>
        </Link>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 mb-6"
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
            >
              <User className="w-16 h-16 text-white" />
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold gradient-text-premium mb-2">
                {user?.name || "Kannada Learner"}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-2">
                <Mail className="w-4 h-4" />
                <span>{user?.email || "learner@kannada.app"}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Joined November 2025</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-4 text-center border border-teal-100"
            >
              <div className="text-3xl font-bold text-teal-600 mb-1">
                {level}
              </div>
              <div className="text-sm text-gray-600">Level</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center border border-purple-100"
            >
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {xp}
              </div>
              <div className="text-sm text-gray-600">Total XP</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 text-center border border-orange-100"
            >
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {streak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-100"
            >
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {gems}
              </div>
              <div className="text-sm text-gray-600">Gems</div>
            </motion.div>
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
              <div className="flex items-center gap-3">
                <div className="text-5xl">🏆</div>
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {lessonsCompleted} Lessons Completed
                  </p>
                  <p className="text-gray-600">
                    Keep learning to unlock more achievements!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-4xl mb-3">🌟</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            You're doing amazing!
          </h3>
          <p className="text-gray-600">
            Continue your journey to master Kannada. Every lesson brings you
            closer to fluency!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
