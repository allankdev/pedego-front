// hooks/useCoupon.ts
import { useState } from 'react';
import { useCartStore } from '@/lib/store/cartStore';

export function useCoupon() {
  const { applyCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [discount, setDiscount] = useState(0);

  const validateCoupon = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3000/api/coupons/validate?code=${couponCode}`);
      const data = await res.json();
      if (!res.ok || !data.discount) throw new Error('Cupom inválido ou expirado');
      applyCoupon(data);
      setDiscount(data.discount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { couponCode, setCouponCode, loading, error, discount, validateCoupon };
}
