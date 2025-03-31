'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { authStore } from '@/lib/store/authStore';

export default function CouponsPage() {
  const { user, isLoading } = useAuth();
  const { setUser } = authStore();
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);  // Inicializa como array vazio
  const [loading, setLoading] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    expiresAt: ''
  });
  const [editCoupon, setEditCoupon] = useState<any | null>(null);  // Para armazenar o cupom sendo editado
  const [error, setError] = useState<string | null>(null);

  // Verifica se o usuário está autenticado e possui a role ADMIN
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  // Fetching coupons from the backend
  const fetchCoupons = async () => {
    const token = document.cookie.split('token=')[1];
    const subdomain = user?.store?.subdomain;
    if (!subdomain) return;

    const res = await fetch(`http://localhost:3000/api/coupons/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.message || 'Erro ao buscar cupons');
      return;
    }

    const data = await res.json();

    // Certificando que data seja um array
    if (Array.isArray(data)) {
      setCoupons(data);
    } else {
      console.error("Erro: Dados de cupons não são um array", data);
      setError("Erro ao obter os cupons. Tente novamente.");
    }
  };

  useEffect(() => {
    if (user?.store?.subdomain) fetchCoupons();
  }, [user]);

  // Criar cupons
  const createCoupon = async () => {
    setLoading(true);
    setError(null); // Limpa o erro antes de tentar salvar

    const token = document.cookie.split('token=')[1];
    const subdomain = user?.store?.subdomain;
    if (!subdomain || !newCoupon.code || !newCoupon.discount || !newCoupon.expiresAt) return;

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

  // Editar cupom
  const editCouponData = (coupon: any) => {
    setEditCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      discount: coupon.discount,
      expiresAt: coupon.expiresAt,
    });
  };

  const updateCoupon = async () => {
    setLoading(true);
    setError(null);

    const token = document.cookie.split('token=')[1];
    const subdomain = user?.store?.subdomain;
    if (!subdomain || !newCoupon.code || !newCoupon.discount || !newCoupon.expiresAt) return;

    const res = await fetch(`http://localhost:3000/api/coupons/${editCoupon.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...newCoupon,
      }),
    });

    if (res.ok) {
      const updatedCoupon = await res.json();
      setCoupons(coupons.map(coupon => coupon.id === updatedCoupon.id ? updatedCoupon : coupon));
      setNewCoupon({ code: '', discount: 0, expiresAt: '' });
      setEditCoupon(null); // Resetar após edição
    } else {
      const errorData = await res.json();
      setError(errorData.message || 'Erro ao editar o cupom');
    }

    setLoading(false);
  };

  // Deletar cupons
  const deleteCoupon = async (id: string) => {  // Mudei o tipo para 'string' para corresponder à API
    setLoading(true);
    const token = document.cookie.split('token=')[1];
    const res = await fetch(`http://localhost:3000/api/coupons/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setCoupons(coupons.filter(coupon => coupon.id !== id));
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">Cupons de Desconto</h2>

      {error && <p className="text-red-500">{error}</p>} {/* Exibindo erro, se houver */}

      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label>{editCoupon ? 'Editar Cupom' : 'Criar Novo Cupom'}</Label>
            <div className="flex gap-2">
              <Input
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                placeholder="Digite o código do cupom"
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
                placeholder="Data de Expiração"
              />
              <Button onClick={editCoupon ? updateCoupon : createCoupon} disabled={loading || !newCoupon.code || !newCoupon.discount || !newCoupon.expiresAt}>
                {loading ? 'Salvando...' : editCoupon ? 'Salvar Alterações' : 'Criar Cupom'}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Cupons Criados</h3>
            <ul className="space-y-2">
              {coupons && Array.isArray(coupons) && coupons.map((coupon) => (
                <li key={coupon.id} className="flex justify-between items-center">
                  <span>{coupon.code} - {coupon.discount}% - Expira em: {coupon.expiresAt}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => editCouponData(coupon)}
                    >
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
    </div>
  );
}
