'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import Cookie from 'js-cookie';

const daysOfWeek = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];

export function OpeningHourForm() {
  const { user } = useAuth();
  const [hours, setHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ day: '', open: '', close: '' });

  const fetchHours = async () => {
    const token = Cookie.get('token');
    const storeId = user?.store?.id;
    const res = await fetch(`http://localhost:3000/api/opening-hours/${storeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setHours(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (user?.store?.id) fetchHours();
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const token = Cookie.get('token');
    if (!form.day || !form.open || !form.close || !token) return;

    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `http://localhost:3000/api/opening-hours/${editing.id}`
      : `http://localhost:3000/api/opening-hours/${user?.store?.id}`;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      fetchHours();
      setForm({ day: '', open: '', close: '' });
      setEditing(null);
    }
  };

  const handleEdit = (hour: any) => {
    setEditing(hour);
    setForm({ day: hour.day, open: hour.open, close: hour.close });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remover este horário?')) return;
    const token = Cookie.get('token');
    await fetch(`http://localhost:3000/api/opening-hours/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHours();
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ day: '', open: '', close: '' });
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <Label className="block mb-2">{editing ? 'Editar Horário' : 'Novo Horário'}</Label>
          <div className="flex flex-wrap gap-2">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={form.day}
              onChange={(e) => handleChange('day', e.target.value)}
            >
              <option value="">Selecione o dia</option>
              {daysOfWeek.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
            <Input
              type="time"
              value={form.open}
              onChange={(e) => handleChange('open', e.target.value)}
            />
            <Input
              type="time"
              value={form.close}
              onChange={(e) => handleChange('close', e.target.value)}
            />
            <Button onClick={handleSubmit} disabled={loading}>
              {editing ? 'Salvar' : 'Adicionar'}
            </Button>
            {editing && (
              <Button variant="outline" type="button" onClick={cancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {hours.map((hour) => (
            <div
              key={hour.id}
              className="flex items-center justify-between border p-2 rounded-md"
            >
              <div>
                <p className="font-semibold capitalize">{hour.day}</p>
                <p className="text-sm text-muted-foreground">
                  {hour.open} - {hour.close}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(hour)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(hour.id)}
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
