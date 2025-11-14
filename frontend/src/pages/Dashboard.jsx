import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Target,
  BookOpen,
  Mic,
  MessageCircle,
  Camera,
  Book,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { xp, level, streak, gems, lessonsCompleted, dailyXP, fetchUserData } =
    useUserStore();
  const navigate = useNavigate();
  const [continueData, setContinueData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchUserData();
    fetchContinueData();
  }, [fetchUserData]);

  const fetchContinueData = async () => {
    try {
      const token = localStorage.getItem("kannada_auth_token");
      const response = await fetch(`${API_BASE_URL}/progress/continue`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContinueData(data);
      }
    } catch (error) {
      console.error("Failed to fetch continue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const dailyGoal = 50;
  const dailyProgress = Math.min((dailyXP / dailyGoal) * 100, 100);

  const handleContinueLearning = () => {
    if (continueData?.currentLesson) {
      navigate(`/lesson/${continueData.currentLesson._id}`);
    } else {
      navigate("/learn");
    }
  };

  const quickActions = [
    {
      icon: BookOpen,
      label: "Continue Learning",
      onClick: handleContinueLearning,
      color: "from-primary-500 to-primary-600",
      badge: continueData?.progressPercentage
        ? `${continueData.progressPercentage}%`
        : null,
    },
    {
      icon: Mic,
      label: "Voice Coach",
      to: "/voice-coach",
      color: "from-accent-purple to-accent-pink",
    },
    {
      icon: MessageCircle,
      label: "AI Chat",
      to: "/chatbot",
      color: "from-accent-sky to-primary-500",
    },
    {
      icon: Camera,
      label: "AR Scanner",
      to: "/ar-scanner",
      color: "from-success to-primary-500",
    },
    {
      icon: Book,
      label: "Stories",
      to: "/stories",
      color: "from-secondary-500 to-secondary-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-purple bg-clip-text text-transparent mb-2">
          ನಮಸ್ಕಾರ, {user?.name || "Learner"}! 👋
        </h1>
        <p className="text-gray-600">Ready to continue your Kannada journey?</p>
      </motion.div>

      {/* Continue Learning Card */}
      {!loading && continueData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm opacity-90">
                    Last accessed:{" "}
                    {continueData.lastAccessed
                      ? new Date(continueData.lastAccessed).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {continueData.currentLesson?.title || "Start Learning"}
                </h3>
                <p className="opacity-90 mb-4">
                  {continueData.message ||
                    continueData.currentLesson?.description ||
                    "Begin your Kannada learning journey!"}
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="font-bold text-lg">
                      {continueData.progressPercentage}%
                    </span>
                    <span className="opacity-90"> Complete</span>
                  </div>
                  {continueData.currentUnit && (
                    <div className="text-sm">
                      <span className="font-bold">
                        Unit {continueData.currentUnit}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleContinueLearning}
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Continue →
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600">{xp}</div>
          <div className="text-sm text-gray-600">Total XP</div>
        </Card>

        <Card className="text-center">
          <div className="text-2xl font-bold text-secondary-600">{level}</div>
          <div className="text-sm text-gray-600">Level</div>
        </Card>

        <Card className="text-center">
          <div className="text-2xl font-bold text-accent-orange">
            {streak}🔥
          </div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </Card>

        <Card className="text-center">
          <div className="text-2xl font-bold text-success">{gems}💎</div>
          <div className="text-sm text-gray-600">Gems</div>
        </Card>
      </div>

      {/* Daily Goal */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-primary-600" />
            <div>
              <h3 className="font-semibold">Daily Goal</h3>
              <p className="text-sm text-gray-600">
                {dailyXP} / {dailyGoal} XP
              </p>
            </div>
          </div>
          <span className="text-lg font-bold text-primary-600">
            {Math.round(dailyProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${dailyProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full"
          />
        </div>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickActions.map((action, index) =>
            action.to ? (
              <Link key={index} to={action.to}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-6 rounded-xl bg-gradient-to-br ${action.color} text-white text-center cursor-pointer shadow-lg`}
                >
                  {action.badge && (
                    <div className="absolute top-2 right-2 bg-white text-primary-600 text-xs font-bold px-2 py-1 rounded-full">
                      {action.badge}
                    </div>
                  )}
                  <action.icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">{action.label}</p>
                </motion.div>
              </Link>
            ) : (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`relative p-6 rounded-xl bg-gradient-to-br ${action.color} text-white text-center cursor-pointer shadow-lg`}
              >
                {action.badge && (
                  <div className="absolute top-2 right-2 bg-white text-primary-600 text-xs font-bold px-2 py-1 rounded-full">
                    {action.badge}
                  </div>
                )}
                <action.icon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">{action.label}</p>
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* Motivational Banner */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <div className="flex items-center gap-4">
          <TrendingUp className="w-12 h-12 text-primary-600" />
          <div>
            <h3 className="font-bold text-lg text-primary-900">
              Keep up the great work!
            </h3>
            <p className="text-primary-700">
              You've completed {lessonsCompleted} lessons. Continue learning to
              unlock more achievements!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
