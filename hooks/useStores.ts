'use client';

import { useEffect, useState } from 'react';

type Store = {
  name: string;
  description: string;
  subdomain: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
};

export function useStoreData(subdomain: string) {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        const storeRes = await fetch(`${baseUrl}/api/stores/${subdomain}`);
        if (!storeRes.ok) {
          console.error('❌ Erro ao buscar loja:', storeRes.status);
          throw new Error('Loja não encontrada');
        }

        const storeData = await storeRes.json();
        setStore(storeData);

        const productsRes = await fetch(`${baseUrl}/api/products`);
        if (!productsRes.ok) {
          console.error('❌ Erro ao buscar produtos:', productsRes.status);
          throw new Error('Erro ao buscar produtos');
        }

        const allProducts: Product[] = await productsRes.json();
        const storeProducts = allProducts.filter((p) => p.available); // futuramente: filtrar por lojaId
        setProducts(storeProducts);
      } catch (err) {
        console.error('Erro ao carregar loja e produtos:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (subdomain) {
      fetchData();
    }
  }, [subdomain]);

  return { store, products, loading, error };
}
