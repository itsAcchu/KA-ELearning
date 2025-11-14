import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Mic, Camera, BookOpen, Trophy } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Home() {
  const features = [
    { icon: Brain, title: 'AI-Powered Learning', description: 'Adaptive lessons that match your pace' },
    { icon: Mic, title: 'Voice Coach', description: 'Perfect your Kannada pronunciation' },
    { icon: Camera, title: 'AR Scanner', description: 'Learn by scanning real objects' },
    { icon: BookOpen, title: 'Interactive Stories', description: 'Immersive cultural narratives' },
    { icon: Trophy, title: 'Gamification', description: 'XP, streaks, and achievements' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-sky/10">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-6 animate-float">🐘</div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-neutral-900 mb-6">
            Learn <span className="gradient-text">Kannada</span> with Fun & AI
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Master Kannada through gamified lessons, AI-powered pronunciation coaching, and interactive stories. Join thousands of learners across Karnataka!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                <Sparkles className="w-5 h-5" />
                Start Learning Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mt-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <feature.icon className="w-10 h-10 text-primary-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-neutral-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
