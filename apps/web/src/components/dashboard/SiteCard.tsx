'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Edit,
  Trash2,
  Globe,
  Eye,
  MoreVertical,
  CheckCircle2,
  FileText,
  Archive,
} from 'lucide-react';
import type { Site } from '@/lib/api/sites';
import { deleteSite, publishSite, unpublishSite } from '@/lib/api/sites';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface SiteCardProps {
  site: Site;
  onDeleted: (siteId: string) => void;
  onUpdated: () => void;
}

export default function SiteCard({ site, onDeleted, onUpdated }: SiteCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handlePublishToggle = async () => {
    try {
      setIsToggling(true);
      if (site.status === 'PUBLISHED') {
        await unpublishSite(site.id);
        toast.success('تم إلغاء نشر الموقع بنجاح');
      } else {
        await publishSite(site.id);
        toast.success('تم نشر الموقع بنجاح 🎉');
      }
      onUpdated();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ');
    } finally {
      setIsToggling(false);
      setIsMenuOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا الموقع؟')) return;

    try {
      setIsDeleting(true);
      await deleteSite(site.id);
      toast.success('تم حذف الموقع بنجاح');
      onDeleted(site.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ');
      setIsDeleting(false);
    }
  };

  const statusConfig = {
    PUBLISHED: {
      label: 'منشور',
      icon: <CheckCircle2 className="h-3 w-3" />,
      color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
    },
    DRAFT: {
      label: 'مسودة',
      icon: <FileText className="h-3 w-3" />,
      color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    },
    ARCHIVED: {
      label: 'مؤرشف',
      icon: <Archive className="h-3 w-3" />,
      color: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30',
    },
  };

  const currentStatus = statusConfig[site.status as keyof typeof statusConfig] || statusConfig.DRAFT;

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-5 sm:p-6 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30"
    >
      {/* Color Preview Strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to right, ${site.colorPalette.primary}, ${site.colorPalette.secondary})`,
        }}
      />

      {/* Status Badge */}
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${currentStatus.color}`}
        >
          {currentStatus.icon}
          <span>{currentStatus.label}</span>
        </div>

        {/* More Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="المزيد"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-20 mt-2 w-48 rounded-xl border border-border/50 bg-background/95 p-1 shadow-xl backdrop-blur-xl"
                >
                  <button
                    onClick={handlePublishToggle}
                    disabled={isToggling}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-right transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <Globe className="h-4 w-4" />
                    <span>
                      {isToggling
                        ? 'جاري التحديث...'
                        : site.status === 'PUBLISHED'
                        ? 'إلغاء النشر'
                        : 'نشر الموقع'}
                    </span>
                  </button>

                  <Link href={`/sites/${site.id}/edit`}>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-right transition-colors hover:bg-muted">
                      <Edit className="h-4 w-4" />
                      <span>تعديل</span>
                    </button>
                  </Link>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-right text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{isDeleting ? 'جاري الحذف...' : 'حذف'}</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Site Info */}
      <div className="mb-4">
        <h3 className="mb-1 text-lg font-bold line-clamp-1">{site.businessName}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {site.description || 'لا يوجد وصف'}
        </p>
      </div>

      {/* Color Palette */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">الألوان:</span>
        <div className="flex gap-1.5">
          <div
            className="h-6 w-6 rounded-full ring-2 ring-background shadow-sm"
            style={{ backgroundColor: site.colorPalette.primary }}
            title={site.colorPalette.primary}
          />
          <div
            className="h-6 w-6 rounded-full ring-2 ring-background shadow-sm"
            style={{ backgroundColor: site.colorPalette.secondary }}
            title={site.colorPalette.secondary}
          />
          <div
            className="h-6 w-6 rounded-full ring-2 ring-background shadow-sm"
            style={{ backgroundColor: site.colorPalette.accent }}
            title={site.colorPalette.accent}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          <span>{site.viewCount.toLocaleString('ar-SA')} مشاهدة</span>
        </div>
        <div className="h-1 w-1 rounded-full bg-muted-foreground" />
        <div>{new Date(site.createdAt).toLocaleDateString('ar-SA')}</div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {site.status === 'PUBLISHED' && site.publishUrl && (
          <a
            href={site.publishUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-2.5 text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/5"
          >
            <ExternalLink className="h-4 w-4" />
            <span>زيارة</span>
          </a>
        )}

        <Link
          href={`/sites/${site.id}/edit`}
          className={`flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-2.5 text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/5 ${
            site.status === 'PUBLISHED' ? 'flex-1' : 'w-full'
          }`}
        >
          <Edit className="h-4 w-4" />
          <span>تعديل</span>
        </Link>
      </div>

      {/* URL Display */}
      {site.publishUrl && (
        <div className="mt-3 rounded-lg bg-muted/30 px-3 py-2">
          <p className="text-xs font-mono text-muted-foreground truncate">
            {site.publishUrl}
          </p>
        </div>
      )}
    </motion.div>
  );
}
