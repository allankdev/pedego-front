import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useOrder } from "@/hooks/useOrders";
import Link from "next/link";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { order, isLoading } = useOrder(id as string);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Detalhes do Pedido</h1>
      <div className="space-y-4">
        <p><strong>ID:</strong> {order.id}</p>
        <p><strong>Cliente:</strong> {order.customerName}</p>
        <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Itens:</strong></p>
        <ul>
          {order.items.map((item: any) => (
            <li key={item.id}>
              {item.name} - {item.quantity}x R$ {item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <Link href="/orders">
          <Button>Voltar</Button>
        </Link>
      </div>
    </div>
  );
}