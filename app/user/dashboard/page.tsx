import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useOrders } from "@/hooks/useOrders";

export default function UserDashboardPage() {
  const { orders, isLoading } = useOrders();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard do Usuário</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              R${" "}
              {orders
                .reduce((total, order) => total + order.total, 0)
                .toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}