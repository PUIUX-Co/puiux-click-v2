'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Sparkles, ArrowRight, Check, X } from 'lucide-react';

export default function RegisterPage() {
  const { register, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Password strength checker
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const labels = ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

    return {
      score,
      label: labels[score - 1] || '',
      color: colors[score - 1] || '',
    };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
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

            <h1 className="text-3xl font-bold mb-2">إنشاء حساب جديد</h1>
            <p className="text-muted-foreground">ابدأ رحلتك في بناء موقعك الاحترافي</p>
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
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  الاسم الكامل
                </label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative"
                >
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="أدخل اسمك الكامل"
                  />
                  {focusedField === 'name' && (
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

              {/* Organization Name */}
              <div>
                <label htmlFor="organizationName" className="mb-2 block text-sm font-medium">
                  اسم المنظمة / النشاط
                </label>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('org')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10"
                  placeholder="مثال: متجر الإلكترونيات"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10"
                  placeholder="your@email.com"
                  dir="ltr"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 pr-12 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10"
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
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3"
                  >
                    <div className="mb-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.score
                              ? passwordStrength.color
                              : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      قوة كلمة المرور: <span className="font-medium">{passwordStrength.label}</span>
                    </p>

                    {/* Password Requirements */}
                    <div className="mt-3 space-y-2 text-xs">
                      <RequirementItem
                        met={formData.password.length >= 8}
                        text="8 أحرف على الأقل"
                      />
                      <RequirementItem
                        met={/[a-z]/.test(formData.password)}
                        text="حرف صغير واحد على الأقل"
                      />
                      <RequirementItem
                        met={/[A-Z]/.test(formData.password)}
                        text="حرف كبير واحد على الأقل"
                      />
                      <RequirementItem
                        met={/[0-9]/.test(formData.password)}
                        text="رقم واحد على الأقل"
                      />
                    </div>
                  </motion.div>
                )}
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
                    جاري الإنشاء...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    إنشاء حساب
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

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              لديك حساب بالفعل؟{' '}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 transition-all hover:underline"
              >
                تسجيل الدخول
              </Link>
            </p>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center text-xs text-muted-foreground"
          >
            بإنشاء حساب، فإنك توافق على{' '}
            <Link href="/terms" className="underline-offset-4 hover:underline">
              شروط الخدمة
            </Link>{' '}
            و
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              {' '}
              سياسة الخصوصية
            </Link>
          </motion.p>
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

// Helper component for password requirements
function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2"
    >
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
          met ? 'bg-green-500/20' : 'bg-muted'
        }`}
      >
        {met ? (
          <Check className="h-3 w-3 text-green-600" />
        ) : (
          <X className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
      <span className={met ? 'text-green-600' : 'text-muted-foreground'}>{text}</span>
    </motion.div>
  );
}
