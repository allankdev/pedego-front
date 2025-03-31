// app/admin/share/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SharePage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const storeUrl = user?.store?.subdomain
    ? `https://pedego.com/${user.store.subdomain}`
    : '';

  const handleCopy = () => {
    if (!storeUrl) return;
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Compartilhe sua Loja</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm">Link da sua loja:</label>
            <div className="flex gap-2 mt-1">
              <Input value={storeUrl} readOnly />
              <Button onClick={handleCopy}>
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm">Status:</label>
            <p className="mt-1 font-semibold">
              {user?.store?.isOpen ? '🟢 Loja aberta' : '🔴 Loja fechada'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
