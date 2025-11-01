'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { WizardProvider, useWizard } from '@/contexts/WizardContext';
import { Check, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

// Import wizard steps
import IndustryStep from '@/components/wizard/IndustryStep';
import BusinessInfoStep from '@/components/wizard/BusinessInfoStep';
import ColorPaletteStep from '@/components/wizard/ColorPaletteStep';
import SectionsStep from '@/components/wizard/SectionsStep';
import TemplatePreviewStep from '@/components/wizard/TemplatePreviewStep';

const steps = [
  { id: 0, title: 'اختر نوع النشاط', component: IndustryStep },
  { id: 1, title: 'معلومات النشاط', component: BusinessInfoStep },
  { id: 2, title: 'الألوان', component: ColorPaletteStep },
  { id: 3, title: 'اختر الأقسام', component: SectionsStep },
  { id: 4, title: 'المعاينة', component: TemplatePreviewStep },
];

function WizardContent() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { currentStep, nextStep, prevStep, canProceed, generateSite, loading } = useWizard();

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/wizard');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              PUIUX Click
            </span>
          </div>
        </div>
      </header>

      {/* Progress Indicator - Mobile Optimized */}
      <div className="sticky top-16 z-40 border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                {/* Step Circle */}
                <div className="relative flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: currentStep === index ? 1.1 : currentStep > index ? 1 : 0.9,
                    }}
                    className={`relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-all ${
                      currentStep > index
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                        : currentStep === index
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > index ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </motion.div>

                  {/* Step Title - Hidden on mobile */}
                  <span
                    className={`mt-2 hidden sm:block text-xs font-medium transition-colors ${
                      currentStep >= index ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 px-2">
                    <div className="relative h-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: currentStep > index ? '100%' : '0%' }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-y-0 left-0 bg-green-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current Step Title - Mobile */}
          <div className="mt-3 sm:hidden text-center">
            <p className="text-sm font-medium text-foreground">{steps[currentStep].title}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-4xl"
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - Fixed Bottom on Mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 p-4 backdrop-blur-xl sm:relative sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={prevStep}
                  className="flex h-12 items-center gap-2 rounded-xl border-2 border-border bg-background px-6 font-medium transition-all hover:border-primary hover:bg-primary/5"
                  aria-label="الخطوة السابقة"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="hidden sm:inline">السابق</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: canProceed ? 1.02 : 1 }}
                whileTap={{ scale: canProceed ? 0.98 : 1 }}
                onClick={isLastStep ? generateSite : nextStep}
                disabled={!canProceed || loading}
                className="group relative flex flex-1 h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 px-6 font-medium text-white shadow-lg shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isLastStep ? 'إنشاء الموقع' : 'الخطوة التالية'}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    جاري الإنشاء...
                  </>
                ) : isLastStep ? (
                  <>
                    <Sparkles className="h-5 w-5" />
                    إنشاء الموقع
                  </>
                ) : (
                  <>
                    التالي
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Add spacing for fixed bottom navigation on mobile */}
        <div className="h-20 sm:hidden" />
      </main>

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

export default function WizardPage() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
