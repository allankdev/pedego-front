'use client'

import { useCartStore } from '@/lib/store/cartStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SelectBox } from './SelectBox'

export function ConfirmCheckoutForm() {
  const {
    items,
    customerInfo,
    coupon,
    clearCart,
  } = useCartStore()

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deliveryType, setDeliveryType] = useState<'entrega' | 'retirada' | ''>(customerInfo?.deliveryType || '')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'dinheiro' | 'cartao' | ''>(customerInfo?.paymentMethod || '')
  const [address, setAddress] = useState(customerInfo?.address || '')
  const [observations, setObservations] = useState('')

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = coupon ? subtotal * (coupon.discountPercentage / 100) : 0
  const finalTotal = subtotal - discount

  const handleSubmit = async () => {
    if (!customerInfo || !deliveryType || !paymentMethod) return

    const payload = {
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: deliveryType === 'entrega' ? address : '',
      deliveryType,
      paymentMethod,
      observations,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      status: 'pendente',
    }

    try {
      setLoading(true)
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Erro ao fazer pedido')
      }

      const createdOrder = await res.json()
      clearCart()
      router.push(`/checkout/success?orderId=${createdOrder.id}`)
    } catch (err) {
      console.error(err)
      alert('Erro ao finalizar pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">🧾 Finalizar pedido</h1>

      <Card>
        <CardContent className="p-4 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Entregar para:</p>
              <p className="font-semibold">{customerInfo?.name}</p>
              <p className="text-sm">{customerInfo?.phone}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => router.push('/checkout/identify')}>
              Trocar
            </Button>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">📦 Forma de entrega</h2>
            <SelectBox label="Cadastrar endereço" selected={deliveryType === 'entrega'} onClick={() => setDeliveryType('entrega')} />
            {deliveryType === 'entrega' && (
              <Input
                placeholder="Endereço completo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2"
              />
            )}
            <SelectBox
              label="Retirar no estabelecimento"
              selected={deliveryType === 'retirada'}
              onClick={() => setDeliveryType('retirada')}
              description="Av. Manoel Morais, 175 - Manaíra, João Pessoa - PB"
            />
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">💳 Forma de pagamento</h2>
            <SelectBox label="Dinheiro" selected={paymentMethod === 'dinheiro'} onClick={() => setPaymentMethod('dinheiro')} />
            <SelectBox label="Cartão ou PIX" selected={paymentMethod === 'cartao'} onClick={() => setPaymentMethod('cartao')} />
          </div>

          <div className="space-y-1">
            <h2 className="font-semibold">✍️ Observações</h2>
            <Input
              placeholder="Ex: Sem cebola, portão azul, etc."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2 text-right">
        <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
        {coupon && <p className="text-green-600 font-medium">Desconto: - R$ {discount.toFixed(2)}</p>}
        <p className="text-lg font-bold">Total: R$ {finalTotal.toFixed(2)}</p>
      </div>

      <div className="space-y-2">
        <Button className="w-full" onClick={handleSubmit} disabled={loading || !deliveryType || !paymentMethod}>
          {loading ? 'Enviando...' : 'Fazer pedido'}
        </Button>
        <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    </div>
  )
}
