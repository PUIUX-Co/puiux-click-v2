'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  suggestions?: string[];
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  suggestions = [],
  placeholder = 'اكتب رسالتك...',
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSend(suggestion);
  };

  return (
    <div className="space-y-3">
      {/* Suggestions */}
      <AnimatePresence mode="wait">
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="اقتراحات سريعة"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={disabled}
                className="group flex items-center gap-1.5 rounded-full border-2 border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                role="button"
                aria-label={`اختيار: ${suggestion}`}
              >
                <Sparkles className="h-3.5 w-3.5 opacity-75 transition-transform group-hover:scale-125 group-hover:rotate-12" aria-hidden="true" />
                <span>{suggestion}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 2px hsl(var(--primary))'
              : '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
          transition={{ duration: 0.2 }}
          className="flex items-end gap-2 rounded-2xl border bg-background p-2 transition-shadow"
        >
          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              maxHeight: '150px',
              minHeight: '40px',
            }}
            aria-label="اكتب رسالتك"
            aria-describedby={suggestions.length > 0 ? 'suggestions-hint' : undefined}
          />

          {/* Send Button */}
          <motion.button
            type="submit"
            disabled={!message.trim() || disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="إرسال الرسالة"
          >
            <Send className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        </motion.div>

        {/* Hint */}
        {suggestions.length > 0 && (
          <p id="suggestions-hint" className="mt-2 px-2 text-xs text-muted-foreground">
            💡 اختر اقتراحاً سريعاً أو اكتب إجابتك الخاصة
          </p>
        )}

        {/* Keyboard Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0 }}
          className="mt-2 px-2 text-xs text-muted-foreground"
        >
          اضغط <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Enter</kbd>{' '}
          للإرسال •{' '}
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Shift + Enter</kbd>{' '}
          لسطر جديد
        </motion.p>
      </form>
    </div>
  );
}
