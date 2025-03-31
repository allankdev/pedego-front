'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NeighborhoodForm } from '@/components/Admin/NeighborhoodForm';

export default function NeighborhoodsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const fetchNeighborhoods = async () => {
    const token = document.cookie.split('token=')[1];
    const res = await fetch(`http://localhost:3000/api/neighborhoods/${user?.store?.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNeighborhoods(data);
  };

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user?.store?.id) fetchNeighborhoods();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este bairro?')) return;
    const token = document.cookie.split('token=')[1];
    await fetch(`http://localhost:3000/api/neighborhoods/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNeighborhoods();
  };

  const handleEdit = (bairro: any) => {
    setEditing(bairro);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bairros e Taxas de Entrega</h2>
        <Button onClick={() => setShowForm(true)}>Novo Bairro</Button>
      </div>

      {showForm && (
        <div className="border rounded-md bg-muted p-4">
          <NeighborhoodForm
            initialData={editing}
            onCancel={closeForm}
            onSuccess={() => {
              fetchNeighborhoods();
              closeForm();
            }}
          />
        </div>
      )}

      {neighborhoods.map((bairro) => (
        <Card key={bairro.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{bairro.name}</p>
              <p className="text-sm text-muted-foreground">Taxa: R$ {parseFloat(bairro.deliveryFee).toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleEdit(bairro)}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(bairro.id)}>Excluir</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
