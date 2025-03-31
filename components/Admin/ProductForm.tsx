'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  initialData?: {
    id: number;
    name: string;
    description: string;
    price: string;
    available: boolean;
    categoryId?: number;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

export function ProductForm({ initialData, onSuccess, onCancel }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [available, setAvailable] = useState(initialData?.available ?? true);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(initialData?.categoryId || null);
  const [newCategory, setNewCategory] = useState('');

  const fetchCategories = async () => {
    if (!user?.store?.id) return;
    const token = document.cookie.split('token=')[1];
    const res = await fetch(`http://localhost:3000/api/categories/${user.store.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    const token = document.cookie.split('token=')[1];
    const res = await fetch(`http://localhost:3000/api/categories/${user.store.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategory }),
    });

    const created = await res.json();
    setCategories((prev) => [...prev, created]);
    setCategoryId(created.id);
    setNewCategory('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      alert('Preço inválido');
      setLoading(false);
      return;
    }

    try {
      const token = document.cookie.split('token=')[1];
      const res = await fetch(`http://localhost:3000/api/products${initialData ? `/${initialData.id}` : ''}`, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: parsedPrice,
          available,
          categoryId,
        }),
      });

      if (!res.ok) throw new Error('Erro ao salvar produto');
      onSuccess();
    } catch (err) {
      alert('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Input placeholder="Nome do produto" value={name} onChange={(e) => setName(e.target.value)} required />
      <Textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <Input
        placeholder="Preço (ex: 8.00)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        type="number"
        step="0.01"
      />

      <div>
        <Label>Categoria</Label>
        <Select value={categoryId?.toString()} onValueChange={(val) => setCategoryId(Number(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Nova categoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button type="button" onClick={createCategory}>
          Criar
        </Button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
        Disponível para venda
      </label>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
