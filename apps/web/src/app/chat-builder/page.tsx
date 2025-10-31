'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, ArrowRight, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function ChatBuilderPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-background to-blue-50 p-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-2xl shadow-purple-500/50"
        >
          <MessageSquare className="h-16 w-16 text-white" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Chat AI Builder
            </span>
          </h1>
          <p className="mb-2 text-xl font-semibold text-muted-foreground">
            قريباً جداً! 🚀
          </p>
          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            نعمل بجد على بناء تجربة محادثة ذكية مع الـ AI لإنشاء موقعك في{' '}
            <span className="font-semibold text-purple-600">2-4 دقائق</span> فقط
          </p>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="my-12 grid gap-6 sm:grid-cols-3"
        >
          <div className="rounded-2xl border-2 border-purple-200 bg-white/50 p-6 backdrop-blur-sm">
            <div className="mb-3 text-4xl">💬</div>
            <h3 className="mb-2 font-semibold">حوار طبيعي</h3>
            <p className="text-sm text-muted-foreground">
              تحدث مع الـ AI كأنك تتحدث مع صديق
            </p>
          </div>

          <div className="rounded-2xl border-2 border-blue-200 bg-white/50 p-6 backdrop-blur-sm">
            <div className="mb-3 text-4xl">⚡</div>
            <h3 className="mb-2 font-semibold">سريع ومرن</h3>
            <p className="text-sm text-muted-foreground">
              عدل واطلب تغييرات فورية أثناء الحوار
            </p>
          </div>

          <div className="rounded-2xl border-2 border-purple-200 bg-white/50 p-6 backdrop-blur-sm">
            <div className="mb-3 text-4xl">🎨</div>
            <h3 className="mb-2 font-semibold">نفس الجودة</h3>
            <p className="text-sm text-muted-foreground">
              مواقع احترافية مثل Smart Wizard تماماً
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/wizard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              <Sparkles className="h-5 w-5" />
              <span>جرب Smart Wizard الآن</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>

          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-8 py-4 font-semibold transition-all hover:border-primary/50 hover:bg-accent"
            >
              <span>العودة للوحة التحكم</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Coming Soon Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/50 p-8"
        >
          <div className="mb-4 flex items-center justify-center gap-2 text-purple-600">
            <Rocket className="h-5 w-5" />
            <span className="font-semibold">خارطة الطريق</span>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                ✓
              </div>
              <span className="font-medium">Smart Wizard - مكتمل</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold">
                🔧
              </div>
              <span className="font-medium">Chat AI Builder - قيد التطوير</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold">
                📅
              </div>
              <span>Voice Builder - المرحلة 2</span>
            </div>
          </div>
        </motion.div>

        {/* Notification */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-sm text-muted-foreground"
        >
          💡 سنعلمك عبر البريد الإلكتروني فور إطلاق Chat AI Builder
        </motion.p>
      </div>
    </div>
  );
}
