'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSite } from '@/lib/api/sites';
import Head from 'next/head';

interface ViewPageProps {
  params: {
    id: string;
  };
}

export default function ViewPage({ params }: ViewPageProps) {
  const router = useRouter();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadSite();
  }, [params.id]);

  const loadSite = async () => {
    try {
      setLoading(true);
      const data = await getSite(params.id);
      setSite(data);
    } catch (error) {
      console.error('Failed to load site:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderSite = () => {
    if (!site?.pages) return null;

    const grapesData = site.pages;
    const firstPage = grapesData.pages?.[0];
    if (!firstPage) return <div className="p-8 text-center">لا يوجد محتوى</div>;

    const frame = firstPage.frames?.[0];
    if (!frame) return <div className="p-8 text-center">لا يوجد محتوى</div>;

    const component = frame.component;

    // Build HTML
    let html = '';
    if (component?.components) {
      component.components.forEach((comp: any) => {
        if (comp.type === 'html' && comp.content) {
          html += comp.content;
        }
      });
    }

    // Build CSS
    let css = '';
    if (grapesData.styles && Array.isArray(grapesData.styles)) {
      grapesData.styles.forEach((style: any) => {
        if (style.style) {
          css += style.style;
        }
      });
    }

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xl font-bold">جاري تحميل موقعك...</p>
          <p className="mt-2 text-sm text-muted-foreground">صبراً، الموقع يتحمل</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-md text-center">
          <div className="mb-6 text-6xl">😔</div>
          <h1 className="mb-4 text-3xl font-bold">الموقع غير موجود</h1>
          <p className="mb-6 text-muted-foreground">
            عذراً، لم نتمكن من العثور على هذا الموقع
          </p>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{site.name} - PUIUX Click</title>
        <meta name="description" content={site.description || site.name} />
        <meta property="og:title" content={site.name} />
        <meta property="og:description" content={site.description || site.name} />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
        {renderSite()}

        {/* PUIUX Branding Badge */}
        <div className="fixed bottom-4 right-4 z-50">
          <a
            href="https://puiuxclick.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white/95 px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-sm transition-all hover:border-primary hover:shadow-xl"
          >
            <span>مصنوع بـ</span>
            <img
              src="https://puiux.com/wp-content/uploads/2021/09/Logo-Black-Copress.svg"
              alt="PUIUX"
              className="h-3"
            />
            <span className="font-bold">Click</span>
          </a>
        </div>
      </div>
    </>
  );
}
