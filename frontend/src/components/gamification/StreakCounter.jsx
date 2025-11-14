import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useUserStore from '../../store/userStore';

const StreakCounter = ({ compact = false }) => {
  const { streak, updateStreak } = useUserStore();

  useEffect(() => {
    // Update streak when component mounts
    updateStreak();
  }, []);

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'from-purple-500 to-pink-500';
    if (streak >= 14) return 'from-orange-500 to-red-500';
    if (streak >= 7) return 'from-yellow-500 to-orange-500';
    return 'from-orange-400 to-red-400';
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥💜';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    return '🔥';
  };

  if (compact) {
    return (
      <motion.div
        className={`flex items-center gap-2 bg-gradient-to-r ${getStreakColor(streak)} text-white px-4 py-2 rounded-full shadow-lg`}
        whileHover={{ scale: 1.05 }}
        animate={streak > 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3, repeat: streak > 0 ? Infinity : 0, repeatDelay: 3 }}
      >
        <span className="text-xl">{getStreakEmoji(streak)}</span>
        <span className="font-bold">{streak}</span>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-100">
      <div className="text-center">
        <motion.div
          className="text-6xl mb-2"
          animate={streak > 0 ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          {getStreakEmoji(streak)}
        </motion.div>
        
        <div className="mb-3">
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
            {streak}
          </p>
          <p className="text-sm text-neutral-600 font-medium">
            Day Streak
          </p>
        </div>

        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getStreakColor(streak)} text-white text-xs font-bold`}
          >
            {streak >= 30 && '🏆 Legendary Streak!'}
            {streak >= 14 && streak < 30 && '💪 Amazing Streak!'}
            {streak >= 7 && streak < 14 && '✨ Great Streak!'}
            {streak > 0 && streak < 7 && '🎯 Keep Going!'}
          </motion.div>
        )}

        {streak === 0 && (
          <p className="text-xs text-neutral-500 mt-2">
            Complete a lesson today to start your streak!
          </p>
        )}
      </div>
    </div>
  );
};

export default StreakCounter;
