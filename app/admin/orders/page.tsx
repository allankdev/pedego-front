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

  const handleAdvance = async (orderId: number) => {
    const token = document.cookie.split('token=')[1];
    const currentStatus = orders.find((o) => o.id === orderId)?.status;

    const nextStatus =
      currentStatus === 'pendente' ? 'em_producao' :
      currentStatus === 'em_producao' ? 'entregue' :
      null;

    if (!nextStatus) return;

    await fetch(`http://localhost:3000/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );
  };

  const handleCancel = async (orderId: number) => {
    const token = document.cookie.split('token=')[1];
    await fetch(`http://localhost:3000/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold">📋 Pedidos Recebidos</h2>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Pedido #{order.id} • {new Date(order.createdAt).toLocaleString()}
                </p>
                <p><strong>Cliente:</strong> {order.customerName}</p>
                <p><strong>Telefone:</strong> {order.customerPhone}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="capitalize">{order.status.replace('_', ' ')}</span>
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Ver pedido
                  </button>

                  {order.status === 'pendente' && (
                    <>
                      <button
                        onClick={() => handleAdvance(order.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        Produzir
                      </button>
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  {order.status === 'em_producao' && (
                    <button
                      onClick={() => handleAdvance(order.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      Marcar como entregue
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
