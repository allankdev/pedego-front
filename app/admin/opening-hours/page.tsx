// app/admin/opening-hours/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OpeningHourForm } from '@/components/Admin/OpeningHourForm';

export default function OpeningHoursPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [hours, setHours] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchHours = async () => {
    const token = document.cookie.split('token=')[1];
    const storeId = user?.store?.id;
    const res = await fetch(`http://localhost:3000/api/opening-hours/${storeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setHours(data);
  };

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user?.store?.id) fetchHours();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!confirm('Remover este horário?')) return;
    const token = document.cookie.split('token=')[1];
    await fetch(`http://localhost:3000/api/opening-hours/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHours();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Horários de Funcionamento</h2>
        <Button onClick={() => setShowForm(true)}>Novo Horário</Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4">
            <OpeningHourForm
              initialData={editing}
              onSuccess={() => {
                fetchHours();
                setShowForm(false);
                setEditing(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {hours.map((hour) => (
          <Card key={hour.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold capitalize">{hour.day}</p>
                <p className="text-sm text-muted-foreground">
                  {hour.open} - {hour.close}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { setEditing(hour); setShowForm(true); }}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(hour.id)}>Remover</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
