'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { StoreMonitor } from '@/components/superadmin/StoreMonitor';

export default function MonitoringPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'SUPER_ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  if (!user?.store?.id && isLoading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Monitoramento de Lojas</h2>
      <StoreMonitor />
    </div>
  );
}
