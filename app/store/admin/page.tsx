import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStores } from '@/hooks/useStores';
import { ProductManagement } from '@/components/admin/ProductManagement';

export default function StoreAdminPage({ params }: { params: { subdomain: string } }) {
  const router = useRouter();
  const [store, setStore] = useState(null);
  const { getStoreBySubdomain } = useStores();

  useEffect(() => {
    async function fetchStore() {
      const data = await getStoreBySubdomain(params.subdomain);
      setStore(data);
    }
    fetchStore();
  }, [params.subdomain, getStoreBySubdomain]);

  if (!store) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Painel Administrativo - {store.name}</h1>
      <ProductManagement storeId={store.id} />
      {/* ... Outras funcionalidades de administração ... */}
    </div>
  );
}