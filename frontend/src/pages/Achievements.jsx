import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Achievements() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Button>
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-6">🚧</div>
        <h1 className="font-display font-bold text-4xl mb-4">Achievements</h1>
        <p className="text-neutral-600 text-lg mb-8">
          This feature is coming soon! We're building something amazing.
        </p>
        <Link to="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </motion.div>
    </div>
  );
}
