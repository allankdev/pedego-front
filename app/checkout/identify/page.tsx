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
      if (phone.length < 10) return; // Garantir que o número de telefone tenha pelo menos 10 dígitos

      setLoading(true);
      try {
        const res = await fetch(`/api/users/phone/${phone}`); // Usando o endpoint correto
        const data = await res.json();

        console.log('🔍 Resposta ao buscar cliente:', data); // Log da resposta da API

        if (res.ok && data?.name) {
          setName(data.name); // Preencher o nome se o cliente já existir
        } else if (res.status === 404) {
          // Caso o cliente não seja encontrado, cadastrá-lo
          console.log('Cliente não encontrado, criando novo usuário...');
          await createCustomer();
        }
      } catch (error) {
        console.warn('Erro ao buscar cliente, criando novo usuário...', error);
        await createCustomer();
      } finally {
        setLoading(false);
      }
    };

    if (phone.length >= 10) fetchCustomerByPhone();
  }, [phone]);

  const createCustomer = async () => {
    if (!phone.trim() || !name.trim()) {
      alert('Por favor, preencha o nome e telefone.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        phone,
        name,
      };

      console.log('🔍 Criando novo cliente com payload:', payload); // Log do payload

      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setName(data.name); // Atualizar nome após criação do usuário
        alert('Cliente cadastrado com sucesso!');
      } else {
        const errorData = await res.json();
        console.error('Erro ao cadastrar cliente:', errorData); // Log do erro
        alert('Erro ao cadastrar cliente');
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert('Erro ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

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
        maxLength={15} // Limitar o tamanho do telefone para evitar entradas inválidas
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
