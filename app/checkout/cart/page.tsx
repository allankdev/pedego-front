'use client';

import { useCartStore } from '@/lib/store/cartStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CartPage() {
  const {
    items,
    total,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    applyCoupon,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleValidateCoupon = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/coupons/validate?code=${couponCode}`);
      const data = await res.json();
      if (!res.ok || !data.valid) throw new Error('Cupom inválido ou expirado');
      applyCoupon(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm">R$ {item.price.toFixed(2)} x {item.quantity}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button size="sm" onClick={() => decreaseQuantity(item.id)}>-</Button>
                <span>{item.quantity}</span>
                <Button size="sm" onClick={() => increaseQuantity(item.id)}>+</Button>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
              Remover
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center gap-2">
        <Input
          placeholder="Código do cupom"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <Button onClick={handleValidateCoupon} disabled={loading}>
          {loading ? 'Validando...' : 'Aplicar'}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between items-center mt-6">
        <p className="text-xl font-bold">Total: R$ {(total || 0).toFixed(2)}</p>
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
