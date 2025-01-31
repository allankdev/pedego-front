import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePayments } from "@/hooks/usePayments";

export default function PaymentsPage() {
  const { payments, isLoading } = usePayments();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pagamentos</h1>
      <div className="space-y-4">
        {payments.map((payment: any) => (
          <div key={payment.id} className="p-4 border rounded-lg">
            <p><strong>ID:</strong> {payment.id}</p>
            <p><strong>Valor:</strong> R$ {payment.amount.toFixed(2)}</p>
            <p><strong>Status:</strong> {payment.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}