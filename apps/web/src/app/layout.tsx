import type { Metadata } from 'next';
import { Inter, Tajawal } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PUIUX Click - بناء مواقع احترافية في دقائق',
    template: '%s | PUIUX Click',
  },
  description:
    'بناء مواقع احترافية متعددة اللغات في 2-5 دقائق باستخدام الذكاء الاصطناعي',
  keywords: [
    'website builder',
    'AI website',
    'Arabic websites',
    'بناء مواقع',
    'موقع إلكتروني',
    'ذكاء اصطناعي',
  ],
  authors: [{ name: 'PUIUX', url: 'https://puiux.com' }],
  creator: 'PUIUX',
  publisher: 'PUIUX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    url: '/',
    siteName: 'PUIUX Click',
    title: 'PUIUX Click - بناء مواقع احترافية في دقائق',
    description:
      'بناء مواقع احترافية متعددة اللغات في 2-5 دقائق باستخدام الذكاء الاصطناعي',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PUIUX Click',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PUIUX Click - بناء مواقع احترافية في دقائق',
    description:
      'بناء مواقع احترافية متعددة اللغات في 2-5 دقائق باستخدام الذكاء الاصطناعي',
    images: ['/og-image.png'],
    creator: '@puiux',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Arabic-first by default (MVP)
  // i18n will be added in Phase 2 with next-intl or custom implementation
  const locale = 'ar';
  const dir = 'rtl';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${inter.variable} ${tajawal.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  border: '1px solid var(--border)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
