import Link from 'next/link';
import { brandConfig } from '@puiux/config';

export default function HomePage() {
  const industries = brandConfig.features.industries;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-20 sm:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-secondary/80 px-5 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                <span>🚀 منصة جديدة - مجانية بالكامل في المرحلة التجريبية</span>
              </div>

              {/* Main Heading */}
              <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-foreground">موقعك الاحترافي</span>
                <span className="block bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  في دقائق معدودة
                </span>
              </h1>

              {/* Subheading */}
              <p className="mx-auto mb-4 max-w-3xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
                لا حاجة لخبرة تقنية. لا حاجة لمصممين. لا حاجة لأسابيع من العمل.
              </p>
              <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg">
                <span className="font-semibold text-foreground">فقط 5 خطوات بسيطة</span> وموقعك
                الاحترافي جاهز - بالعربية والإنجليزية - مع تصميم متجاوب وسرعة فائقة
              </p>

              {/* CTA Buttons */}
              <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground shadow-2xl transition-all hover:scale-105 hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  <span className="relative flex items-center gap-2">
                    <span>ابدأ مجاناً الآن</span>
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="#demo"
                  className="inline-flex h-14 w-full items-center justify-center rounded-xl border-2 border-input bg-background px-10 text-base font-semibold shadow-sm transition-all hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                >
                  شاهد كيف يعمل
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>لا بطاقة ائتمان مطلوبة</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>مجاني 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>جاهز في دقائق</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -right-4 top-1/3 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"></div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
              <div className="group rounded-2xl border-2 bg-card p-8 text-center shadow-sm transition-all hover:border-primary/50 hover:shadow-lg">
                <div className="mb-3 text-5xl font-extrabold text-primary transition-transform group-hover:scale-110">
                  2-5
                </div>
                <div className="text-lg font-semibold text-foreground">دقائق فقط</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  من البداية للنشر
                </div>
              </div>
              <div className="group rounded-2xl border-2 bg-card p-8 text-center shadow-sm transition-all hover:border-primary/50 hover:shadow-lg">
                <div className="mb-3 text-5xl font-extrabold text-primary transition-transform group-hover:scale-110">
                  5
                </div>
                <div className="text-lg font-semibold text-foreground">أنواع أنشطة</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  مطاعم، عيادات، متاجر، وأكثر
                </div>
              </div>
              <div className="group rounded-2xl border-2 bg-card p-8 text-center shadow-sm transition-all hover:border-primary/50 hover:shadow-lg">
                <div className="mb-3 text-5xl font-extrabold text-primary transition-transform group-hover:scale-110">
                  100%
                </div>
                <div className="text-lg font-semibold text-foreground">مجاني</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  في المرحلة التجريبية
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industries Section - NEW */}
        <section className="border-t py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                  قوالب جاهزة لنشاطك
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  اختر من بين 5 أنواع أنشطة مختلفة - كل قالب مصمم خصيصاً لنوع نشاطك
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {industries.map((industry) => (
                  <div
                    key={industry.id}
                    className="group relative overflow-hidden rounded-2xl border-2 bg-card p-6 text-center transition-all hover:border-primary hover:shadow-xl"
                  >
                    <div className="mb-4 text-6xl transition-transform group-hover:scale-125">
                      {industry.icon}
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{industry.name.ar}</h3>
                    <p className="text-sm text-muted-foreground">{industry.name.en}</p>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <span>تصفح جميع القوالب</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Builder Methods Section - NEW */}
        <section className="relative overflow-hidden border-t bg-gradient-to-br from-primary/5 via-purple-500/5 to-background py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              {/* Section Header */}
              <div className="mb-16 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                  </span>
                  <span>⚡ اختر الطريقة الأنسب لك</span>
                </div>
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                  <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    3 طرق ذكية
                  </span>{' '}
                  لبناء موقعك
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  كلها سريعة، كلها سهلة، كلها مدعومة بالذكاء الاصطناعي - اختر ما يناسبك
                </p>
              </div>

              {/* Builder Methods Cards */}
              <div className="grid gap-8 md:grid-cols-3">
                {/* Method 1: Smart Wizard */}
                <div className="group relative overflow-hidden rounded-3xl border-2 border-primary/50 bg-card p-8 shadow-lg transition-all hover:border-primary hover:shadow-2xl hover:shadow-primary/20">
                  {/* Recommended Badge */}
                  <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-primary to-blue-500 px-12 py-1 text-xs font-bold text-white shadow-lg">
                    ⭐ موصى به
                  </div>

                  {/* Icon */}
                  <div className="mb-6 text-7xl transition-transform group-hover:scale-110">
                    🧙‍♂️
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-2xl font-bold">Smart Wizard</h3>

                  {/* Time */}
                  <div className="mb-4 flex items-center gap-2 text-primary">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">3-5 دقائق</span>
                  </div>

                  {/* Description */}
                  <p className="mb-6 text-muted-foreground">
                    خطوة بخطوة - مثالي للمبتدئين. الذكاء الاصطناعي يرشدك لإنشاء موقع احترافي بأسئلة بسيطة ومباشرة.
                  </p>

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>خطوات واضحة ومنظمة</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>اختيار جاهز للألوان والتصاميم</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>قوالب احترافية حسب نوع نشاطك</span>
                    </li>
                  </ul>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                </div>

                {/* Method 2: Chat AI */}
                <div className="group relative overflow-hidden rounded-3xl border-2 bg-card p-8 shadow-lg transition-all hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20">
                  {/* Icon */}
                  <div className="mb-6 text-7xl transition-transform group-hover:scale-110">
                    💬
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-2xl font-bold">Chat AI</h3>

                  {/* Time */}
                  <div className="mb-4 flex items-center gap-2 text-purple-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">2-4 دقائق</span>
                  </div>

                  {/* Description */}
                  <p className="mb-6 text-muted-foreground">
                    حوار طبيعي مع الذكاء الاصطناعي. اشرح فكرتك بحرية والـ AI يبني موقعك الاحترافي تلقائياً.
                  </p>

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>سريع ومرن جداً</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>بدون خطوات محددة - حرية كاملة</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>تعديل وتخصيص فوري</span>
                    </li>
                  </ul>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                </div>

                {/* Method 3: Voice Builder */}
                <Link
                  href="/voice-builder"
                  className="group relative block overflow-hidden rounded-3xl border-2 bg-card p-8 shadow-lg transition-all hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20"
                >
                  {/* New Badge */}
                  <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-orange-500 to-red-500 px-12 py-1 text-xs font-bold text-white shadow-lg">
                    🆕 جديد
                  </div>

                  {/* Icon */}
                  <div className="mb-6 text-7xl transition-transform group-hover:scale-110">
                    🎤
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-2xl font-bold">Voice Builder</h3>

                  {/* Time */}
                  <div className="mb-4 flex items-center gap-2 text-orange-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">2-3 دقائق</span>
                  </div>

                  {/* Description */}
                  <p className="mb-6 text-muted-foreground">
                    بصوتك فقط - بدون كتابة نهائياً! صف موقعك بصوتك والذكاء الاصطناعي ينفذ كل شيء.
                  </p>

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    <li className="flex items-start gap-2 text-sm opacity-75">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>بدون كتابة نهائياً</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm opacity-75">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>أسرع طريقة على الإطلاق</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm opacity-75">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>مثالي أثناء التنقل</span>
                    </li>
                  </ul>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                </Link>
              </div>

              {/* Bottom CTA */}
              <div className="mt-16 text-center">
                <Link
                  href="/auth/register"
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-blue-500 to-purple-600 px-10 text-base font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-primary/30"
                >
                  <span>جرب أي طريقة مجاناً الآن</span>
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground">
                  💡 يمكنك التبديل بين الطرق في أي وقت - جرب كلها!
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -right-4 top-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>
          </div>
        </section>

        {/* Features/How it Works Section - Enhanced */}
        <section className="border-t bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                  كيف يعمل؟
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  5 خطوات بسيطة تفصلك عن موقع احترافي بالكامل
                </p>
              </div>

              <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                {/* Connecting line */}
                <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-0.5 bg-border lg:block"></div>

                {[
                  {
                    step: 1,
                    title: 'اختر نوع نشاطك',
                    description: 'مطعم؟ عيادة؟ متجر؟ اختر من بين 5 أنواع',
                    icon: '🎯',
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    step: 2,
                    title: 'أدخل معلوماتك',
                    description: 'اسم نشاطك، الوصف، معلومات الاتصال فقط',
                    icon: '✍️',
                    color: 'from-purple-500 to-pink-500',
                  },
                  {
                    step: 3,
                    title: 'اختر الألوان',
                    description: '3 مجموعات ألوان احترافية جاهزة للاختيار',
                    icon: '🎨',
                    color: 'from-orange-500 to-red-500',
                  },
                  {
                    step: 4,
                    title: 'عاين موقعك',
                    description: 'شاهد النتيجة النهائية قبل النشر',
                    icon: '👀',
                    color: 'from-green-500 to-emerald-500',
                  },
                  {
                    step: 5,
                    title: 'انشر مباشرة',
                    description: 'موقعك يصبح جاهزاً على الإنترنت فوراً',
                    icon: '🚀',
                    color: 'from-indigo-500 to-blue-500',
                  },
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="group rounded-2xl border-2 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl">
                      {/* Step number badge */}
                      <div className="absolute -top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg">
                        {item.step}
                      </div>

                      <div className="mb-4 text-5xl transition-transform group-hover:scale-110">
                        {item.icon}
                      </div>
                      <h3 className="mb-3 text-lg font-bold">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - NEW */}
        <section className="border-t py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                  الأسعار
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  ابدأ مجاناً - بدون بطاقة ائتمان - بدون التزامات
                </p>
              </div>

              <div className="relative mx-auto max-w-md">
                {/* Popular badge */}
                <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground shadow-lg">
                  الأكثر شعبية
                </div>

                <div className="rounded-3xl border-2 border-primary bg-card p-8 shadow-2xl">
                  <div className="mb-8 text-center">
                    <h3 className="mb-2 text-2xl font-bold">الباقة المجانية</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-extrabold">مجاناً</span>
                      <span className="text-muted-foreground"> / للأبد</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      كل ما تحتاجه للبدء - بدون أي تكلفة
                    </p>
                  </div>

                  <ul className="mb-8 space-y-4">
                    {[
                      'موقع واحد مجاناً',
                      'اختيار من بين 5 أنواع أنشطة',
                      'تصميم احترافي متجاوب',
                      'دعم اللغة العربية والإنجليزية',
                      '100 ميجابايت تخزين',
                      '1 جيجابايت نقل بيانات شهرياً',
                      'دعم عبر المجتمع',
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/auth/register"
                    className="block w-full rounded-xl bg-primary py-4 text-center text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                  >
                    ابدأ مجاناً الآن
                  </Link>
                </div>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  💡 باقات مدفوعة قادمة قريباً مع مميزات إضافية
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="border-t bg-gradient-to-br from-primary/10 via-purple-500/10 to-background py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl">
                جاهز لإطلاق موقعك؟
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                انضم إلى المئات الذين أطلقوا مواقعهم في دقائق.
                <br />
                لا حاجة لخبرة تقنية. مجاني بالكامل.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex h-16 items-center justify-center gap-2 rounded-xl bg-primary px-12 text-lg font-semibold text-primary-foreground shadow-2xl transition-all hover:scale-105 hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>ابدأ مجاناً الآن</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <p className="mt-6 text-sm text-muted-foreground">
                لا بطاقة ائتمان مطلوبة • جاهز في دقائق • مجاني للأبد
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* About */}
              <div>
                <h3 className="mb-4 text-lg font-bold">PUIUX Click</h3>
                <p className="text-sm text-muted-foreground">
                  منصة ذكية لبناء مواقع احترافية في دقائق معدودة
                </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="mb-4 text-sm font-semibold">روابط سريعة</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/templates" className="text-muted-foreground hover:text-foreground">
                      القوالب
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                      الأسعار
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground">
                      عن المنصة
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="mb-4 text-sm font-semibold">الدعم</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/help" className="text-muted-foreground hover:text-foreground">
                      مركز المساعدة
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                      اتصل بنا
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                      الأسئلة الشائعة
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="mb-4 text-sm font-semibold">قانوني</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                      سياسة الخصوصية
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                      الشروط والأحكام
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
              <p>© 2025 PUIUX Click. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
