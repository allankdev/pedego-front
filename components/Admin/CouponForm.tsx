'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Cookie from 'js-cookie';

export function CouponForm() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    expiresAt: '',
  });
  const [editCoupon, setEditCoupon] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = async () => {
    const token = Cookie.get('token');
    if (!token || !user?.store?.subdomain) return;

    const res = await fetch(`http://localhost:3000/api/coupons`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.message || 'Erro ao buscar cupons');
      return;
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      setCoupons(data);
    } else {
      setError("Erro ao obter os cupons. Tente novamente.");
    }
  };

  useEffect(() => {
    if (user?.store?.subdomain) fetchCoupons();
  }, [user]);

  const createCoupon = async () => {
    setLoading(true);
    setError(null);
    const token = Cookie.get('token');
    if (!token || !user?.store?.id) return;

    const res = await fetch(`http://localhost:3000/api/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...newCoupon,
        storeId: user.store.id,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setCoupons([...coupons, data]);
      setNewCoupon({ code: '', discount: 0, expiresAt: '' });
    } else {
      const errorData = await res.json();
      setError(errorData.message || 'Erro ao criar o cupom');
    }
    setLoading(false);
  };

  const updateCoupon = async () => {
    setLoading(true);
    setError(null);
    const token = Cookie.get('token');
    if (!token || !editCoupon?.id) return;

    const res = await fetch(`http://localhost:3000/api/coupons/${editCoupon.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...newCoupon }),
    });

    if (res.ok) {
      const updated = await res.json();
      setCoupons((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setEditCoupon(null);
      setNewCoupon({ code: '', discount: 0, expiresAt: '' });
    } else {
      const errorData = await res.json();
      setError(errorData.message || 'Erro ao editar o cupom');
    }

    setLoading(false);
  };

  const deleteCoupon = async (id: string) => {
    setLoading(true);
    const token = Cookie.get('token');
    if (!token) return;

    const res = await fetch(`http://localhost:3000/api/coupons/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
    setLoading(false);
  };

  const handleEdit = (coupon: any) => {
    setEditCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      discount: coupon.discount,
      expiresAt: coupon.expiresAt,
    });
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <Label className="block mb-1">{editCoupon ? 'Editar Cupom' : 'Criar Novo Cupom'}</Label>
          <div className="flex flex-wrap gap-2">
            <Input
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
              placeholder="Código"
            />
            <Input
              type="number"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseInt(e.target.value, 10) })}
              placeholder="Desconto (%)"
            />
            <Input
              type="date"
              value={newCoupon.expiresAt}
              onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
            />
            <Button
              onClick={editCoupon ? updateCoupon : createCoupon}
              disabled={loading || !newCoupon.code || !newCoupon.discount || !newCoupon.expiresAt}
            >
              {loading ? 'Salvando...' : editCoupon ? 'Salvar Alterações' : 'Criar Cupom'}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div>
          <h3 className="text-lg font-semibold">Cupons Criados</h3>
          <ul className="space-y-2">
            {coupons.map((coupon) => (
              <li key={coupon.id} className="flex justify-between items-center border p-2 rounded-md">
                <span>{coupon.code} - {coupon.discount}% - expira em {coupon.expiresAt}</span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(coupon)}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteCoupon(coupon.id.toString())}
                    disabled={loading}
                  >
                    {loading ? 'Excluindo...' : 'Excluir'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
