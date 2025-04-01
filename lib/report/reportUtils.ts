export function groupOrdersByDate(orders: any[]) {
    const map: Record<string, { count: number; total: number }> = {};
    orders.forEach((order) => {
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
  }
  
  export function getPeakHours(orders: any[]) {
    const map: Record<string, number> = {};
    orders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours().toString().padStart(2, '0') + ':00';
      map[hour] = (map[hour] || 0) + 1;
    });
  
    return Object.entries(map)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));
  }
  
  export function averageOrderValue(orders: any[]) {
    const total = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    return orders.length ? (total / orders.length).toFixed(2) : '0.00';
  }
  
  export function exportOrdersToCSV(data: { date: string; total: number; count: number }[]) {
    const csv = [
      ['Data', 'Total (R$)', 'Quantidade de pedidos'],
      ...data.map((row) => [row.date, row.total.toFixed(2), row.count]),
    ]
      .map((row) => row.join(','))
      .join('\n');
  
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio-pedidos.csv';
    link.click();
  }
  