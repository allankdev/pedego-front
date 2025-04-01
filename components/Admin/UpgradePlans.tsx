'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface UpgradePlansProps {
  token: string;
}

export function UpgradePlans({ token }: UpgradePlansProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async (plan: 'monthly' | 'annual') => {
    setIsUpgrading(true);
    try {
      const res = await fetch('http://localhost:3000/api/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      if (res.ok) {
        alert(`Upgrade para o plano ${plan === 'monthly' ? 'mensal' : 'anual'} realizado com sucesso!`);
        router.push('/admin');
      } else {
        const err = await res.json();
        alert(err.message || 'Erro ao realizar upgrade.');
      }
    } catch (error) {
      alert('Erro ao realizar upgrade. Tente novamente.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4 space-y-2 text-center">
          <h3 className="font-bold text-lg">Mensal</h3>
          <p className="text-sm text-muted-foreground">R$ 49,90 / mês</p>
          <Button onClick={() => handleUpgrade('monthly')} disabled={isUpgrading}>
            {isUpgrading ? 'Carregando...' : 'Escolher plano mensal'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2 text-center">
          <h3 className="font-bold text-lg">Anual</h3>
          <p className="text-sm text-muted-foreground">R$ 499,00 / ano</p>
          <Button onClick={() => handleUpgrade('annual')} disabled={isUpgrading}>
            {isUpgrading ? 'Carregando...' : 'Escolher plano anual'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
