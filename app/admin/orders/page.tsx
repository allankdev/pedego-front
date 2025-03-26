'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = document.cookie.split('token=')[1];
      const res = await fetch('http://localhost:3000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    };

    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold">Pedidos recebidos</h2>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <p className="text-sm">Pedido #{order.id}</p>
                <p>Cliente: {order.customerName}</p>
                <p>Status: {order.status}</p>
                <p className="text-sm text-muted-foreground">
                  Criado em: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
