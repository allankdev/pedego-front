// app/checkout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/checkout/cart');
  }, [router]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-lg text-muted-foreground">Redirecionando para sua sacola...</h1>
    </div>
  );
}
