'use client';

import { useParams } from 'next/navigation';
import { useStoreData } from '@/hooks/useStores';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cartStore';
import FloatingCart from '@/components/cart/FloatingCart';

export default function StorePage() {
  const { subdomain } = useParams() as { subdomain: string };
  const { store, products, loading, error } = useStoreData(subdomain);
  const { addItem } = useCartStore();

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p>Carregando loja...</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-bold text-red-600">Loja não encontrada 🛑</h1>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{store.name}</h1>
        <p className="text-muted-foreground">{store.description}</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="text-sm font-semibold">R$ {parseFloat(product.price).toFixed(2)}</p>
              <Button
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    quantity: 1,
                  })
                }
              >
                Adicionar ao carrinho
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <FloatingCart />
    </div>
  );
}