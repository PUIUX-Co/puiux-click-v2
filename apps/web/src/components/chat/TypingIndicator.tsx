'use client';

import { motion } from 'framer-motion';
import PixiAvatar from './PixiAvatar';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-3 mb-4"
      role="status"
      aria-live="polite"
      aria-label="بيكسي يكتب..."
    >
      {/* Pixi Avatar */}
      <div className="flex-shrink-0">
        <PixiAvatar size="sm" animate />
      </div>

      {/* Typing Bubble */}
      <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%]">
        {/* Pixi Name */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-1 px-2 text-xs font-semibold text-purple-600"
        >
          بيكسي ✨
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-gradient-to-br from-white to-purple-50/30 border border-purple-100 px-4 py-3 shadow-sm"
        >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-purple-400"
            animate={{
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">بيكسي يكتب الآن...</span>
      </motion.div>
      </div>
    </motion.div>
  );
}
