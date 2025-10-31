'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getSites, getSiteStats, type Site, type SiteStats } from '@/lib/api/sites';
import {
  Plus,
  Globe,
  TrendingUp,
  FileText,
  Eye,
  Loader2,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteCard from '@/components/dashboard/SiteCard';
import EmptyState from '@/components/dashboard/EmptyState';
import BuilderSelectionDialog from '@/components/dashboard/BuilderSelectionDialog';

export default function DashboardPage() {
  const { user, logout, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBuilderDialog, setShowBuilderDialog] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    // Check localStorage directly for faster auth check
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!authLoading && !isAuthenticated && !token) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // Only load data when user is fully loaded and authenticated
    if (isAuthenticated && user && !authLoading) {
      loadData();
    }
  }, [isAuthenticated, user, authLoading]);

  const loadData = async () => {
    // Double check token exists before making API calls
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token || !user) {
      console.log('Skipping loadData: no token or user');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [sitesData, statsData] = await Promise.all([
        getSites(),
        getSiteStats(),
      ]);
      setSites(sitesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSiteDeleted = (siteId: string) => {
    setSites((prev) => prev.filter((site) => site.id !== siteId));
    loadData(); // Reload stats
  };

  const handleSiteUpdated = () => {
    loadData(); // Reload all data
  };

  const handleLogout = async () => {
    await logout();
  };

  if (authLoading || loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/25">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                PUIUX Click
              </span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-border/50 bg-background/50 px-2 sm:px-4 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="rounded-xl border border-border/50 bg-background/50 p-2 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                aria-label="تسجيل الخروج"
              >
                <LogOut className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-border/40 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold">
                مرحباً، {user.name} 👋
              </h1>
              <p className="mt-2 text-muted-foreground">
                إدارة مواقعك بسهولة واحترافية
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBuilderDialog(true)}
              className="group flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-6 sm:px-8 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <Plus className="h-5 w-5" />
              <span>إنشاء موقع جديد</span>
              <Sparkles className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4"
          >
            <StatCard
              icon={<Globe className="h-5 w-5 sm:h-6 sm:w-6" />}
              label="إجمالي المواقع"
              value={stats.total}
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />}
              label="منشورة"
              value={stats.published}
              color="from-green-500 to-emerald-500"
            />
            <StatCard
              icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
              label="مسودات"
              value={stats.draft}
              color="from-yellow-500 to-orange-500"
            />
            <StatCard
              icon={<Eye className="h-5 w-5 sm:h-6 sm:w-6" />}
              label="المشاهدات"
              value={stats.totalViews}
              color="from-purple-500 to-pink-500"
            />
          </motion.div>
        )}

        {/* Sites Grid */}
        {sites.length === 0 ? (
          <EmptyState onCreateClick={() => setShowBuilderDialog(true)} />
        ) : (
          <div>
            <h2 className="mb-6 text-lg sm:text-xl font-semibold">
              مواقعك ({sites.length})
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {sites.map((site, index) => (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <SiteCard
                      site={site}
                      onDeleted={handleSiteDeleted}
                      onUpdated={handleSiteUpdated}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>

      {/* Builder Selection Dialog */}
      <BuilderSelectionDialog
        open={showBuilderDialog}
        onOpenChange={setShowBuilderDialog}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/50 bg-background/50 p-4 sm:p-6 backdrop-blur-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3 sm:gap-0">
        <div className="flex-1 w-full">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold">{value.toLocaleString('ar-SA')}</p>
        </div>
        <div
          className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>

      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-br ${color} opacity-[0.03]`}
      />
    </motion.div>
  );
}
