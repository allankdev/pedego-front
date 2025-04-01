'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UpgradePlans } from '@/components/admin/UpgradePlans';

export default function UpgradePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/auth/login');
      } else {
        const t = document.cookie.split('token=')[1];
        setToken(t);
      }
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return <p className="p-4">Carregando autenticação...</p>;

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-center">Escolha um plano</h2>
      <UpgradePlans token={token} />
    </div>
  );
}
