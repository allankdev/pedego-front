import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useOrders } from "@/hooks/useOrders";
import { useStores } from "@/hooks/useStores";
import { useUsers } from "@/hooks/useUsers";

export default function AdminDashboardPage() {
  const { orders, isLoading: isOrdersLoading } = useOrders();
  const { stores, isLoading: isStoresLoading } = useStores();
  const { users, isLoading: isUsersLoading } = useUsers();

  if (isOrdersLoading || isStoresLoading || isUsersLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Global</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de Restaurantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stores.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}