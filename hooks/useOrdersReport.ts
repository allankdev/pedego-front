'use client';

import { useEffect, useState } from 'react';
import Cookie from 'js-cookie';

type Order = {
  id: number;
  createdAt: string;
  total: number;
};

type ReportFilters = {
  startDate?: string;
  endDate?: string;
};

export function useOrdersReport(filters: ReportFilters = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const token = Cookie.get('token');

      const res = await fetch('http://localhost:3000/api/orders/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const filtered = data.filter((order: Order) => {
        const created = new Date(order.createdAt);
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;

        if (start && created < start) return false;
        if (end && created > end) return false;
        return true;
      });

      setOrders(filtered);
    } catch (error) {
      console.error('Erro ao buscar pedidos do relatório:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters.startDate, filters.endDate]);

  return { orders, loading, fetchOrders };
}
