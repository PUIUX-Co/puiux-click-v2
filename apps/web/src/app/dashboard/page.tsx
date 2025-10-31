'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  LogOut,
  User,
  Building2,
  Crown,
  Sparkles,
  Settings,
  Plus,
  LayoutGrid,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/25">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                PUIUX Click
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-4 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="rounded-xl border border-border/50 bg-background/50 p-2 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              >
                <LogOut className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">مرحباً، {user.name}! 👋</h1>
          <p className="text-muted-foreground">ابدأ في بناء موقعك الاحترافي الآن</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Building2 className="h-6 w-6" />}
            label="المنظمة"
            value={user.organizationId.slice(0, 8) + '...'}
            delay={0.1}
          />
          <StatCard
            icon={<Crown className="h-6 w-6" />}
            label="الدور"
            value={user.role === 'USER' ? 'مستخدم' : user.role}
            delay={0.2}
          />
          <StatCard
            icon={<LayoutGrid className="h-6 w-6" />}
            label="المواقع"
            value="0"
            delay={0.3}
          />
          <StatCard
            icon={<Settings className="h-6 w-6" />}
            label="الحالة"
            value="نشط"
            delay={0.4}
            highlight
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-3xl border border-border/50 bg-background/50 p-8 shadow-xl backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold mb-6">إجراءات سريعة</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              icon={<Plus className="h-6 w-6" />}
              title="إنشاء موقع جديد"
              description="ابدأ في بناء موقعك الآن"
              gradient="from-primary to-purple-600"
            />
            <ActionCard
              icon={<LayoutGrid className="h-6 w-6" />}
              title="مواقعي"
              description="عرض جميع مواقعك"
              gradient="from-blue-500 to-cyan-500"
            />
            <ActionCard
              icon={<Settings className="h-6 w-6" />}
              title="الإعدادات"
              description="إدارة حسابك"
              gradient="from-orange-500 to-red-500"
            />
          </div>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 rounded-3xl border border-border/50 bg-background/50 p-8 shadow-xl backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold mb-6">معلومات الحساب</h2>

          <div className="space-y-4">
            <InfoRow label="المعرف" value={user.id} />
            <InfoRow label="الاسم" value={user.name} />
            <InfoRow label="البريد الإلكتروني" value={user.email} />
            <InfoRow label="الدور" value={user.role} />
            <InfoRow label="معرف المنظمة" value={user.organizationId} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  delay,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className={`rounded-2xl border ${
        highlight
          ? 'border-primary/50 bg-primary/5'
          : 'border-border/50 bg-background/50'
      } p-6 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl`}
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
          highlight
            ? 'bg-primary/20 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {icon}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}

// Action Card Component
function ActionCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-6 text-right transition-all hover:border-primary/50 hover:shadow-lg"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>

      {/* Hover gradient effect */}
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-br ${gradient} opacity-0 transition-opacity group-hover:opacity-5`}
      />
    </motion.button>
  );
}

// Info Row Component
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/30 p-4">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-mono">{value}</span>
    </div>
  );
}
