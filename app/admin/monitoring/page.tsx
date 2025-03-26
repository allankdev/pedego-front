'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MonitoringPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  useEffect(() => {
    if (!isLoading && user?.role !== 'SUPER_ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = document.cookie.split('token=')[1];
        const res = await fetch('http://localhost:3000/api/subscriptions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // Se vier data.data, pega de lá. Senão, usa direto.
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
        setLoadingStores(false);
      }
    };

    if (user?.role === 'SUPER_ADMIN') fetchStores();
  }, [user]);

  const handleSuspend = async (userId: string) => {
    alert(`Suspender lógica futura para userId: ${userId}`);
  };

  const handleDelete = async (userId: string) => {
    alert(`Deletar lógica futura para userId: ${userId}`);
  };

  if (isLoading || loadingStores) {
    return <p className="text-center mt-10">Carregando lojas...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Monitoramento de Lojas</h2>

      {stores.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma loja cadastrada.</p>
      ) : (
        <div className="space-y-4">
          {stores.map((store) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
