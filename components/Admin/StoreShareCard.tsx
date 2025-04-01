'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

export function StoreShareCard() {
  const { user } = useAuth();
  const [storeUrl, setStoreUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.store?.subdomain) {
      setStoreUrl(`https://pedego.com/${user.store.subdomain}`);
    }
  }, [user]);

  const handleCopy = () => {
    if (!storeUrl) return;
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div>
          <Label className="text-sm">Link da sua loja:</Label>
          <div className="flex gap-2 mt-1">
            <Input value={storeUrl} readOnly />
            <Button onClick={handleCopy} disabled={!storeUrl}>
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {copied && 'Link copiado para a área de transferência.'}
          </p>
        </div>

        <div>
          <Label className="text-sm">Status:</Label>
          <p className="mt-1 font-semibold">
            {user?.store?.isOpen ? '🟢 Loja aberta' : '🔴 Loja fechada'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
