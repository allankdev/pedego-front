'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function UpgradePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  const handleUpgrade = async (plan: 'monthly' | 'annual') => {
    setIsUpgrading(true);
    try {
      const token = document.cookie.split('token=')[1];
      await fetch('http://localhost:3000/api/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan }),
      });
      alert(`Upgrade para plano ${plan} realizado com sucesso!`);
      router.push('/admin');
    } catch (error) {
      alert('Erro ao realizar upgrade. Tente novamente.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-center">Escolha um plano</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2 text-center">
            <h3 className="font-bold text-lg">Mensal</h3>
            <p className="text-sm text-muted-foreground">R$ 49,90 / mês</p>
            <Button onClick={() => handleUpgrade('monthly')} disabled={isUpgrading}>
              Escolher plano mensal
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2 text-center">
            <h3 className="font-bold text-lg">Anual</h3>
            <p className="text-sm text-muted-foreground">R$ 499,00 / ano</p>
            <Button onClick={() => handleUpgrade('annual')} disabled={isUpgrading}>
              Escolher plano anual
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
