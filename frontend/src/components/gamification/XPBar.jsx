import React from 'react';
import { motion } from 'framer-motion';
import useUserStore from '../../store/userStore';
import { XP_PER_LEVEL } from '../../utils/constants';

const XPBar = ({ compact = false }) => {
  const { xp, level } = useUserStore();
  const xpForNextLevel = level * XP_PER_LEVEL;
  const progress = (xp / xpForNextLevel) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-4 py-2 rounded-full shadow-lg">
        <span className="text-2xl">⚡</span>
        <div className="flex flex-col">
          <span className="text-xs font-medium opacity-90">Level {level}</span>
          <span className="text-sm font-bold">{xp} XP</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-neutral-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white font-bold text-lg">{level}</span>
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium">Level {level}</p>
            <p className="text-sm font-bold text-neutral-800">
              {xp} / {xpForNextLevel} XP
            </p>
          </div>
        </div>
        <span className="text-2xl">⚡</span>
      </div>

      <div className="relative h-3 bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-success to-primary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-neutral-500">
          {xpForNextLevel - xp} XP until Level {level + 1}
        </p>
      </div>
    </div>
  );
};

export default XPBar;
