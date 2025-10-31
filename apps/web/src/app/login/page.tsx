'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
    } catch (error) {
      // Error handled by AuthContext with toast
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -right-1/2 h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/2 h-[1000px] w-[1000px] rounded-full bg-gradient-to-tr from-blue-500/20 via-cyan-500/10 to-transparent blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo & Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 text-center"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/25">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                PUIUX Click
              </span>
            </Link>

            <h1 className="text-3xl font-bold mb-2">مرحباً بعودتك</h1>
            <p className="text-muted-foreground">سجّل دخولك للمتابعة إلى لوحة التحكم</p>
          </motion.div>

          {/* Form Card with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/80 p-8 shadow-2xl backdrop-blur-xl"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />

            <form onSubmit={handleSubmit} className="relative space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  البريد الإلكتروني
                </label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative"
                >
                  <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="peer w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 pr-12 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="your@email.com"
                    dir="ltr"
                  />
                  {focusedField === 'email' && (
                    <motion.div
                      layoutId="activeField"
                      className="absolute inset-0 -z-10 rounded-xl bg-primary/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Password Field */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium">
                    كلمة المرور
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary underline-offset-4 transition-all hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative"
                >
                  <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="peer w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 pr-12 pl-12 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {focusedField === 'password' && (
                    <motion.div
                      layoutId="activeField"
                      className="absolute inset-0 -z-10 rounded-xl bg-primary/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                  تذكرني
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || authLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 px-6 py-3.5 font-medium text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    تسجيل الدخول
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}

                {/* Shimmer effect on button */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">أو</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground">
              ليس لديك حساب؟{' '}
              <Link
                href="/register"
                className="font-medium text-primary underline-offset-4 transition-all hover:underline"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>آمن 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10">
                  <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span>مشفّر بالكامل</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add keyframes for shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
