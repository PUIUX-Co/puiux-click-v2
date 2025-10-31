'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSite, updateSite, type Site } from '@/lib/api/sites';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowLeft, Save, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GrapesJSEditor from '@/components/editor/GrapesJSEditor';

export default function EditSitePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load site data
  useEffect(() => {
    if (isAuthenticated && params.id) {
      loadSite();
    }
  }, [isAuthenticated, params.id]);

  const loadSite = async () => {
    try {
      setLoading(true);
      const siteData = await getSite(params.id as string);
      setSite(siteData);
    } catch (error: any) {
      console.error('Failed to load site:', error);
      toast.error('فشل تحميل الموقع');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (pages: any) => {
    if (!site) return;

    try {
      setSaving(true);
      await updateSite(site.id, { pages });
      toast.success('تم حفظ التغييرات بنجاح');
    } catch (error: any) {
      console.error('Failed to save site:', error);
      toast.error(error.response?.data?.message || 'فشل حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (site?.publishUrl) {
      window.open(site.publishUrl, '_blank');
    } else {
      toast.error('الموقع غير منشور بعد');
    }
  };

  if (loading || !site) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur-xl">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>

          <div className="hidden h-6 w-px bg-border/50 sm:block" />

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/25">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">
                محرر PUIUX Click
              </p>
              <p className="text-xs text-muted-foreground">{site.businessName}</p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            className="flex h-8 items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">معاينة</span>
          </button>

          <button
            onClick={() => {
              const editor = (window as any).grapesEditorInstance;
              if (editor) {
                const pages = editor.getProjectData();
                handleSave(pages);
              }
            }}
            disabled={saving}
            className="flex h-8 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </span>
          </button>
        </div>
      </header>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <GrapesJSEditor
          site={site}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
