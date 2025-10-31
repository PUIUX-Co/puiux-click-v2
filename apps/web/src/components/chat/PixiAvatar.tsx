'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface PixiAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export default function PixiAvatar({ size = 'md', animate = true, className = '' }: PixiAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
  };

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-blue-600 to-primary shadow-lg ${sizeClasses[size]} ${className}`}
      animate={
        animate
          ? {
              boxShadow: [
                '0 4px 20px rgba(147, 51, 234, 0.3)',
                '0 4px 30px rgba(59, 130, 246, 0.5)',
                '0 4px 20px rgba(147, 51, 234, 0.3)',
              ],
            }
          : {}
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Sparkles Icon for Pixi */}
      <Sparkles className={`${iconSizes[size]} text-white`} />

      {/* Pulse effect */}
      {animate && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-600"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}

      {/* Inner glow */}
      <div className="absolute inset-0 rounded-full bg-white opacity-20" />
    </motion.div>
  );
}
