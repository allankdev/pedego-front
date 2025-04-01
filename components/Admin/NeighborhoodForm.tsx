'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Cookie from 'js-cookie';
import { useAuth } from '@/hooks/useAuth';

export function NeighborhoodForm() {
  const { user } = useAuth();
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: '',
    deliveryFee: '',
  });

  const fetchNeighborhoods = async () => {
    const token = Cookie.get('token');
    const res = await fetch(`http://localhost:3000/api/neighborhoods/${user?.store?.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setNeighborhoods(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (user?.store?.id) fetchNeighborhoods();
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.deliveryFee) return;
    setLoading(true);

    const token = Cookie.get('token');
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `http://localhost:3000/api/neighborhoods/${editing.id}`
      : `http://localhost:3000/api/neighborhoods/${user?.store?.id}`;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        deliveryFee: parseFloat(form.deliveryFee),
      }),
    });

    if (res.ok) {
      fetchNeighborhoods();
      resetForm();
    }

    setLoading(false);
  };

  const handleEdit = (bairro: any) => {
    setEditing(bairro);
    setForm({
      name: bairro.name,
      deliveryFee: bairro.deliveryFee.toString(),
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este bairro?')) return;

    const token = Cookie.get('token');
    await fetch(`http://localhost:3000/api/neighborhoods/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchNeighborhoods();
  };

  const resetForm = () => {
    setForm({ name: '', deliveryFee: '' });
    setEditing(null);
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <Label className="block mb-2">{editing ? 'Editar Bairro' : 'Novo Bairro'}</Label>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Nome do bairro"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Taxa de entrega (R$)"
              value={form.deliveryFee}
              onChange={(e) => handleChange('deliveryFee', e.target.value)}
            />
            <Button onClick={handleSubmit} disabled={loading}>
              {editing ? 'Salvar alterações' : 'Adicionar'}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {neighborhoods.map((bairro) => (
            <div
              key={bairro.id}
              className="flex items-center justify-between border p-2 rounded-md"
            >
              <div>
                <p className="font-medium">{bairro.name}</p>
                <p className="text-sm text-muted-foreground">
                  Taxa: R$ {parseFloat(bairro.deliveryFee).toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(bairro)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(bairro.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
