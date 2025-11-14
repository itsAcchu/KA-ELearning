import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const ProgressBar = ({
  value,
  max = 100,
  showLabel = true,
  label,
  variant = 'primary',
  size = 'md',
  className,
  animated = true,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };

  const variants = {
    primary: 'from-success to-primary-500',
    secondary: 'from-secondary-400 to-secondary-600',
    success: 'from-success to-success-dark',
    danger: 'from-error to-error-dark',
    rainbow: 'from-accent-purple via-accent-pink to-secondary-500',
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-bold text-primary-600">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={clsx('bg-neutral-200 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          className={clsx(
            'h-full rounded-full bg-gradient-to-r',
            variants[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.5, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
