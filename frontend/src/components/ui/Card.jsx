import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, onClick }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, shadow: '0 20px 25px -5px rgba(0,0,0,0.1)' } : {}}
      className={`bg-white rounded-3xl shadow-md p-6 border border-neutral-100 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
