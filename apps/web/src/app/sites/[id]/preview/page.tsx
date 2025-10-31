'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Tablet,
  Share2,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  QrCode,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getSite } from '@/lib/api/sites';
import Image from 'next/image';

interface PreviewPageProps {
  params: {
    id: string;
  };
}

type ViewMode = 'mobile' | 'tablet' | 'desktop';

export default function PreviewPage({ params }: PreviewPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/sites/${params.id}/preview`);
      return;
    }

    loadSite();
  }, [isAuthenticated, params.id, router]);

  const loadSite = async () => {
    try {
      setLoading(true);
      const data = await getSite(params.id);
      setSite(data);
    } catch (error) {
      console.error('Failed to load site:', error);
      toast.error('فشل تحميل الموقع');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getPreviewUrl = () => {
    if (!site) return '';

    // If published, use public URL
    if (site.isPublished && site.subdomain) {
      return `https://${site.subdomain}.puiuxclick.com`;
    }

    // Otherwise, preview URL
    return `${window.location.origin}/sites/${site.id}/view`;
  };

  const handleCopyLink = async () => {
    const url = getPreviewUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('تم نسخ الرابط!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('فشل نسخ الرابط');
    }
  };

  const handleOpenInNewTab = () => {
    const url = getPreviewUrl();
    window.open(url, '_blank');
  };

  const getViewportSize = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: 375, height: 667 };
      case 'tablet':
        return { width: 768, height: 1024 };
      case 'desktop':
        return { width: 1440, height: 900 };
    }
  };

  const renderSiteContent = () => {
    if (!site?.pages) return null;

    // Extract HTML from GrapesJS format
    const grapesData = site.pages;

    // Get the first page's HTML
    const firstPage = grapesData.pages?.[0];
    if (!firstPage) return <div className="p-8 text-center">لا يوجد محتوى</div>;

    // Extract HTML from frames
    const frame = firstPage.frames?.[0];
    if (!frame) return <div className="p-8 text-center">لا يوجد محتوى</div>;

    // Get component HTML
    const component = frame.component;

    // Build HTML string
    let html = '';
    if (component?.components) {
      component.components.forEach((comp: any) => {
        if (comp.type === 'html' && comp.content) {
          html += comp.content;
        }
      });
    }

    // Get styles
    let css = '';
    if (grapesData.styles && Array.isArray(grapesData.styles)) {
      grapesData.styles.forEach((style: any) => {
        if (style.style) {
          css += style.style;
        }
      });
    }

    return (
      <div className="h-full w-full overflow-auto bg-white">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-lg text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return null;
  }

  const viewport = getViewportSize();

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back + Site Info */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/sites/${params.id}/edit`)}
              className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>العودة للمحرر</span>
            </motion.button>

            <div className="flex items-center gap-3">
              <Image
                src="https://puiux.com/wp-content/uploads/2021/09/Logo-Black-Copress.svg"
                alt="PUIUX Logo"
                width={50}
                height={16}
                className="h-4 w-auto"
              />
              <div className="h-4 w-px bg-gray-300" />
              <div>
                <h1 className="font-bold text-sm">{site.name}</h1>
                <p className="text-xs text-muted-foreground">معاينة الموقع</p>
              </div>
            </div>
          </div>

          {/* Center: View Mode Toggles */}
          <div className="flex items-center gap-2 rounded-lg border bg-gray-100 p-1">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'mobile'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="موبايل (375px)"
            >
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">موبايل</span>
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'tablet'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="تابلت (768px)"
            >
              <Tablet className="h-4 w-4" />
              <span className="hidden sm:inline">تابلت</span>
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'desktop'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="سطح المكتب (1440px)"
            >
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">سطح المكتب</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">نسخ الرابط</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR Code</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">فتح في نافذة جديدة</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-8">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-lg border-4 border-gray-300 bg-white shadow-2xl"
          style={{
            width: Math.min(viewport.width, window.innerWidth - 100),
            height: Math.min(viewport.height, window.innerHeight - 200),
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 border-b bg-gray-100 px-3 py-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 rounded bg-white px-3 py-1 text-xs text-gray-600">
              {getPreviewUrl()}
            </div>
          </div>

          {/* Site Content */}
          <div className="h-full overflow-auto">
            {renderSiteContent()}
          </div>

          {/* Viewport Size Indicator */}
          <div className="absolute bottom-4 right-4 rounded-lg bg-black/75 px-3 py-1 text-xs font-mono text-white backdrop-blur-sm">
            {viewport.width} × {viewport.height}
          </div>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowQR(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl bg-white p-8 shadow-2xl"
          >
            <h3 className="mb-4 text-center text-xl font-bold">
              امسح الـ QR Code
            </h3>
            <div className="mb-4 rounded-lg border p-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getPreviewUrl())}`}
                alt="QR Code"
                className="h-64 w-64"
              />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              امسح الكود لفتح الموقع على هاتفك
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
