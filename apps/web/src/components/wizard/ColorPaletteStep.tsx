'use client';

import { motion } from 'framer-motion';
import { useWizard } from '@/contexts/WizardContext';
import { defaultColorPalettes } from '@/types/wizard';
import { Palette, Check } from 'lucide-react';

export default function ColorPaletteStep() {
  const { data, setColorPalette } = useWizard();

  return (
    <div>
      <h2 className="mb-2 text-2xl sm:text-3xl font-bold">اختر الألوان</h2>
      <p className="mb-6 sm:mb-8 text-muted-foreground">
        اختر لوحة الألوان التي تناسب علامتك التجارية
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {defaultColorPalettes.map((palette, index) => {
          const isSelected =
            data.colorPalette.primary === palette.primary &&
            data.colorPalette.secondary === palette.secondary;

          return (
            <motion.button
              key={palette.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                setColorPalette({
                  primary: palette.primary,
                  secondary: palette.secondary,
                  accent: palette.accent,
                })
              }
              className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all ${
                isSelected
                  ? 'border-primary shadow-lg shadow-primary/25'
                  : 'border-border hover:border-primary/50'
              }`}
              aria-label={`اختيار ${palette.name}`}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}

              {/* Palette Name */}
              <div className="mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{palette.name}</span>
              </div>

              {/* Color Circles */}
              <div className="flex gap-2">
                <div
                  className="h-12 w-12 rounded-full shadow-md ring-2 ring-background"
                  style={{ backgroundColor: palette.primary }}
                  aria-label={`اللون الأساسي: ${palette.primary}`}
                />
                <div
                  className="h-12 w-12 rounded-full shadow-md ring-2 ring-background"
                  style={{ backgroundColor: palette.secondary }}
                  aria-label={`اللون الثانوي: ${palette.secondary}`}
                />
                <div
                  className="h-12 w-12 rounded-full shadow-md ring-2 ring-background"
                  style={{ backgroundColor: palette.accent }}
                  aria-label={`اللون المميز: ${palette.accent}`}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Colors (Future Enhancement) */}
      <div className="mt-8 rounded-2xl border-2 border-dashed border-border p-6 text-center">
        <Palette className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-2 font-medium">ألوان مخصصة</h3>
        <p className="text-sm text-muted-foreground">
          قريباً: إمكانية اختيار ألوان مخصصة
        </p>
      </div>
    </div>
  );
}
