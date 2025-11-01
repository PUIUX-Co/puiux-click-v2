'use client';

import { motion } from 'framer-motion';
import { useWizard } from '@/contexts/WizardContext';
import { availableSections } from '@/types/wizard';
import { Check, AlertCircle } from 'lucide-react';

export default function SectionsStep() {
  const { data, setSelectedSections } = useWizard();

  // Get available sections for selected industry
  const sections = data.industry ? availableSections[data.industry] : [];

  // Get required section IDs
  const requiredSections = sections.filter(s => s.required).map(s => s.id);

  // Ensure selectedSections is initialized with required sections
  const selectedSections = data.selectedSections?.length > 0
    ? data.selectedSections
    : requiredSections;

  const toggleSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);

    // Don't allow toggling required sections
    if (section?.required) return;

    const isSelected = selectedSections.includes(sectionId);
    let newSelected: string[];

    if (isSelected) {
      // Remove section
      newSelected = selectedSections.filter(id => id !== sectionId);
    } else {
      // Add section (max 5 total)
      if (selectedSections.length >= 5) {
        return; // Already at max
      }
      newSelected = [...selectedSections, sectionId];
    }

    setSelectedSections(newSelected);
  };

  const isSelected = (sectionId: string) => selectedSections.includes(sectionId);
  const selectedCount = selectedSections.length;
  const canAddMore = selectedCount < 5;

  return (
    <div>
      <h2 className="mb-2 text-2xl sm:text-3xl font-bold">اختر أقسام الموقع</h2>
      <p className="mb-4 text-muted-foreground">
        اختر الأقسام التي تريد إضافتها لموقعك (3-5 أقسام)
      </p>

      {/* Info Banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-blue-500/20 bg-blue-500/5 p-4">
        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
            💡 نصيحة: اختر الأقسام الأساسية فقط
          </p>
          <p className="text-blue-600/80 dark:text-blue-400/80">
            • الأقسام المحددة ({selectedCount}/5) ستُنشأ باستخدام الذكاء الاصطناعي
            <br />
            • يمكنك إضافة المزيد من الأقسام لاحقاً عبر المحرر
            <br />
            • الأقسام الإجبارية محددة تلقائياً
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const selected = isSelected(section.id);
          const required = section.required;
          const disabled = required || (!selected && !canAddMore);

          return (
            <motion.button
              key={section.id}
              type="button"
              onClick={() => toggleSection(section.id)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`relative flex items-start gap-4 rounded-xl border-2 p-4 text-right transition-all ${
                selected
                  ? required
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-primary bg-primary/10'
                  : 'border-border bg-background/50 hover:border-border/80'
              } ${disabled && !selected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Checkbox */}
              <div
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                  selected
                    ? required
                      ? 'border-green-500 bg-green-500'
                      : 'border-primary bg-primary'
                    : 'border-muted-foreground/30'
                }`}
              >
                {selected && <Check className="h-4 w-4 text-white" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">
                    {section.title}
                  </h3>
                  {required && (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                      إجباري
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Counter */}
      <div className="mt-6 flex items-center justify-between rounded-xl border-2 border-border bg-background/50 p-4">
        <span className="text-sm font-medium">عدد الأقسام المختارة</span>
        <span
          className={`text-lg font-bold ${
            selectedCount >= 3 && selectedCount <= 5
              ? 'text-green-500'
              : 'text-orange-500'
          }`}
        >
          {selectedCount} / 5
        </span>
      </div>

      {selectedCount < 3 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-orange-500/10 px-4 py-3 text-sm text-orange-600 dark:text-orange-400">
          <AlertCircle className="h-4 w-4" />
          يجب اختيار 3 أقسام على الأقل للمتابعة
        </div>
      )}
    </div>
  );
}
