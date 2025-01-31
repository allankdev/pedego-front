import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const handleCheckout = async () => {
    // Simula o processo de checkout
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cart }),
    });
    const data = await response.json();
    if (data.success) {
      clearCart();
      alert("Pedido realizado com sucesso!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="space-y-4">
        <div>
          <Label>Nome</Label>
          <Input name="name" required />
        </div>
        <div>
          <Label>Endereço</Label>
          <Input name="address" required />
        </div>
        <div>
          <Label>Cartão de Crédito</Label>
          <Input name="creditCard" required />
        </div>
        <Button onClick={handleCheckout}>Finalizar Compra</Button>
      </div>
    </div>
  );
}