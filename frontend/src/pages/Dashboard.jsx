import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, Target, BookOpen, Mic, MessageCircle, Camera, Book } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { xp, level, streak, gems, lessonsCompleted, dailyXP } = useUserStore();
  
  const dailyGoal = 50;
  const dailyProgress = Math.min((dailyXP / dailyGoal) * 100, 100);
  
  const quickActions = [
    { icon: BookOpen, label: 'Continue Learning', to: '/learn', color: 'from-primary-500 to-primary-600' },
    { icon: Mic, label: 'Voice Coach', to: '/voice-coach', color: 'from-accent-purple to-accent-pink' },
    { icon: MessageCircle, label: 'AI Chat', to: '/chatbot', color: 'from-accent-sky to-primary-500' },
    { icon: Camera, label: 'AR Scanner', to: '/ar-scanner', color: 'from-success to-primary-500' },
    { icon: Book, label: 'Stories', to: '/stories', color: 'from-secondary-500 to-secondary-600' },
  ];
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-accent-purple rounded-4xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-4xl mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Ready to continue your Kannada journey?
            </p>
          </div>
          <div className="text-6xl animate-float">{user?.avatar || '🐘'}</div>
        </div>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-1">{xp}</div>
            <div className="text-sm text-neutral-600">Total XP</div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100">
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-600 mb-1">{level}</div>
            <div className="text-sm text-neutral-600">Level</div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-1">{streak}</div>
            <div className="text-sm text-neutral-600">Day Streak 🔥</div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-1">{gems}</div>
            <div className="text-sm text-neutral-600">Gems 💎</div>
          </div>
        </Card>
      </div>
      
      {/* Daily Goal */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <Target className="w-8 h-8 text-primary-500" />
          <div className="flex-1">
            <h3 className="font-bold text-lg">Daily Goal</h3>
            <p className="text-sm text-neutral-600">{dailyXP} / {dailyGoal} XP</p>
          </div>
          <div className="text-2xl">{dailyProgress >= 100 ? '✅' : '⏳'}</div>
        </div>
        <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${dailyProgress}%` }}
            className="h-full bg-gradient-to-r from-success to-primary-500"
          />
        </div>
      </Card>
      
      {/* Quick Actions */}
      <div>
        <h2 className="font-display font-bold text-2xl mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.to}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white text-center shadow-lg hover:shadow-xl transition-all cursor-pointer`}
              >
                <action.icon className="w-10 h-10 mx-auto mb-3" />
                <p className="font-semibold text-sm">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Progress */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <TrendingUp className="w-8 h-8 text-success" />
          <div>
            <h3 className="font-bold text-lg">Your Progress</h3>
            <p className="text-sm text-neutral-600">Keep up the great work!</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-neutral-700">Lessons Completed</span>
            <span className="font-bold text-primary-600">{lessonsCompleted}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-700">Current Streak</span>
            <span className="font-bold text-orange-600">{streak} days 🔥</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-700">Total XP Earned</span>
            <span className="font-bold text-success">{xp} XP</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
