'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { StoreSettingsForm } from '@/components/admin/StoreSettingsForm';

export default function StoreSettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user?.store) {
    return <p className="p-4">Carregando...</p>;
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">Configurações da Loja</h2>
      <StoreSettingsForm />
    </div>
  );
}
