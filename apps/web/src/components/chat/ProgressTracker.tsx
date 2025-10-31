'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ConversationStep } from '@/types/chat';

interface ProgressTrackerProps {
  currentStep: ConversationStep;
}

const steps = [
  { id: 'welcome', label: 'الترحيب', icon: '👋' },
  { id: 'industry', label: 'نوع النشاط', icon: '🎯' },
  { id: 'businessName', label: 'الاسم', icon: '✍️' },
  { id: 'description', label: 'الوصف', icon: '📝' },
  { id: 'contact', label: 'التواصل', icon: '📞' },
  { id: 'colors', label: 'الألوان', icon: '🎨' },
  { id: 'generating', label: 'الإنشاء', icon: '🚀' },
];

export default function ProgressTracker({ currentStep }: ProgressTrackerProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = currentStep === 'complete' ? 100 : ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-blue-500 to-purple-600 shadow-lg shadow-primary/30"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-2"
            >
              {/* Step Circle */}
              <motion.div
                animate={{
                  scale: isCurrent ? [1, 1.1, 1] : 1,
                  backgroundColor: isCompleted
                    ? 'hsl(var(--primary))'
                    : isCurrent
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--muted))',
                }}
                transition={{
                  scale: {
                    duration: 0.5,
                    repeat: isCurrent ? Infinity : 0,
                    repeatType: 'reverse',
                  },
                }}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full shadow-md ${
                  isCompleted || isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}

                {/* Pulse Effect for Current */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                )}
              </motion.div>

              {/* Step Label */}
              <motion.span
                animate={{
                  color: isCompleted || isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  fontWeight: isCurrent ? 600 : 400,
                }}
                className="text-xs text-center hidden sm:block"
              >
                {step.label}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-muted-foreground"
      >
        <span className="font-semibold text-primary">{Math.round(progress)}%</span> مكتمل
      </motion.div>
    </div>
  );
}
