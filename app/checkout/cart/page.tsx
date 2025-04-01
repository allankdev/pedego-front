'use client';

import { useCartStore } from '@/lib/store/cartStore';
import { useCoupon } from '@/hooks/useCoupon';
import { useRouter } from 'next/navigation';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const {
    items,
    total,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStore();

  const {
    couponCode,
    setCouponCode,
    loading,
    error,
    discount,
    validateCoupon,
  } = useCoupon();

  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Sacola vazia 🛒</h2>
        <Button onClick={() => router.push('/')}>Voltar para produtos</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🛒 Sacola</h1>

      {error && <p className="text-red-500">{error}</p>}

      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onIncrease={() => increaseQuantity(item.id)}
          onDecrease={() => decreaseQuantity(item.id)}
          onRemove={() => removeItem(item.id)}
        />
      ))}

      <div className="flex items-center gap-2">
        <Input
          placeholder="Código do cupom"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <Button onClick={validateCoupon} disabled={loading}>
          {loading ? 'Validando...' : 'Aplicar'}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between items-center mt-6">
        <p className="text-xl font-bold">
          Total: R$ {(total - discount).toFixed(2)}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button onClick={() => router.push('/checkout/identify')}>
            Avançar
          </Button>
        </div>
      </div>
    </div>
  );
}
