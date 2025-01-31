import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";

export default function StoreDashboardPage() {
  const { orders, isLoading: isOrdersLoading } = useOrders();
  const { products, isLoading: isProductsLoading } = useProducts();

  if (isOrdersLoading || isProductsLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard do Restaurante</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Produtos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
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