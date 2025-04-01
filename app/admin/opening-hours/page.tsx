'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { OpeningHourForm } from '@/components/admin/OpeningHourForm';

export default function OpeningHoursPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  if (!user?.store?.id) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Horários de Funcionamento</h2>
      <OpeningHourForm />
    </div>
  );
}
