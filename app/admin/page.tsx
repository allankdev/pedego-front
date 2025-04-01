'use client';

import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { stats, loading, storeStatus, toggleStoreStatus } = useDashboardStats();

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    router.push('/auth/login');
    return null;
  }

  return (
    <DashboardLayout
      user={user}
      stats={stats}
      storeStatus={storeStatus}
      toggleStoreStatus={toggleStoreStatus}
      loading={loading}
    />
  );
}
