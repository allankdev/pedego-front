'use client';

import { useEffect, useState } from 'react';

export function useDashboardStats() {
  const [loading, setLoading] = useState(true);
  const [storeStatus, setStoreStatus] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    subscription: 'trial',
    totalCoupons: 0,
    totalNeighborhoods: 0,
    totalOpeningHours: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = document.cookie.split('token=')[1];
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const [
        ordersRes,
        productsRes,
        subscriptionRes,
        couponsRes,
        neighborhoodsRes,
        openingHoursRes,
        storeRes,
      ] = await Promise.all([
        fetch(`http://localhost:3000/api/orders/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3000/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3000/api/subscriptions/${user?.id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3000/api/coupons`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3000/api/neighborhoods/${user?.store?.id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3000/api/opening-hours/${user?.store?.id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3000/api/stores/${user?.store?.subdomain}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [
        orders, products, subscription, coupons, neighborhoods, openingHours, store
      ] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        subscriptionRes.json(),
        couponsRes.json(),
        neighborhoodsRes.json(),
        openingHoursRes.json(),
        storeRes.json(),
      ]);

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        subscription: subscription?.type || 'trial',
        totalCoupons: coupons.length,
        totalNeighborhoods: neighborhoods.length,
        totalOpeningHours: openingHours.length,
      });

      setStoreStatus(store?.isOpen || false);
    } catch (err) {
      console.error('Erro ao carregar estatísticas', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStoreStatus = async () => {
    try {
      const token = document.cookie.split('token=')[1];
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const subdomain = user?.store?.subdomain;
      if (!subdomain) return;

      const res = await fetch(`http://localhost:3000/api/stores/${subdomain}/toggle-open`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) setStoreStatus((prev) => !prev);
    } catch (err) {
      console.error('Erro ao alternar status da loja', err);
    }
  };

  return { stats, loading, storeStatus, toggleStoreStatus };
}
