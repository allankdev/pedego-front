'use client';

import { useCartStore } from '@/lib/store/cartStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ConfirmCheckoutPage() {
  const {
    items,
    customerInfo,
    coupon,
    updateCustomerInfo,
    clearCart,
    total,
  } = useCartStore();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'entrega' | 'retirada' | ''>(customerInfo?.deliveryType || '');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'dinheiro' | 'cartao' | ''>(customerInfo?.paymentMethod || '');
  const [address, setAddress] = useState(customerInfo?.address || '');
  const [observations, setObservations] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon ? subtotal * (coupon.discountPercentage / 100) : 0;
  const finalTotal = subtotal - discount;

  const handleSubmit = async () => {
    if (!customerInfo) return;

    updateCustomerInfo({
      ...customerInfo,
      deliveryType,
      paymentMethod,
      address,
    });

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email || '',
          customerPhone: customerInfo.phone,
          customerAddress: deliveryType === 'entrega' ? address : '',
          deliveryType,
          paymentMethod,
          observations,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error('Erro ao fazer pedido');
      alert('✅ Pedido realizado com sucesso!');
      clearCart();
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Erro ao finalizar pedido');
    } finally {
      setLoading(false);
    }
  };

  const selectableBox = (label: string, selected: boolean, onClick: () => void, description?: string) => (
    <div
      onClick={onClick}
      className={`border rounded-xl p-4 cursor-pointer ${selected ? 'border-black bg-muted' : 'border-gray-300'}`}
    >
      <p className="font-semibold">{label}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold">Finalizar pedido</h1>

      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Este pedido será entregue a:</p>
            <p className="font-semibold">{customerInfo?.name}</p>
            <p className="text-sm">{customerInfo?.phone}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => router.push('/checkout/identify')}>
            Trocar
          </Button>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">Escolha a forma de entrega</h2>
          {selectableBox('Cadastrar endereço', deliveryType === 'entrega', () => setDeliveryType('entrega'))}
          {deliveryType === 'entrega' && (
            <Input
              placeholder="Endereço para entrega"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2"
            />
          )}
          {selectableBox(
            'Retirar no estabelecimento',
            deliveryType === 'retirada',
            () => setDeliveryType('retirada'),
            'Av. Manoel Morais, 175 - Manaíra, João Pessoa - PB'
          )}
        </div>

        <div className="space-y-2 mt-4">
          <h2 className="font-semibold">Escolha a forma de pagamento</h2>
          {selectableBox('Dinheiro', paymentMethod === 'dinheiro', () => setPaymentMethod('dinheiro'))}
          {selectableBox('Cartão (Crédito/Débito/PIX)', paymentMethod === 'cartao', () => setPaymentMethod('cartao'))}
        </div>

        <div className="space-y-1 mt-4">
          <h2 className="font-semibold">Observações</h2>
          <Input
            placeholder="Ex: Apertar campainha, não buzinar, etc."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        {coupon && (
          <div className="flex justify-between text-green-600">
            <span>Desconto ({coupon.code})</span>
            <span>- R$ {discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>R$ {finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full mt-2"
        onClick={handleSubmit}
        disabled={loading || !deliveryType || !paymentMethod}
      >
        {loading ? 'Enviando...' : 'Fazer pedido'}
      </Button>

      <Button
        variant="ghost"
        className="w-full text-muted-foreground"
        onClick={() => router.back()}
      >
        Voltar
      </Button>
    </div>
  );
}
