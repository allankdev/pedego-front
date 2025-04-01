'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { CouponForm } from '@/components/admin/CouponForm';

export default function CouponsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  if (!user?.store?.id) return null;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold">Cupons de Desconto</h2>
      <CouponForm />
    </div>
  );
}
