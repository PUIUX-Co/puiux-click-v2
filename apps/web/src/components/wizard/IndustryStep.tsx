'use client';

import { motion } from 'framer-motion';
import { useWizard } from '@/contexts/WizardContext';
import { industries, IndustryType } from '@/types/wizard';

export default function IndustryStep() {
  const { data, setIndustry } = useWizard();

  return (
    <div>
      <h2 className="mb-2 text-2xl sm:text-3xl font-bold">اختر نوع نشاطك</h2>
      <p className="mb-6 sm:mb-8 text-muted-foreground">
        سنقوم بتخصيص الموقع حسب نوع نشاطك
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry, index) => (
          <motion.button
            key={industry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIndustry(industry.id as IndustryType)}
            className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-right transition-all
              ${
                data.industry === industry.id
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/25'
                  : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
              }`}
            aria-label={`اختيار ${industry.name.ar}`}
            role="radio"
            aria-checked={data.industry === industry.id}
          >
            {/* Selected Indicator */}
            {data.industry === industry.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white"
              >
                ✓
              </motion.div>
            )}

            {/* Icon */}
            <div className="mb-4 text-5xl sm:text-6xl transition-transform group-hover:scale-110">
              {industry.icon}
            </div>

            {/* Title */}
            <h3 className="mb-2 text-lg sm:text-xl font-bold">{industry.name.ar}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{industry.name.en}</p>

            {/* Description */}
            <p className="mt-3 text-sm text-muted-foreground">
              {industry.description}
            </p>

            {/* Gradient Overlay on Hover */}
            <div
              className={`absolute inset-0 -z-10 bg-gradient-to-br ${industry.color} opacity-0 transition-opacity group-hover:opacity-5`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
