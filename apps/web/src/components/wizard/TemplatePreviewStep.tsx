'use client';

import { motion } from 'framer-motion';
import { useWizard } from '@/contexts/WizardContext';
import { Eye, Smartphone, Monitor, CheckCircle } from 'lucide-react';

export default function TemplatePreviewStep() {
  const { data } = useWizard();

  return (
    <div>
      <h2 className="mb-2 text-2xl sm:text-3xl font-bold">معاينة موقعك</h2>
      <p className="mb-6 sm:mb-8 text-muted-foreground">
        هذه معاينة لموقعك الجديد - جاهز للنشر!
      </p>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <SummaryCard
          title="نوع النشاط"
          value={data.industry || 'لم يتم الاختيار'}
          icon="🏢"
        />
        <SummaryCard title="اسم النشاط" value={data.businessName || 'غير محدد'} icon="📝" />
        <SummaryCard title="البريد" value={data.email || 'غير محدد'} icon="📧" />
        <SummaryCard
          title="الألوان"
          value={
            <div className="flex gap-2">
              <div
                className="h-6 w-6 rounded-full ring-2 ring-background"
                style={{ backgroundColor: data.colorPalette.primary }}
              />
              <div
                className="h-6 w-6 rounded-full ring-2 ring-background"
                style={{ backgroundColor: data.colorPalette.secondary }}
              />
            </div>
          }
          icon="🎨"
        />
      </div>

      {/* Preview Frame */}
      <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">معاينة مباشرة</span>
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-lg border border-border bg-background p-2 transition-colors hover:bg-muted"
              aria-label="معاينة الموبايل"
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button
              className="rounded-lg border border-border bg-background p-2 transition-colors hover:bg-muted"
              aria-label="معاينة الكمبيوتر"
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="aspect-video rounded-xl border-2 border-border bg-background overflow-hidden">
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: data.colorPalette.primary }}
              >
                <CheckCircle className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="mb-2 text-xl font-bold">{data.businessName || 'موقعك'}</h3>
              <p className="text-sm text-muted-foreground">
                {data.description || 'موقع احترافي جاهز للنشر'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-green-500/10 border border-green-500/30 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100">
                موقعك جاهز!
              </h4>
              <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                سيتم نشر موقعك على النطاق:{' '}
                <span className="font-mono">{data.businessName.toLowerCase()}.puiuxclick.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
