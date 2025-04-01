'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { OrderStatusTracker } from '@/components/order/OrderStatusTracker';

type Order = {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  deliveryType: string;
  paymentMethod: string;
  observations?: string;
  status: 'pendente' | 'em_producao' | 'entregue' | 'cancelado';
  items: { product: { name: string } | null; quantity: number }[];
};

export default function PedidoPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // Atualiza a cada 10s
    return () => clearInterval(interval);
  }, [id]);

  if (loading || !order) {
    return <div className="p-6 text-center">Carregando pedido...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-xl font-bold mb-2">🔎 Pedido #{order.id}</h1>

      {/* Dados do cliente */}
      <div className="mb-4">
        <p><strong>Nome:</strong> {order.customerName}</p>
        <p><strong>Telefone:</strong> {order.customerPhone}</p>
        <p><strong>Entrega:</strong> {order.deliveryType}</p>
        <p><strong>Pagamento:</strong> {order.paymentMethod}</p>
        {order.customerAddress && <p><strong>Endereço:</strong> {order.customerAddress}</p>}
        {order.observations && <p><strong>Obs:</strong> {order.observations}</p>}
      </div>

      {/* Rastreamento do status */}
      <OrderStatusTracker status={order.status} />

      {/* Itens do pedido */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">🧾 Itens:</h2>
        <ul className="list-disc list-inside">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.quantity}x {item.product?.name || <em className="text-gray-500">Produto removido</em>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
