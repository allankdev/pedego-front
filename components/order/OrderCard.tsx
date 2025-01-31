interface OrderCardProps {
    id: string;
    customerName: string;
    total: number;
    status: string;
  }
  
  export const OrderCard = ({ id, customerName, total, status }: OrderCardProps) => {
    return (
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-bold">Pedido #{id}</h3>
        <p className="text-sm text-gray-600">Cliente: {customerName}</p>
        <p className="text-sm text-gray-600">Total: R$ {total.toFixed(2)}</p>
        <p className="text-sm text-gray-600">Status: {status}</p>
      </div>
    );
  };