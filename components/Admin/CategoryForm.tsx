'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import Cookie from 'js-cookie';
import { Pencil, Trash } from 'lucide-react';

export function CategoryForm() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (user?.store?.id) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    const token = Cookie.get('token');
    const storeId = user?.store?.id;
    if (!token || !storeId) return;

    const res = await fetch(`http://localhost:3000/api/categories/${storeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  const handleCreate = async () => {
    const token = Cookie.get('token');
    const storeId = user?.store?.id;
    if (!token || !storeId || !newCategory) return;

    await fetch(`http://localhost:3000/api/categories/${storeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategory }),
    });

    setNewCategory('');
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    const token = Cookie.get('token');
    if (!token) return;

    await fetch(`http://localhost:3000/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchCategories();
  };

  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = async () => {
    const token = Cookie.get('token');
    if (!token || editingId === null) return;

    await fetch(`http://localhost:3000/api/categories/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editingName }),
    });

    setEditingId(null);
    setEditingName('');
    fetchCategories();
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <Label className="block mb-1">Nova categoria</Label>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Ex: Lanches"
            />
            <Button onClick={handleCreate}>Criar</Button>
          </div>
        </div>

        <div className="space-y-2">
          {Array.isArray(categories) && categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between border p-2 rounded-md"
            >
              {editingId === cat.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="mr-2"
                  />
                  <Button size="sm" onClick={handleUpdate}>
                    Salvar
                  </Button>
                </>
              ) : (
                <>
                  <span>{cat.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(cat.id, cat.name)}>
                      <Pencil size={16} />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
