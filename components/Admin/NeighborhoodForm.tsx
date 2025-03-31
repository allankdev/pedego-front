'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  initialData?: {
    id: number;
    name: string;
    deliveryFee: number;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

export function NeighborhoodForm({ initialData, onSuccess, onCancel }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState(initialData?.name || '');
  const [deliveryFee, setDeliveryFee] = useState(initialData?.deliveryFee?.toString() || '');
  const [loading, setLoading] = useState(false);

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = document.cookie.split('token=')[1];

    const body = {
      name,
      deliveryFee: parseFloat(deliveryFee),
    };

    const url = isEdit
      ? `http://localhost:3000/api/neighborhoods/${initialData!.id}`
      : `http://localhost:3000/api/neighborhoods/${user?.store?.id}`;

    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      alert(`Erro ao salvar bairro: ${error}`);
      setLoading(false);
      return;
    }

    onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Nome do bairro"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        placeholder="Taxa de entrega (ex: 5.00)"
        value={deliveryFee}
        onChange={(e) => setDeliveryFee(e.target.value)}
        type="number"
        step="0.01"
        required
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
