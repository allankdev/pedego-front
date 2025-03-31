'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { ChartOrders } from './chart-orders';
import { ChartValues } from './chart-values';
import { ChartHours } from './chart-hours';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ReportsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  useEffect(() => {
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const filtered = orders.filter((order) => {
        const created = new Date(order.createdAt);
        return (!start || created >= start) && (!end || created <= end);
      });

      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      const token = document.cookie.split('token=')[1];
      const res = await fetch('http://localhost:3000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupOrdersByDate = () => {
    const map: Record<string, { count: number; total: number }> = {};
    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString('pt-BR');
      if (!map[date]) map[date] = { count: 0, total: 0 };
      map[date].count += 1;
      map[date].total += parseFloat(order.total || 0);
    });
    return Object.entries(map).map(([date, val]) => ({
      date,
      count: val.count,
      total: parseFloat(val.total.toFixed(2)),
    }));
  };

  const getPeakHours = () => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours().toString().padStart(2, '0') + ':00';
      map[hour] = (map[hour] || 0) + 1;
    });

    return Object.entries(map)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));
  };

  const exportToCSV = () => {
    const csv = [
      ['Data', 'Total (R$)', 'Quantidade de pedidos'],
      ...groupOrdersByDate().map((row) => [row.date, row.total.toFixed(2), row.count]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio-pedidos.csv';
    link.click();
  };

  const averageValue = () => {
    const total = filteredOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    return filteredOrders.length ? (total / filteredOrders.length).toFixed(2) : '0.00';
  };

  const dailyData = groupOrdersByDate();

  if (isLoading) return <p className="p-4">Carregando autenticação...</p>;
  if (loading) return <p className="p-4">Carregando relatórios...</p>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Relatórios da Loja</h1>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm">Data inicial</label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="flex-1">
          <label className="text-sm">Data final</label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <Button onClick={exportToCSV}>📤 Exportar CSV</Button>
      </div>

      <p className="text-muted-foreground text-sm">
        Valor médio por pedido: <strong>R$ {averageValue()}</strong>
      </p>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Pedidos por dia</h2>
          <ChartOrders data={dailyData.map((d) => ({ date: d.date, count: d.count }))} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Receita por dia</h2>
          <ChartValues data={dailyData.map((d) => ({ date: d.date, total: d.total }))} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Horários de Pico</h2>
          <ChartHours data={getPeakHours()} />
        </CardContent>
      </Card>
    </div>
  );
}
