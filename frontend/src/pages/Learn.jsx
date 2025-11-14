import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle2, Circle } from 'lucide-react';
import Card from '../components/ui/Card';

export default function Learn() {
  const units = [
    {
      id: 1,
      title: 'Unit 1: Basics (ಮೂಲಭೂತ)',
      lessons: [
        { id: 1, title: 'Greetings', completed: true },
        { id: 2, title: 'Numbers', completed: true },
        { id: 3, title: 'Colors', completed: false, unlocked: true },
        { id: 4, title: 'Family', completed: false, unlocked: false },
        { id: 5, title: 'Food', completed: false, unlocked: false },
      ],
    },
    {
      id: 2,
      title: 'Unit 2: Conversations (ಸಂವಾದ)',
      lessons: [
        { id: 6, title: 'Shopping', completed: false, unlocked: false },
        { id: 7, title: 'Directions', completed: false, unlocked: false },
        { id: 8, title: 'Restaurant', completed: false, unlocked: false },
      ],
    },
  ];
  
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-4xl mb-2">Learning Path</h1>
        <p className="text-neutral-600">Complete lessons to unlock new content</p>
      </motion.div>
      
      {units.map((unit, unitIndex) => (
        <motion.div
          key={unit.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: unitIndex * 0.1 }}
        >
          <h2 className="font-display font-bold text-2xl mb-6 text-primary-600">{unit.title}</h2>
          <div className="space-y-4">
            {unit.lessons.map((lesson, lessonIndex) => {
              const isLocked = !lesson.unlocked && !lesson.completed;
              return (
                <Card
                  key={lesson.id}
                  className={`${
                    isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'
                  } ${lesson.completed ? 'bg-gradient-to-br from-success/10 to-primary-50' : ''}`}
                >
                  <Link
                    to={isLocked ? '#' : `/lesson/${lesson.id}`}
                    className="flex items-center gap-4"
                    onClick={(e) => isLocked && e.preventDefault()}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      lesson.completed ? 'bg-success text-white' :
                      lesson.unlocked ? 'bg-primary-500 text-white' :
                      'bg-neutral-200 text-neutral-400'
                    }`}>
                      {lesson.completed ? <CheckCircle2 className="w-8 h-8" /> :
                       isLocked ? <Lock className="w-8 h-8" /> :
                       <Circle className="w-8 h-8" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{lesson.title}</h3>
                      <p className="text-sm text-neutral-600">
                        {lesson.completed ? 'Completed ✓' :
                         lesson.unlocked ? 'Available now' :
                         'Complete previous lessons to unlock'}
                      </p>
                    </div>
                    <div className="text-2xl">
                      {lesson.completed ? '⭐' : lesson.unlocked ? '📚' : '🔒'}
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
