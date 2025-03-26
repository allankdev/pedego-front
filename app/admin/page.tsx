'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    subscription: 'trial',
  });

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/auth/login'); // ou /unauthorized se quiser
    }
  }, [isLoading, user, router]);

  // Simulando chamadas de stats da API
  useEffect(() => {
    if (user?.id) {
      // Aqui você chamaria os endpoints reais:
      setStats({
        totalOrders: 12,
        totalProducts: 8,
        subscription: 'trial', // ou 'monthly' | 'annual'
      });
    }
  }, [user]);

  if (isLoading || !user) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Olá, {user?.store?.name || user.name} 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pedidos recebidos</p>
            <p className="text-2xl font-semibold">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Produtos cadastrados</p>
            <p className="text-2xl font-semibold">{stats.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Plano atual</p>
            <p className="text-2xl font-semibold capitalize">{stats.subscription}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button onClick={() => router.push('/admin/products')}>Gerenciar Produtos</Button>
        <Button onClick={() => router.push('/admin/orders')}>Ver Pedidos</Button>
        <Button variant="outline" onClick={() => router.push('/admin/upgrade')}>
          Fazer upgrade de plano
        </Button>
      </div>
    </div>
  );
}
