'use client';

import { motion } from 'framer-motion';
import { Volume2, User } from 'lucide-react';
import PixiAvatar from '../chat/PixiAvatar';
import type { VoiceMessage as VoiceMessageType } from '@/types/voice';

interface VoiceMessageProps {
  message: VoiceMessageType;
  isLatest?: boolean;
  isSpeaking?: boolean;
}

export default function VoiceMessage({
  message,
  isLatest,
  isSpeaking,
}: VoiceMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        duration: 0.3,
      }}
      className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      role="article"
      aria-label={`${isUser ? 'رسالتك' : 'رسالة بيكسي'}: ${message.transcript}`}
    >
      {/* Avatar */}
      {isUser ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg sm:h-14 sm:w-14"
          aria-hidden="true"
        >
          <User className="h-6 w-6 sm:h-7 sm:w-7" />
        </motion.div>
      ) : (
        <div className="flex-shrink-0">
          <PixiAvatar size="md" animate={isSpeaking || isLatest} />
        </div>
      )}

      {/* Message Bubble */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[80%]`}>
        {/* Name Badge */}
        {!isUser && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2 flex items-center gap-2 px-3"
          >
            <span className="text-base font-bold text-purple-600 sm:text-lg">
              بيكسي
            </span>
            {isSpeaking && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Volume2 className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
              </motion.div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-3xl px-6 py-4 shadow-lg sm:px-8 sm:py-5 ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-gradient-to-br from-white to-purple-50/50 border-2 border-purple-100'
          }`}
        >
          {/* Transcript Text - LARGE for readability */}
          <p className={`text-lg leading-relaxed whitespace-pre-wrap sm:text-xl ${
            isUser ? 'text-primary-foreground' : 'text-foreground'
          }`}>
            {message.transcript}
          </p>

          {/* Confidence indicator for user messages */}
          {isUser && message.confidence && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${message.confidence * 100}%` }}
                  className="h-full bg-white"
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </div>
              <span className="text-xs text-white/80">
                {Math.round(message.confidence * 100)}%
              </span>
            </div>
          )}
        </motion.div>

        {/* Timestamp */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 px-3 text-sm text-muted-foreground sm:text-base"
          aria-label={`وقت الإرسال: ${message.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}`}
        >
          {message.timestamp.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </motion.span>
      </div>
    </motion.div>
  );
}
