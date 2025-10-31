'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { ConversationData } from '@/types/chat';

interface LivePreviewProps {
  data: ConversationData;
  currentStep: string;
}

export default function LivePreview({ data, currentStep }: LivePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Don't show preview until we have at least industry
  if (!data.industry || currentStep === 'welcome') {
    return null;
  }

  return (
    <>
      {/* Floating Preview Button */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-24 left-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-sm transition-all hover:shadow-purple-500/50 sm:bottom-6 sm:left-6"
            aria-label="معاينة الموقع"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">معاينة حية</span>
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold">
              ✓
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Preview Panel */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Preview Panel */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex w-full flex-col bg-background shadow-2xl sm:w-[480px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="font-bold">معاينة حية</h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex gap-1 rounded-lg border bg-background p-1">
                    <button
                      onClick={() => setViewMode('desktop')}
                      className={`rounded p-1.5 transition-colors ${
                        viewMode === 'desktop'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                      aria-label="عرض سطح المكتب"
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={`rounded p-1.5 transition-colors ${
                        viewMode === 'mobile'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                      aria-label="عرض الموبايل"
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="rounded-lg p-2 transition-colors hover:bg-accent"
                    aria-label="إغلاق المعاينة"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-auto bg-gradient-to-br from-purple-50/50 via-background to-blue-50/50 p-4">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mx-auto overflow-hidden rounded-lg border-4 border-gray-300 bg-white shadow-2xl ${
                    viewMode === 'mobile' ? 'max-w-[375px]' : 'w-full'
                  }`}
                  style={{
                    aspectRatio: viewMode === 'mobile' ? '9 / 16' : '16 / 9',
                  }}
                >
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 border-b bg-gray-100 px-3 py-2">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 rounded bg-white px-2 py-1 text-xs text-muted-foreground">
                      {data.businessName || 'موقعك'}.com
                    </div>
                  </div>

                  {/* Website Preview */}
                  <div className="h-full overflow-auto bg-white p-4">
                    {/* Hero Section Preview */}
                    <div
                      className="mb-6 rounded-lg p-6 text-center"
                      style={{
                        backgroundColor: data.colorPalette.primary + '15',
                        borderColor: data.colorPalette.primary,
                      }}
                    >
                      <div
                        className="mx-auto mb-3 h-16 w-16 rounded-full"
                        style={{ backgroundColor: data.colorPalette.primary }}
                      />
                      <h1
                        className="mb-2 text-2xl font-bold"
                        style={{ color: data.colorPalette.primary }}
                      >
                        {data.businessName || 'اسم نشاطك'}
                      </h1>
                      {data.description && (
                        <p className="text-sm text-gray-600">{data.description}</p>
                      )}
                    </div>

                    {/* Features Section */}
                    <div className="mb-6 grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-lg border p-3 text-center">
                          <div
                            className="mx-auto mb-2 h-10 w-10 rounded-lg"
                            style={{ backgroundColor: data.colorPalette.accent + '30' }}
                          />
                          <div className="h-2 rounded bg-gray-200" />
                        </div>
                      ))}
                    </div>

                    {/* Contact Section */}
                    {(data.phone || data.email) && (
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-3 font-bold">تواصل معنا</h3>
                        {data.phone && (
                          <div className="mb-2 flex items-center gap-2 text-sm">
                            <div
                              className="h-8 w-8 rounded-full"
                              style={{ backgroundColor: data.colorPalette.secondary + '30' }}
                            />
                            <span className="text-gray-600">{data.phone}</span>
                          </div>
                        )}
                        {data.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <div
                              className="h-8 w-8 rounded-full"
                              style={{ backgroundColor: data.colorPalette.accent + '30' }}
                            />
                            <span className="text-gray-600">{data.email}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer Preview */}
                    <div className="mt-6 rounded-lg bg-gray-100 p-4 text-center">
                      <div className="mb-2 h-8 w-8 mx-auto rounded-full bg-gray-300" />
                      <div className="mx-auto h-2 w-32 rounded bg-gray-300" />
                    </div>
                  </div>
                </motion.div>

                {/* Info Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 rounded-lg border bg-blue-50 p-3 text-center text-sm text-blue-900"
                >
                  <Sparkles className="mx-auto mb-1 h-4 w-4" />
                  <p className="font-medium">معاينة تقريبية للموقع النهائي</p>
                  <p className="text-xs text-blue-700">سيتم تحسينها بالذكاء الاصطناعي عند الإنشاء</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
