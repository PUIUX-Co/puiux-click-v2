'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';

export default function ChatFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="border-t bg-gradient-to-r from-purple-50/50 via-background to-blue-50/50 px-4 py-3"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>مدعوم بـ</span>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 font-medium shadow-sm"
        >
          <Image
            src="https://puiux.com/wp-content/uploads/2021/09/Logo-Black-Copress.svg"
            alt="PUIUX Logo"
            width={60}
            height={20}
            className="h-5 w-auto"
          />
          <span className="font-bold text-foreground">Click</span>
        </motion.div>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        >
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        </motion.span>
      </div>

      <div className="mx-auto mt-2 text-center text-xs text-muted-foreground">
        <span>بناء مواقع احترافية في دقائق • مجاني 100%</span>
      </div>
    </motion.div>
  );
}
