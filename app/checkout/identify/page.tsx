'use client';

import { useCartStore } from '@/lib/store/cartStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function IdentificationPage() {
  const { updateCustomerInfo, customerInfo } = useCartStore();
  const [phone, setPhone] = useState(customerInfo?.phone || '');
  const [name, setName] = useState(customerInfo?.name || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCustomerByPhone = async () => {
      if (phone.length < 10) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/customers/phone/${phone}`);
        const data = await res.json();
        if (res.ok && data?.name) {
          setName(data.name);
        }
      } catch (error) {
        console.warn('Cliente não encontrado (sem problema)');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerByPhone();
  }, [phone]);

  const handleNext = () => {
    if (!name.trim() || !phone.trim()) {
      alert('Por favor, preencha o nome e telefone.');
      return;
    }

    updateCustomerInfo({ name, phone });
    router.push('/checkout/confirm');
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-bold">📱 Identificação</h1>

      <Input
        placeholder="Número do WhatsApp"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <Input
        placeholder="Nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex flex-col gap-2 pt-2">
        <Button className="w-full" onClick={handleNext} disabled={loading}>
          {loading ? 'Buscando...' : 'Avançar'}
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/checkout/cart')}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}
