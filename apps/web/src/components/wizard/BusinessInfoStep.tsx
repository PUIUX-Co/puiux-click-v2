'use client';

import { motion } from 'framer-motion';
import { useWizard } from '@/contexts/WizardContext';
import { Building2, Mail, Phone, MapPin, FileText } from 'lucide-react';

export default function BusinessInfoStep() {
  const { data, setBusinessInfo } = useWizard();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBusinessInfo({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl sm:text-3xl font-bold">معلومات نشاطك</h2>
      <p className="mb-6 sm:mb-8 text-muted-foreground">
        أخبرنا المزيد عن نشاطك التجاري
      </p>

      <div className="space-y-5">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="mb-2 block text-sm font-medium">
            اسم النشاط <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="businessName"
              name="businessName"
              type="text"
              required
              value={data.businessName}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 pr-12 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              placeholder="مثال: مطعم النخيل"
              aria-required="true"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            البريد الإلكتروني <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={data.email}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 pr-12 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              placeholder="info@example.com"
              dir="ltr"
              aria-required="true"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            رقم الهاتف
          </label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={data.phone}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 pr-12 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              placeholder="+966 50 123 4567"
              dir="ltr"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            العنوان
          </label>
          <div className="relative">
            <MapPin className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              id="address"
              name="address"
              type="text"
              value={data.address}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 pr-12 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              placeholder="الرياض، المملكة العربية السعودية"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            وصف النشاط
          </label>
          <div className="relative">
            <FileText className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            <textarea
              id="description"
              name="description"
              rows={4}
              value={data.description}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 pr-12 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 resize-none"
              placeholder="اكتب وصفاً مختصراً عن نشاطك..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
