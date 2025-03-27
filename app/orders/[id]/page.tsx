'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Order = {
  id: number
  customerName: string
  customerPhone: string
  customerAddress?: string
  deliveryType: string
  paymentMethod: string
  observations?: string
  status: 'pendente' | 'em_producao' | 'entregue' | 'cancelado'
  items: { product: { name: string } | null; quantity: number }[]
}

export default function PedidoPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
          cache: 'no-store',
        })
        
        const data = await res.json()
        setOrder(data)
      } catch (error) {
        console.error('Erro ao buscar pedido:', error)
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
    const interval = setInterval(fetchOrder, 10000) // Atualiza a cada 10s

    return () => clearInterval(interval)
  }, [id])

  const statusSteps = ['pendente', 'em_producao', 'entregue'] as const
  const getStepIndex = (status: string) => statusSteps.indexOf(status as any)

  if (loading || !order) {
    return <div className="p-6 text-center">Carregando pedido...</div>
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-xl font-bold mb-2">🔎 Pedido #{order.id}</h1>

      <div className="mb-4">
        <p><strong>Nome:</strong> {order.customerName}</p>
        <p><strong>Telefone:</strong> {order.customerPhone}</p>
        <p><strong>Entrega:</strong> {order.deliveryType}</p>
        <p><strong>Pagamento:</strong> {order.paymentMethod}</p>
        {order.customerAddress && <p><strong>Endereço:</strong> {order.customerAddress}</p>}
        {order.observations && <p><strong>Obs:</strong> {order.observations}</p>}
      </div>

      <div className="mb-6">
        <p className="font-medium mb-2">⏱ Status do pedido:</p>
        <div className="flex items-center justify-between">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex-1 text-center">
              <div
                className={`w-4 h-4 mx-auto rounded-full ${
                  index <= getStepIndex(order.status)
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
              />
              <p className="text-sm mt-1 capitalize">{step.replace('_', ' ')}</p>
            </div>
          ))}
        </div>
      </div>

      {order.status === 'pendente' && (
        <div className="text-yellow-600">⏳ Seu pedido está aguardando confirmação da loja...</div>
      )}
      {order.status === 'em_producao' && (
        <div className="text-blue-600">👨‍🍳 Seu pedido está sendo preparado!</div>
      )}
      {order.status === 'entregue' && (
        <div className="text-green-600">✅ Pedido entregue. Bom apetite!</div>
      )}
      {order.status === 'cancelado' && (
        <div className="text-red-600">❌ Pedido cancelado pela loja.</div>
      )}

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
  )
}
