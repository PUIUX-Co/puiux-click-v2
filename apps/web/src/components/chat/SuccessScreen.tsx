'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowLeft } from 'lucide-react';
import type { ConversationData } from '@/types/chat';
import Image from 'next/image';

interface SuccessScreenProps {
  data: ConversationData;
  onViewSite: () => void;
}

export default function SuccessScreen({ data, onViewSite }: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-2xl"
    >
      {/* Success Card */}
      <div className="overflow-hidden rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-blue-50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg"
          >
            <Check className="h-12 w-12 text-green-500" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-2 text-3xl font-bold"
          >
            🎉 تهانينا!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-green-50"
          >
            موقعك الاحترافي جاهز للانطلاق!
          </motion.p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 space-y-4"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-purple-600" />
              ملخص موقعك
            </h3>

            <div className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">اسم الموقع</p>
                  <p className="font-bold text-foreground">{data.businessName}</p>
                </div>
              </div>

              {data.industry && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">نوع النشاط</p>
                    <p className="font-bold text-foreground">{data.industry}</p>
                  </div>
                </div>
              )}

              {data.description && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">الوصف</p>
                    <p className="text-sm text-foreground">{data.description}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                  4
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">نظام الألوان</p>
                  <div className="mt-2 flex gap-2">
                    <div
                      className="h-8 w-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: data.colorPalette.primary }}
                      title="اللون الأساسي"
                    />
                    <div
                      className="h-8 w-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: data.colorPalette.secondary }}
                      title="اللون الثانوي"
                    />
                    <div
                      className="h-8 w-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: data.colorPalette.accent }}
                      title="اللون المميز"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6 grid gap-3 sm:grid-cols-2"
          >
            {[
              { icon: '🚀', text: 'جاهز للنشر فوراً' },
              { icon: '📱', text: 'متجاوب مع كل الأجهزة' },
              { icon: '⚡', text: 'سرعة تحميل فائقة' },
              { icon: '🎨', text: 'تصميم احترافي' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewSite}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-primary p-4 font-bold text-white shadow-lg transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center justify-center gap-2">
              <span>ابدأ تخصيص موقعك الآن</span>
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </div>
          </motion.button>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 text-center text-xs text-muted-foreground"
          >
            <p>يمكنك تعديل وتخصيص كل شيء في المحرر</p>
          </motion.div>
        </div>

        {/* Branding Footer */}
        <div className="border-t bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">تم الإنشاء بواسطة</span>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-medium shadow-sm">
              <Image
                src="https://puiux.com/wp-content/uploads/2021/09/Logo-Black-Copress.svg"
                alt="PUIUX Logo"
                width={50}
                height={16}
                className="h-4 w-auto"
              />
              <span className="font-bold">Click</span>
            </div>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
