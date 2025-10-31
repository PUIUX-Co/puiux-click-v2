'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiEffectProps {
  active: boolean;
  duration?: number;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

const colors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B500', // Orange
  '#FF69B4', // Hot Pink
];

export default function ConfettiEffect({ active, duration = 3000 }: ConfettiEffectProps) {
  const [confettiPieces, setConfettiPieces] = useState<Confetti[]>([]);

  useEffect(() => {
    if (active) {
      // Generate 50 confetti pieces
      const pieces: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // 0-100%
        y: -10, // Start above viewport
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4, // 4-12px
        delay: Math.random() * 0.5, // 0-0.5s delay
      }));

      setConfettiPieces(pieces);

      // Clear after duration
      const timer = setTimeout(() => {
        setConfettiPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [active, duration]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute"
            initial={{
              x: `${piece.x}vw`,
              y: `${piece.y}vh`,
              rotate: piece.rotation,
              opacity: 1,
            }}
            animate={{
              y: '120vh', // Fall below viewport
              rotate: piece.rotation + 720, // 2 full rotations
              opacity: 0,
            }}
            transition={{
              duration: 2.5 + Math.random() * 1.5, // 2.5-4s
              delay: piece.delay,
              ease: 'easeIn',
            }}
            exit={{ opacity: 0 }}
          >
            <div
              className="rounded-sm"
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                boxShadow: `0 0 ${piece.size}px ${piece.color}`,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
