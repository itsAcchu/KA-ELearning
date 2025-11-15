import { Link } from 'react-router-dom';
import { Flame, Gem, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';

export default function Header() {
  const { user } = useAuthStore();
  const { xp, level, streak, gems } = useUserStore();
  
  const xpForNextLevel = level * 500;
  const xpProgress = ((xp % 500) / 500) * 100;
  
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🐘</span>
            <span className="font-display font-bold text-xl text-primary-600">NAMMA AI</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
              <Flame className="w-4 h-4" />
              {streak}
            </div>
            
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
              <Gem className="w-4 h-4" />
              {gems}
            </div>
            
            <div className="hidden md:block w-32">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">Lvl {level}</span>
                <span className="text-neutral-500">{xp % 500}/500</span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  style={{ width: `${xpProgress}%` }}
                  className="h-full bg-gradient-to-r from-success to-primary-500"
                />
              </div>
            </div>
            
            <Link to="/profile" className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-xl">
              {user?.avatar || '🐘'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
