import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, CheckCircle2, Circle, Star, Trophy } from "lucide-react";
import { useUserStore } from "../store/userStore";

export default function Learn() {
  const { lessonsCompleted, addXP } = useUserStore();
  const [units, setUnits] = useState([]);

  // Define all units and lessons
  const allUnits = [
    {
      id: 1,
      title: "[translate:Unit 1: Basics (ಮೂಲಭೂತ)]",
      lessons: [
        { id: 1, title: "Greetings", icon: "👋", xp: 50 },
        { id: 2, title: "Numbers", icon: "🔢", xp: 50 },
        { id: 3, title: "Colors", icon: "🎨", xp: 50 },
        { id: 4, title: "Family", icon: "👨‍👩‍👧‍👦", xp: 50 },
        { id: 5, title: "Food", icon: "🍛", xp: 50 },
      ],
    },
    {
      id: 2,
      title: "[translate:Unit 2: Conversations (ಸಂವಾದ)]",
      lessons: [
        { id: 6, title: "Shopping", icon: "🛒", xp: 75 },
        { id: 7, title: "Directions", icon: "🗺️", xp: 75 },
        { id: 8, title: "Restaurant", icon: "🍽️", xp: 75 },
        { id: 9, title: "Weather", icon: "⛅", xp: 75 },
        { id: 10, title: "Health", icon: "🏥", xp: 75 },
      ],
    },
    {
      id: 3,
      title: "[translate:Unit 3: Advanced (ಮುಂದುವರಿದ)]",
      lessons: [
        { id: 11, title: "Business", icon: "💼", xp: 100 },
        { id: 12, title: "Travel", icon: "✈️", xp: 100 },
        { id: 13, title: "Culture", icon: "🎭", xp: 100 },
        { id: 14, title: "Literature", icon: "📚", xp: 100 },
        { id: 15, title: "Technology", icon: "💻", xp: 100 },
      ],
    },
  ];

  // Calculate lesson status based on lessonsCompleted
  useEffect(() => {
    const updatedUnits = allUnits.map((unit) => ({
      ...unit,
      lessons: unit.lessons.map((lesson, index) => {
        const isCompleted = lessonsCompleted >= lesson.id;
        const isUnlocked = lessonsCompleted >= lesson.id - 1;

        return {
          ...lesson,
          completed: isCompleted,
          unlocked: isUnlocked,
        };
      }),
    }));

    setUnits(updatedUnits);
  }, [lessonsCompleted]);

  const getLessonIcon = (lesson) => {
    if (lesson.completed) {
      return <CheckCircle2 className="w-12 h-12 text-white" />;
    } else if (lesson.unlocked) {
      return <Circle className="w-12 h-12 text-white" />;
    } else {
      return <Lock className="w-12 h-12 text-gray-400" />;
    }
  };

  const getLessonBgColor = (lesson) => {
    if (lesson.completed) {
      return "bg-gradient-to-br from-teal-500 to-teal-600";
    } else if (lesson.unlocked) {
      return "bg-gradient-to-br from-teal-400 to-teal-500";
    } else {
      return "bg-gray-300";
    }
  };

  const handleLessonComplete = (lessonId, xp) => {
    addXP(xp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            📚 Learn Kannada
          </h1>
          <p className="text-gray-600 text-lg">
            Complete lessons to unlock new content
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="font-bold text-gray-800">Your Progress</h3>
                <p className="text-sm text-gray-600">
                  {lessonsCompleted} / 15 lessons completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-teal-600">
                {Math.floor((lessonsCompleted / 15) * 100)}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(lessonsCompleted / 15) * 100}%` }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full"
            />
          </div>
        </motion.div>

        {/* Units */}
        {units.map((unit, unitIndex) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: unitIndex * 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Unit Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
                <h2 className="text-3xl font-bold text-white">{unit.title}</h2>
              </div>

              {/* Lessons */}
              <div className="p-6">
                <div className="space-y-4">
                  {unit.lessons.map((lesson, lessonIndex) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: unitIndex * 0.2 + lessonIndex * 0.1,
                      }}
                    >
                      {lesson.unlocked ? (
                        <Link
                          to={`/lesson/${lesson.id}`}
                          onClick={() => {
                            if (!lesson.completed) {
                              handleLessonComplete(lesson.id, lesson.xp);
                            }
                          }}
                          className="block"
                        >
                          <div
                            className={`${getLessonBgColor(
                              lesson
                            )} rounded-2xl p-6 transition-all transform hover:scale-105 hover:shadow-2xl cursor-pointer`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-5xl">{lesson.icon}</div>
                                <div className="text-white">
                                  <h3 className="text-2xl font-bold mb-1">
                                    {lesson.title}
                                  </h3>
                                  <p className="text-sm opacity-90">
                                    {lesson.completed
                                      ? "Completed ✓"
                                      : "Available now"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {lesson.completed && (
                                  <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                                )}
                                {getLessonIcon(lesson)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div
                          className={`${getLessonBgColor(
                            lesson
                          )} rounded-2xl p-6 opacity-60 cursor-not-allowed`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-5xl opacity-50">
                                {lesson.icon}
                              </div>
                              <div className="text-white">
                                <h3 className="text-2xl font-bold mb-1">
                                  {lesson.title}
                                </h3>
                                <p className="text-sm opacity-90">
                                  🔒 Complete previous lessons to unlock
                                </p>
                              </div>
                            </div>
                            {getLessonIcon(lesson)}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-purple-600 mb-2">
            🚀 More Units Coming Soon!
          </h3>
          <p className="text-gray-700">
            Keep learning to unlock advanced lessons and features
          </p>
        </motion.div>
      </div>
    </div>
  );
}
