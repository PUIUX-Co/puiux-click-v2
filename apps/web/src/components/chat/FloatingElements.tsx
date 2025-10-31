'use client';

import { motion } from 'framer-motion';

export default function FloatingElements() {
  const elements = [
    { icon: '✨', delay: 0, duration: 20, x: '10%', size: '2rem' },
    { icon: '💫', delay: 2, duration: 25, x: '80%', size: '1.5rem' },
    { icon: '⭐', delay: 4, duration: 22, x: '30%', size: '1.8rem' },
    { icon: '🌟', delay: 6, duration: 28, x: '70%', size: '1.6rem' },
    { icon: '✨', delay: 8, duration: 24, x: '50%', size: '1.4rem' },
    { icon: '💎', delay: 10, duration: 26, x: '90%', size: '1.7rem' },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: element.x,
            fontSize: element.size,
          }}
          initial={{ y: '100vh', opacity: 0, rotate: 0 }}
          animate={{
            y: '-20vh',
            opacity: [0, 0.6, 0.8, 0.6, 0],
            rotate: 360,
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      {/* Gradient Orbs */}
      <motion.div
        className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
