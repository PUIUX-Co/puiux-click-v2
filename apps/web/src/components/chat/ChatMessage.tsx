'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import PixiAvatar from './PixiAvatar';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
}

export default function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  // System messages (centered, subtle)
  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center my-6"
      >
        <div className="rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground">
          {message.content}
        </div>
      </motion.div>
    );
  }

  // User & AI messages
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
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      role="article"
      aria-label={`${isUser ? 'رسالتك' : 'رسالة المساعد'}: ${message.content}`}
    >
      {/* Avatar */}
      {isUser ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
          aria-hidden="true"
        >
          <User className="h-4 w-4" />
        </motion.div>
      ) : (
        <div className="flex-shrink-0">
          <PixiAvatar size="sm" animate={isLatest} />
        </div>
      )}

      {/* Message Bubble */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
        {/* AI Name Badge */}
        {!isUser && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-1 px-2 text-xs font-semibold text-purple-600"
          >
            بيكسي ✨
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-gradient-to-br from-white to-purple-50/30 border border-purple-100 rounded-bl-sm'
          }`}
        >
          <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
            isUser ? 'text-primary-foreground' : 'text-foreground'
          }`}>
            {message.content}
          </p>
        </motion.div>

        {/* Timestamp */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-1 px-2 text-xs text-muted-foreground"
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
