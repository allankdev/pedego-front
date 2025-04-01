'use client'

import { useCartStore } from '@/lib/store/cartStore'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function IdentificationForm() {
  const { updateCustomerInfo, customerInfo } = useCartStore()
  const [phone, setPhone] = useState(customerInfo?.phone || '')
  const [name, setName] = useState(customerInfo?.name || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCustomerByPhone = async () => {
      if (phone.length < 10) return

      setLoading(true)
      try {
        const res = await fetch(`/api/users/phone/${phone}`)
        const data = await res.json()

        if (res.ok && data?.name) {
          setName(data.name)
        } else if (res.status === 404) {
          await createCustomer()
        }
      } catch {
        await createCustomer()
      } finally {
        setLoading(false)
      }
    }

    if (phone.length >= 10) fetchCustomerByPhone()
  }, [phone])

  const createCustomer = async () => {
    if (!phone.trim() || !name.trim()) {
      alert('Por favor, preencha o nome e telefone.')
      return
    }

    setLoading(true)
    try {
      const payload = { phone, name }

      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        setName(data.name)
      } else {
        alert('Erro ao cadastrar cliente')
      }
    } catch {
      alert('Erro ao cadastrar cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (!name.trim() || !phone.trim()) {
      alert('Por favor, preencha o nome e telefone.')
      return
    }

    updateCustomerInfo({ name, phone })
    router.push('/checkout/confirm')
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-bold">📱 Identificação</h1>

      <Input
        placeholder="Número do WhatsApp"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        maxLength={15}
      />

      <Input
        placeholder="Nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex flex-col gap-2 pt-2">
        <Button className="w-full" onClick={handleNext} disabled={loading || !phone || !name}>
          {loading ? 'Buscando...' : 'Avançar'}
        </Button>
        <Button variant="outline" className="w-full" onClick={() => router.push('/checkout/cart')}>
          Voltar
        </Button>
      </div>
    </div>
  )
}
