import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-4xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center rounded-full border bg-secondary px-4 py-1.5 text-sm font-medium">
              <span className="mr-2">🚀</span>
              <span>Phase 1 - MVP Development</span>
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">بناء موقعك الاحترافي</span>
              <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                في 2-5 دقائق
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              منصة ذكية لبناء مواقع احترافية متعددة اللغات باستخدام الذكاء الاصطناعي.
              <br />
              لا حاجة لخبرة تقنية - فقط 5 خطوات بسيطة!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                ابدأ مجاناً
              </Link>
              <Link
                href="/demo"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                شاهد العرض التوضيحي
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 text-card-foreground">
                <div className="text-3xl font-bold text-primary">2-5</div>
                <div className="mt-2 text-sm text-muted-foreground">دقائق فقط</div>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground">
                <div className="text-3xl font-bold text-primary">5</div>
                <div className="mt-2 text-sm text-muted-foreground">قوالب جاهزة</div>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="mt-2 text-sm text-muted-foreground">مجاني (MVP)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-4 text-3xl font-bold">كيف يعمل؟</h2>
              <p className="mb-12 text-muted-foreground">
                5 خطوات بسيطة لإنشاء موقعك الاحترافي
              </p>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    step: 1,
                    title: 'اختر نوع نشاطك',
                    description: 'مطعم، عيادة، متجر، أو نشاط تجاري',
                    icon: '🎯',
                  },
                  {
                    step: 2,
                    title: 'أدخل معلومات نشاطك',
                    description: 'الاسم، الوصف، معلومات الاتصال',
                    icon: '✍️',
                  },
                  {
                    step: 3,
                    title: 'اختر الألوان',
                    description: '3 مجموعات ألوان جاهزة للاختيار',
                    icon: '🎨',
                  },
                  {
                    step: 4,
                    title: 'معاينة الموقع',
                    description: 'شاهد موقعك قبل النشر',
                    icon: '👀',
                  },
                  {
                    step: 5,
                    title: 'انشر مباشرة',
                    description: 'موقعك يصبح جاهزاً على الإنترنت',
                    icon: '🚀',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-lg border bg-card p-6 text-card-foreground"
                  >
                    <div className="mb-4 text-4xl">{item.icon}</div>
                    <div className="mb-2 text-xs font-semibold text-primary">
                      الخطوة {item.step}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">جاهز للبدء؟</h2>
            <p className="mb-8 text-muted-foreground">
              سجل الآن واحصل على موقعك الأول مجاناً
            </p>
            <Link
              href="/auth/register"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              ابدأ الآن - مجاناً
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2025 PUIUX Click. جميع الحقوق محفوظة.
            <span className="mx-2">•</span>
            <Link href="/privacy" className="hover:text-foreground">
              سياسة الخصوصية
            </Link>
            <span className="mx-2">•</span>
            <Link href="/terms" className="hover:text-foreground">
              الشروط والأحكام
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
