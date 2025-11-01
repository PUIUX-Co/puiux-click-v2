'use client';

import { motion } from 'framer-motion';
import { useWizard } from '@/contexts/WizardContext';
import { availableSections, smartRecommendations, sectionPresets, sectionSuggestions } from '@/types/wizard';
import { Check, AlertCircle, Sparkles, GripVertical, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SectionsStep() {
  const { data, setSelectedSections } = useWizard();
  const [showSuggestion, setShowSuggestion] = useState<string | null>(null);

  // Get available sections for selected industry
  const allSections = data.industry ? availableSections[data.industry] : [];

  // Get required section IDs
  const requiredSections = allSections.filter(s => s.required).map(s => s.id);

  // Smart auto-selection on first load
  useEffect(() => {
    if (data.industry && data.selectedSections.length === 0) {
      const recommended = smartRecommendations[data.industry] || requiredSections;
      setSelectedSections(recommended);
    }
  }, [data.industry]); // Only run when industry changes

  const selectedSections = data.selectedSections?.length > 0
    ? data.selectedSections
    : requiredSections;

  // Apply preset
  const applyPreset = (presetKey: 'quick' | 'recommended' | 'complete') => {
    const preset = sectionPresets[presetKey];
    const recommended = data.industry ? smartRecommendations[data.industry] : requiredSections;

    if (presetKey === 'quick') {
      // Keep only required sections (3)
      setSelectedSections(requiredSections);
    } else if (presetKey === 'recommended') {
      // Use smart recommendations (4)
      setSelectedSections(recommended);
    } else {
      // Complete: add one more optional section (5)
      const optional = allSections.find(s => !s.required && !recommended.includes(s.id));
      if (optional) {
        setSelectedSections([...recommended, optional.id]);
      } else {
        setSelectedSections(recommended);
      }
    }
  };

  const toggleSection = (sectionId: string) => {
    const section = allSections.find(s => s.id === sectionId);

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

      // Show suggestion if this section has recommendations
      if (sectionSuggestions[sectionId]) {
        setShowSuggestion(sectionId);
        setTimeout(() => setShowSuggestion(null), 5000); // Hide after 5s
      }
    }

    setSelectedSections(newSelected);
  };

  // Move section up/down in order
  const moveSectionUp = (sectionId: string) => {
    const index = selectedSections.indexOf(sectionId);
    if (index > 0) {
      const newOrder = [...selectedSections];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setSelectedSections(newOrder);
    }
  };

  const moveSectionDown = (sectionId: string) => {
    const index = selectedSections.indexOf(sectionId);
    if (index < selectedSections.length - 1 && index !== -1) {
      const newOrder = [...selectedSections];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setSelectedSections(newOrder);
    }
  };

  const isSelected = (sectionId: string) => selectedSections.includes(sectionId);
  const selectedCount = selectedSections.length;
  const canAddMore = selectedCount < 5;

  // Get smart warning for current selection
  const getSmartWarning = (): string | null => {
    // Check for section dependencies
    for (const sectionId of selectedSections) {
      const suggestion = sectionSuggestions[sectionId];
      if (suggestion) {
        const hasRecommended = suggestion.recommendsWith.some(rec => selectedSections.includes(rec));
        if (!hasRecommended) {
          return suggestion.message;
        }
      }
    }
    return null;
  };

  const smartWarning = getSmartWarning();

  return (
    <div>
      <h2 className="mb-2 text-2xl sm:text-3xl font-bold">اختر أقسام الموقع</h2>
      <p className="mb-4 text-muted-foreground">
        اختر الأقسام التي تريد إضافتها لموقعك (3-5 أقسام)
      </p>

      {/* Quick Presets */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {Object.entries(sectionPresets).map(([key, preset]) => (
          <motion.button
            key={key}
            type="button"
            onClick={() => applyPreset(key as 'quick' | 'recommended' | 'complete')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
              selectedCount === preset.count
                ? 'border-primary bg-primary/10'
                : 'border-border bg-background/50 hover:border-primary/50'
            }`}
          >
            <span className="text-2xl">{preset.icon}</span>
            <div className="text-center">
              <p className="font-semibold text-sm">{preset.label}</p>
              <p className="text-xs text-muted-foreground">{preset.description}</p>
              <p className="text-xs text-primary mt-1">{preset.count} أقسام</p>
            </div>
            {key === 'recommended' && (
              <div className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                ⭐ الأفضل
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-blue-500/20 bg-blue-500/5 p-4">
        <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
            ✨ تم اختيار الأقسام الموصى بها تلقائياً
          </p>
          <p className="text-blue-600/80 dark:text-blue-400/80">
            • يمكنك تعديل الاختيار أو استخدام القوالب السريعة أعلاه
            <br />
            • اسحب الأقسام لتغيير ترتيبها في الموقع
            <br />
            • يمكنك إضافة المزيد من الأقسام لاحقاً عبر المحرر
          </p>
        </div>
      </div>

      {/* Smart Warning */}
      {smartWarning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-3 rounded-xl border-2 border-orange-500/20 bg-orange-500/5 p-4"
        >
          <Info className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-orange-600 dark:text-orange-400">
            💡 <strong>اقتراح:</strong> {smartWarning}
          </p>
        </motion.div>
      )}

      {/* Sections List - Ordered */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          الأقسام المختارة ({selectedCount}/5) - اسحب لتغيير الترتيب
        </h3>
        {selectedSections.map((sectionId, index) => {
          const section = allSections.find(s => s.id === sectionId);
          if (!section) return null;

          const isFirst = index === 0;
          const isLast = index === selectedSections.length - 1;
          const required = section.required;

          return (
            <motion.div
              key={sectionId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`relative flex items-center gap-3 rounded-xl border-2 p-4 ${
                required
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-primary bg-primary/10'
              }`}
            >
              {/* Order Controls */}
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveSectionUp(sectionId)}
                  disabled={isFirst || required}
                  className="disabled:opacity-30 disabled:cursor-not-allowed hover:text-primary"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-center">{index + 1}</span>
                <button
                  type="button"
                  onClick={() => moveSectionDown(sectionId)}
                  disabled={isLast || required}
                  className="disabled:opacity-30 disabled:cursor-not-allowed hover:text-primary"
                >
                  <GripVertical className="h-4 w-4 rotate-180" />
                </button>
              </div>

              {/* Checkbox */}
              <button
                type="button"
                onClick={() => toggleSection(sectionId)}
                disabled={required}
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                  required
                    ? 'border-green-500 bg-green-500 cursor-not-allowed'
                    : 'border-primary bg-primary cursor-pointer hover:scale-110'
                }`}
              >
                <Check className="h-4 w-4 text-white" />
              </button>

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

                {/* Show suggestion if just selected */}
                {showSuggestion === sectionId && sectionSuggestions[sectionId] && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    {sectionSuggestions[sectionId].message}
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Available Sections to Add */}
      {canAddMore && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            أقسام إضافية متاحة
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {allSections
              .filter(section => !isSelected(section.id) && !section.required)
              .map((section) => (
                <motion.button
                  key={section.id}
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  disabled={!canAddMore}
                  whileHover={{ scale: canAddMore ? 1.02 : 1 }}
                  whileTap={{ scale: canAddMore ? 0.98 : 1 }}
                  className="relative flex items-start gap-3 rounded-xl border-2 border-border bg-background/50 p-4 text-right transition-all hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 border-muted-foreground/30">
                    {/* Empty checkbox */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </motion.button>
              ))}
          </div>
        </div>
      )}

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
