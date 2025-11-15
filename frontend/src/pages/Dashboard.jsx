import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Target,
  BookOpen,
  Mic,
  MessageCircle,
  Camera,
  Book,
  Flame,
  Gem,
  Award,
  Star,
  Zap,
  Trophy,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/Kannada Learning App Logo.png";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { xp, level, streak, gems, lessonsCompleted, dailyXP, updateStreak } =
    useUserStore();

  // Update streak on component mount
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const dailyGoal = 50;
  const dailyProgress = Math.min((dailyXP / dailyGoal) * 100, 100);

  const quickActions = [
    {
      icon: BookOpen,
      label: "Continue Learning",
      to: "/learn",
      color: "from-teal-500 to-teal-600",
      description: "Resume your lessons",
      gradient: "from-teal-400 via-teal-500 to-cyan-600",
    },
    {
      icon: Mic,
      label: "Voice Coach",
      to: "http://127.0.0.1:5500/frontend/src/pages/Voice.html",
      color: "from-purple-500 to-pink-500",
      description: "Practice pronunciation",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
    },
    {
      icon: MessageCircle,
      label: "AI Chat",
      to: "/chatbot",
      color: "from-sky-500 to-blue-500",
      description: "Chat with AI tutor",
      gradient: "from-sky-400 via-blue-500 to-indigo-600",
    },
    {
      icon: Camera,
      label: "AR Scanner",
      to: "/ar-scanner",
      color: "from-green-500 to-emerald-500",
      description: "Scan & learn objects",
      gradient: "from-green-400 via-emerald-500 to-teal-600",
    },
    {
      icon: Book,
      label: "Stories",
      to: "/stories",
      color: "from-orange-500 to-red-500",
      description: "Read interactive stories",
      gradient: "from-orange-400 via-red-500 to-pink-600",
    },
  ];

  const achievements = [
    {
      icon: Trophy,
      label: "Lessons",
      value: lessonsCompleted,
      color: "text-yellow-500",
    },
    { icon: Award, label: "Level", value: level, color: "text-purple-500" },
    {
      icon: Star,
      label: "Streak",
      value: `${streak} days`,
      color: "text-orange-500",
    },
    { icon: Zap, label: "Total XP", value: xp, color: "text-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-teal-200/20 to-purple-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-200/20 to-pink-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header Section with Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={logo}
                alt="Kannada Quest Logo"
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-2xl ring-4 ring-white"
              />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-black bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
              >
                ನಮಸ್ಕಾರ, {user?.name || "Demo User"}! 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-base md:text-xl font-medium flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Ready to continue your Kannada journey?
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Daily Goal Progress - Featured Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-3xl blur opacity-20"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-2xl blur opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-teal-500 to-blue-600 p-4 rounded-2xl">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    Daily Goal
                    <Flame className="w-6 h-6 text-orange-500" />
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {dailyXP} / {dailyGoal} XP
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl md:text-5xl font-black bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
                >
                  {Math.floor(dailyProgress)}%
                </motion.div>
              </div>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dailyProgress}%` }}
                transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
                className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 h-6 rounded-full relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
            {dailyProgress >= 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 text-center"
              >
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                  <Trophy className="w-5 h-5" />
                  Goal Completed! Amazing! 🎉
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total XP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-5 md:p-6 border border-teal-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-xs md:text-sm font-semibold">
                  Total XP
                </span>
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
              </div>
              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {xp}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-teal-600 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>Keep earning!</span>
              </div>
            </div>
          </motion.div>

          {/* Level */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-5 md:p-6 border border-purple-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-xs md:text-sm font-semibold">
                  Level
                </span>
                <Target className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {level}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-purple-600 font-medium">
                <Award className="w-3 h-3" />
                <span>Level up!</span>
              </div>
            </div>
          </motion.div>

          {/* Day Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-5 md:p-6 border border-orange-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-xs md:text-sm font-semibold">
                  Day Streak
                </span>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                </motion.div>
              </div>
              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {streak} 🔥
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 font-medium">
                <Flame className="w-3 h-3" />
                <span>Don't break it!</span>
              </div>
            </div>
          </motion.div>

          {/* Gems */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-5 md:p-6 border border-blue-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-xs md:text-sm font-semibold">
                  Gems
                </span>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Gem className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </motion.div>
              </div>
              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {gems} 💎
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 font-medium">
                <Sparkles className="w-3 h-3" />
                <span>Collect more!</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions - Premium Cards */}
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="text-2xl md:text-3xl font-black text-gray-800 mb-6 flex items-center gap-3"
          >
            <Zap className="w-8 h-8 text-yellow-500" />
            Quick Actions
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={action.to} className="block relative group h-full">
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}
                  ></div>

                  {/* Card */}
                  <div
                    className={`relative bg-gradient-to-br ${action.gradient} rounded-3xl p-6 md:p-8 text-white shadow-2xl h-full flex flex-col items-center justify-center text-center overflow-hidden border border-white/20`}
                  >
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    </div>

                    {/* Icon with Animation */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      className="relative mb-4"
                    >
                      <div className="absolute inset-0 bg-white/30 rounded-2xl blur"></div>
                      <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                        <action.icon className="w-10 h-10 md:w-12 md:h-12" />
                      </div>
                    </motion.div>

                    {/* Text Content */}
                    <div className="relative">
                      <span className="font-black text-base md:text-lg mb-2 block">
                        {action.label}
                      </span>
                      <span className="text-xs md:text-sm text-white/80 font-medium">
                        {action.description}
                      </span>
                    </div>

                    {/* Arrow Icon */}
                    <motion.div
                      className="absolute bottom-3 right-3"
                      whileHover={{ x: 5 }}
                    >
                      <ChevronRight className="w-5 h-5 text-white/60" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Your Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-gray-100"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                >
                  <achievement.icon
                    className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 ${achievement.color}`}
                  />
                </motion.div>
                <p className="text-2xl md:text-3xl font-black text-gray-800 mb-1">
                  {achievement.value}
                </p>
                <p className="text-sm text-gray-600 font-semibold">
                  {achievement.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Encouragement Section - Premium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl blur opacity-20"></div>
          <div className="relative bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-white/50">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-300/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-300/30 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Trophy className="w-16 h-16 text-yellow-500" />
            </motion.div>

            <h3 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Keep up the amazing work! 🎉
            </h3>
            <p className="text-gray-700 text-base md:text-xl font-medium max-w-2xl mx-auto">
              You've completed{" "}
              <span className="font-black text-purple-600">
                {lessonsCompleted}
              </span>{" "}
              lessons. Keep learning to unlock more achievements and become a
              Kannada master! 🌟
            </p>

            <motion.div
              className="mt-6 flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <Star
                    className={`w-6 h-6 ${
                      i < Math.min(level, 5)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
