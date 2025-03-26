'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { ShoppingCart } from 'lucide-react';

export default function FloatingCart() {
  const { items } = useCartStore();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) return null;

  return (
    <Link href="/checkout">
      <div className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg cursor-pointer hover:scale-105 transition">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          <span>{items.length} itens</span>
          <span className="font-bold">R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
