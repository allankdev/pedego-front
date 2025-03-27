// app/checkout/success/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  useEffect(() => {
    if (!orderId) router.push('/')
  }, [orderId])

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4 text-green-600">🎉 Pedido Realizado!</h1>
      <p className="mb-2">Seu pedido foi feito com sucesso.</p>
      <p className="mb-4">Número do pedido: <strong>#{orderId}</strong></p>
      <button
        onClick={() => router.push(`/orders/${orderId}`)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Acompanhar pedido
      </button>
    </div>
  )
}
