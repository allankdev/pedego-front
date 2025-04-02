'use client';

import { useState } from 'react';
import { authStore } from '@/lib/store/authStore';

export function useStoreSettings() {
  const { user, setUser } = authStore();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStore = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = document.cookie.split('token=')[1];
      const subdomain = user?.store?.subdomain;
      if (!token || !subdomain) return;

      const res = await fetch(`http://localhost:3000/api/stores/${subdomain}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setStore({
        ...data,
        paymentMethods: data.paymentMethods || [],
        isOpen: Boolean(data.isOpen),
        autoPrint: Boolean(data.autoPrint),
      });
    } catch (err) {
      setError('Erro ao carregar os dados da loja.');
    } finally {
      setLoading(false);
    }
  };

  const updateStore = async (updatedData: any) => {
    setLoading(true);
    setError(null);
    try {
      const token = document.cookie.split("token=")[1];
      const subdomain = user?.store?.subdomain;
      if (!token || !subdomain) return;
  
      const res = await fetch(`http://localhost:3000/api/stores/${subdomain}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      const updatedStore = await res.json();
  
      if (res.ok) {
        setUser({ ...user, store: updatedStore });
        setStore(updatedStore);
      } else {
        setError(updatedStore.message || "Erro ao atualizar a loja");
      }
    } catch (err) {
      setError("Erro ao atualizar a loja.");
    } finally {
      setLoading(false);
    }
  };
  

  return {
    store,
    setStore,
    loading,
    error,
    fetchStore,
    updateStore,
  };
}
