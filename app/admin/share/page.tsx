'use client';

import { StoreShareCard } from '@/components/admin/StoreShareCard';

export default function SharePage() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Compartilhe sua Loja</h1>
      <StoreShareCard />
    </div>
  );
}
