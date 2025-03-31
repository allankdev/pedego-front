'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/components/Admin/ProductForm';
import Cookie from 'js-cookie';

export default function ProductsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    const token = Cookie.get('token');
    if (!token || !user?.store?.id) return;

    const res = await fetch(`http://localhost:3000/api/products?storeId=${user.store.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user?.store?.id) {
      fetchProducts();
    }
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    const token = Cookie.get('token');
    await fetch(`http://localhost:3000/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Produtos</h2>
        <Button onClick={() => {
          setEditingProduct(null);
          setShowForm(true);
        }}>
          Novo Produto
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 bg-muted">
          <ProductForm
            initialData={editingProduct}
            onSuccess={() => {
              fetchProducts();
              closeForm();
            }}
            onCancel={closeForm}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 space-y-1">
              <p className="font-bold">{product.name}</p>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="text-sm">R$ {parseFloat(product.price).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                {product.available ? 'Disponível' : 'Indisponível'}
              </p>
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => handleEdit(product)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>Excluir</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
