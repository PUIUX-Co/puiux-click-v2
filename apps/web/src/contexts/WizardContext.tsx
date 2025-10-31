'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { WizardData, WizardContextType, IndustryType } from '@/types/wizard';

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const initialData: WizardData = {
  industry: null,
  businessName: '',
  description: '',
  phone: '',
  email: '',
  address: '',
  colorPalette: {
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#06b6d4',
  },
  templateId: '',
};

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Set industry
  const setIndustry = useCallback((industry: IndustryType) => {
    setData((prev) => ({ ...prev, industry }));
  }, []);

  // Set business info
  const setBusinessInfo = useCallback((info: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...info }));
  }, []);

  // Set color palette
  const setColorPalette = useCallback((colors: WizardData['colorPalette']) => {
    setData((prev) => ({ ...prev, colorPalette: colors }));
  }, []);

  // Set template
  const setTemplate = useCallback((templateId: string) => {
    setData((prev) => ({ ...prev, templateId }));
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, 3)));
  }, []);

  // Validation
  const canProceed = (() => {
    switch (currentStep) {
      case 0: // Industry selection
        return !!data.industry;
      case 1: // Business info
        return !!(data.businessName && data.email);
      case 2: // Color palette
        return !!(data.colorPalette.primary && data.colorPalette.secondary);
      case 3: // Template (always can proceed for now)
        return true;
      default:
        return false;
    }
  })();

  // Generate site
  const generateSite = useCallback(async () => {
    setLoading(true);

    try {
      // TODO: Call API to generate site
      // const response = await fetch('/api/sites', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('تم إنشاء موقعك بنجاح! 🎉', {
        icon: '✨',
        duration: 4000,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الموقع. يرجى المحاولة مرة أخرى.', {
        icon: '❌',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, [data, router]);

  const value: WizardContextType = {
    currentStep,
    data,
    setIndustry,
    setBusinessInfo,
    setColorPalette,
    setTemplate,
    nextStep,
    prevStep,
    goToStep,
    canProceed,
    generateSite,
    loading,
  };

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

export default WizardContext;
