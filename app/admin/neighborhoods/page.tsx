'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { NeighborhoodForm } from '@/components/admin/NeighborhoodForm';

export default function NeighborhoodsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  if (!user?.store?.id) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Bairros e Taxas de Entrega</h2>
      <NeighborhoodForm />
    </div>
  );
}
