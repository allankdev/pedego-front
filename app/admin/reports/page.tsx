'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChartOrders } from '@/components/reports/chart-orders';
import { ChartValues } from '@/components/reports/chart-values';
import { ChartHours } from '@/components/reports/chart-hours';
import { useOrdersReport } from '@/hooks/useOrdersReport';
import { ReportChartCard } from '@/components/reports/ReportChartCard';
import {
  groupOrdersByDate,
  getPeakHours,
  averageOrderValue,
  exportOrdersToCSV,
} from '@/lib/report/reportUtils';

export default function ReportsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { orders, fetchOrders, loading } = useOrdersReport();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  useEffect(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const filtered = orders.filter((order) => {
      const created = new Date(order.createdAt);
      return (!start || created >= start) && (!end || created <= end);
    });

    setFilteredOrders(filtered);
  }, [orders, startDate, endDate]);

  const dailyData = groupOrdersByDate(filteredOrders);

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
        <Button onClick={() => exportOrdersToCSV(dailyData)}>📤 Exportar CSV</Button>
      </div>

      <p className="text-muted-foreground text-sm">
        Valor médio por pedido: <strong>R$ {averageOrderValue(filteredOrders)}</strong>
      </p>

      <ReportChartCard title="Pedidos por dia">
        <ChartOrders data={dailyData.map((d) => ({ date: d.date, count: d.count }))} />
      </ReportChartCard>

      <ReportChartCard title="Receita por dia">
        <ChartValues data={dailyData.map((d) => ({ date: d.date, total: d.total }))} />
      </ReportChartCard>

      <ReportChartCard title="Horários de Pico">
        <ChartHours data={getPeakHours(filteredOrders)} />
      </ReportChartCard>
    </div>
  );
}
