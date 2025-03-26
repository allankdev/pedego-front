'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  initialData?: {
    id: number;
    name: string;
    description: string;
    price: string;
    available: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

export function ProductForm({ initialData, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [available, setAvailable] = useState(initialData?.available ?? true);
  const [loading, setLoading] = useState(false);

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      alert('Preço inválido. Use um valor numérico (ex: 9.99)');
      setLoading(false);
      return;
    }
  
    try {
      const token = document.cookie.split('token=')[1];
      const res = await fetch(`http://localhost:3000/api/products${isEdit ? `/${initialData!.id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: parsedPrice, // corrigido!
          available,
        }),
      });
  
      if (!res.ok) throw new Error('Erro ao salvar produto');
      onSuccess();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Input
        placeholder="Nome do produto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Input
        placeholder="Preço (ex: 8.00)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        type="number"
        step="0.01"
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
        Disponível para venda
      </label>
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
