'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  initialData?: {
    id: number;
    day: string;
    open: string;
    close: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

export function OpeningHourForm({ initialData, onSuccess, onCancel }: Props) {
  const { user } = useAuth();
  const [day, setDay] = useState(initialData?.day || '');
  const [open, setOpen] = useState(initialData?.open || '');
  const [close, setClose] = useState(initialData?.close || '');
  const [loading, setLoading] = useState(false);

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = document.cookie.split('token=')[1];

    const body = {
      day,
      open,
      close,
    };

    const url = isEdit
      ? `http://localhost:3000/api/opening-hours/${initialData!.id}`
      : `http://localhost:3000/api/opening-hours/${user?.store?.id}`;

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
      alert('Erro ao salvar horário');
      setLoading(false);
      return;
    }

    onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Dia (ex: Segunda-feira)"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        required
      />
      <Input
        placeholder="Abertura (ex: 08:00)"
        value={open}
        onChange={(e) => setOpen(e.target.value)}
        required
      />
      <Input
        placeholder="Fechamento (ex: 18:00)"
        value={close}
        onChange={(e) => setClose(e.target.value)}
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
