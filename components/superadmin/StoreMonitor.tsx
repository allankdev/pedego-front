'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Cookie from 'js-cookie';
import { useAuth } from '@/hooks/useAuth';

export function StoreMonitor() {
  const { user } = useAuth();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      const token = Cookie.get('token');
      const res = await fetch('http://localhost:3000/api/subscriptions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const formatted = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [];

      setStores(formatted);
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      fetchStores();
    }
  }, [user]);

  const handleSuspend = (userId: string) => {
    alert(`Suspender lógica futura para userId: ${userId}`);
  };

  const handleDelete = (userId: string) => {
    alert(`Deletar lógica futura para userId: ${userId}`);
  };

  if (loading) {
    return <p className="text-center mt-10">Carregando lojas...</p>;
  }

  return (
    <div className="space-y-4">
      {stores.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma loja cadastrada.</p>
      ) : (
        stores.map((store) => (
          <Card key={store.id}>
            <CardContent className="p-4 space-y-1">
              <p className="text-lg font-semibold">{store.storeName}</p>
              <p className="text-sm text-muted-foreground">Subdomínio: {store.subdomain}</p>
              <p className="text-sm">Plano: {store.plan}</p>
              <p className="text-sm">
                Expira em: {store.expiresAt ? new Date(store.expiresAt).toLocaleDateString() : 'n/d'}
              </p>

              <div className="flex gap-2 pt-2">
                <Button variant="destructive" onClick={() => handleSuspend(store.userId)}>
                  Suspender
                </Button>
                <Button variant="outline" onClick={() => handleDelete(store.userId)}>
                  Deletar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
