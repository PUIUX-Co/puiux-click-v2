'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BuilderSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface BuilderMethod {
  id: string;
  icon: string;
  title: string;
  titleEn: string;
  time: string;
  description: string;
  features: string[];
  recommended?: boolean;
  comingSoon?: boolean;
  route: string;
  color: string;
  hoverColor: string;
}

const builderMethods: BuilderMethod[] = [
  {
    id: 'wizard',
    icon: '🧙‍♂️',
    title: 'Smart Wizard',
    titleEn: 'Smart Wizard',
    time: '3-5 دقائق',
    description: 'خطوة بخطوة - مثالي للمبتدئين',
    features: [
      'خطوات واضحة ومنظمة',
      'اختيار جاهز للألوان',
      'قوالب احترافية لكل نشاط',
    ],
    recommended: true,
    route: '/wizard',
    color: 'text-primary',
    hoverColor: 'hover:border-primary hover:shadow-primary/20',
  },
  {
    id: 'chat',
    icon: '💬',
    title: 'Chat AI',
    titleEn: 'Chat AI',
    time: '2-4 دقائق',
    description: 'حوار طبيعي مع الـ AI',
    features: [
      'سريع ومرن جداً',
      'بدون خطوات محددة',
      'تعديل وتخصيص فوري',
    ],
    route: '/chat-builder',
    color: 'text-purple-600',
    hoverColor: 'hover:border-purple-500 hover:shadow-purple-500/20',
  },
  {
    id: 'voice',
    icon: '🎤',
    title: 'Voice Builder',
    titleEn: 'Voice Builder',
    time: '2-3 دقائق',
    description: 'بصوتك فقط - بدون كتابة',
    features: [
      'بدون كتابة نهائياً',
      'أسرع طريقة',
      'مثالي أثناء التنقل',
    ],
    comingSoon: true,
    route: '#',
    color: 'text-orange-600',
    hoverColor: 'hover:opacity-100',
  },
];

export default function BuilderSelectionDialog({
  open,
  onOpenChange,
}: BuilderSelectionDialogProps) {
  const router = useRouter();

  const handleMethodSelect = (method: BuilderMethod) => {
    if (method.comingSoon) {
      return;
    }
    onOpenChange(false);
    router.push(method.route);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            اختر طريقة بناء موقعك
          </DialogTitle>
          <DialogDescription className="text-base">
            جرب الطريقة الأنسب لك - يمكنك استخدام طريقة مختلفة لكل موقع
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3 mt-6">
          {builderMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method)}
              disabled={method.comingSoon}
              className={`
                group relative overflow-hidden rounded-2xl border-2 bg-card p-6 text-right
                transition-all duration-300
                ${method.comingSoon ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:shadow-2xl'}
                ${method.recommended ? 'border-primary/50' : 'border-border'}
                ${!method.comingSoon && method.hoverColor}
              `}
            >
              {/* Recommended Badge */}
              {method.recommended && (
                <div className="absolute -right-10 top-5 rotate-45 bg-gradient-to-r from-primary to-blue-500 px-10 py-1 text-xs font-bold text-white shadow-lg">
                  ⭐ موصى به
                </div>
              )}

              {/* Coming Soon Badge */}
              {method.comingSoon && (
                <div className="absolute -right-10 top-5 rotate-45 bg-gradient-to-r from-orange-500 to-red-500 px-10 py-1 text-xs font-bold text-white shadow-lg">
                  🔜 قريباً
                </div>
              )}

              {/* Icon */}
              <div
                className={`mb-4 text-6xl transition-transform duration-300 ${!method.comingSoon && 'group-hover:scale-110'}`}
              >
                {method.icon}
              </div>

              {/* Title */}
              <h3 className="mb-2 text-xl font-bold">{method.title}</h3>

              {/* Time */}
              <div className={`mb-3 flex items-center gap-2 ${method.color}`}>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold">{method.time}</span>
              </div>

              {/* Description */}
              <p className="mb-4 text-sm text-muted-foreground">
                {method.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {method.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <svg
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${method.color}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={method.comingSoon ? 'opacity-60' : ''}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Hover gradient */}
              {!method.comingSoon && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              )}

              {/* Action hint */}
              {!method.comingSoon && (
                <div className="mt-4 pt-4 border-t text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  اضغط للبدء ←
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="mt-6 rounded-xl bg-muted/50 p-4">
          <p className="text-center text-sm text-muted-foreground">
            <span className="font-semibold">💡 نصيحة:</span> جرب{' '}
            <span className="font-semibold text-primary">Smart Wizard</span> أولاً
            - الأكثر شعبية بين المستخدمين
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
