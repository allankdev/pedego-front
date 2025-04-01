'use client';

import { CategoryForm } from '@/components/admin/CategoryForm';

export default function AdminCategoriesPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">Categorias</h2>
      <CategoryForm />
    </div>
  );
}
