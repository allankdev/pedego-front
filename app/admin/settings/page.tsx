'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { authStore } from '@/lib/store/authStore';

const paymentOptions = ['Pix', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'];

export default function StoreSettingsPage() {
  const { user, isLoading } = useAuth();
  const { setUser } = authStore();
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verifica se o usuário está autenticado e possui a role ADMIN
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  // Fetch store data based on user's store subdomain
  useEffect(() => {
    if (user?.store?.subdomain) fetchStoreData();
  }, [user]);

  const fetchStoreData = async () => {
    const token = document.cookie.split('token=')[1];
    const subdomain = user?.store?.subdomain;
    if (!subdomain) return;

    const res = await fetch(`http://localhost:3000/api/stores/${subdomain}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStore({ ...data, paymentMethods: data.paymentMethods || [] });
  };

  // Handle input changes
  const handleChange = (key: string, value: any) => {
    setStore((prev: any) => ({ ...prev, [key]: value }));
  };

  // Toggle payment method (checkbox functionality)
  const togglePaymentMethod = (method: string) => {
    setStore((prev: any) => {
      const current = prev.paymentMethods || [];
      return {
        ...prev,
        paymentMethods: current.includes(method.toLowerCase())
          ? current.filter((m: string) => m !== method.toLowerCase())  // Remover se já estiver marcado
          : [...current, method.toLowerCase()],  // Adicionar se não estiver marcado
      };
    });
  };

  // Handle form submission to update store data
  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // Limpa o erro antes de tentar salvar

    const token = document.cookie.split('token=')[1];
    const subdomain = user?.store?.subdomain;
    if (!subdomain) return;

    // Garantir que minOrderValue seja um número ou null
    const minOrderValue = store.minOrderValue ? parseFloat(store.minOrderValue) : null;

    if (minOrderValue !== null && isNaN(minOrderValue)) {
      setError('O valor mínimo do pedido deve ser um número válido.');
      setLoading(false);
      return;
    }

    const res = await fetch(`http://localhost:3000/api/stores/${subdomain}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...store,
        minOrderValue, // Envia o valor numérico ou null
        paymentMethods: store.paymentMethods?.map((m: string) => m.toLowerCase()) || [],
      }),
    });

    const updatedStore = await res.json();

    if (res.ok) {
      setUser({ ...user, store: updatedStore });
    } else {
      setError(updatedStore.message || 'Erro ao atualizar a loja');
    }
    setLoading(false);
  };

  // Carregamento de dados de autenticação e loja
  if (isLoading || !user || user.role !== 'ADMIN') {
    return <p className="p-4">Carregando autenticação...</p>;
  }

  if (!store) {
    return <p className="p-4">Carregando dados da loja...</p>;
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">Configurações da Loja</h2>

      {error && <p className="text-red-500">{error}</p>} {/* Exibindo erro, se houver */}

      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label>Nome da Loja</Label>
            <Input value={store.name ?? ''} onChange={(e) => handleChange('name', e.target.value)} />
          </div>

          <div>
            <Label>WhatsApp</Label>
            <Input value={store.whatsapp ?? ''} onChange={(e) => handleChange('whatsapp', e.target.value)} />
          </div>

          <div>
            <Label>E-mail</Label>
            <Input value={store.email ?? ''} onChange={(e) => handleChange('email', e.target.value)} />
          </div>

          <div>
            <Label>País</Label>
            <Input value={store.country ?? ''} onChange={(e) => handleChange('country', e.target.value)} />
          </div>

          <div>
            <Label>Modo de operação</Label>
            <Select value={store.operationMode ?? ''} onValueChange={(val) => handleChange('operationMode', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrega">Delivery</SelectItem>
                <SelectItem value="retirada">Retirada</SelectItem>
                <SelectItem value="ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tempo de entrega (ex: 30-45min)</Label>
            <Input value={store.deliveryTime ?? ''} onChange={(e) => handleChange('deliveryTime', e.target.value)} />
          </div>

          <div>
            <Label>Valor mínimo do pedido</Label>
            <Input
              type="number"
              value={store.minOrderValue ?? ''}
              onChange={(e) =>
                handleChange('minOrderValue', e.target.value === '' ? null : parseFloat(e.target.value))
              }
            />
          </div>

          <div>
            <Label>Tamanho da fonte (impressão)</Label>
            <Input value={store.printFontSize ?? ''} onChange={(e) => handleChange('printFontSize', e.target.value)} />
          </div>

          <div>
            <Label>Tamanho do papel (impressão)</Label>
            <Input value={store.printPaperSize ?? ''} onChange={(e) => handleChange('printPaperSize', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Formas de Pagamento</Label>
            <div className="flex flex-wrap gap-4">
              {paymentOptions.map((method) => (
                <label key={method} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={store.paymentMethods?.includes(method.toLowerCase())}
                    onCheckedChange={() => togglePaymentMethod(method)}
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Switch checked={store.isOpen} onCheckedChange={(val) => handleChange('isOpen', val)} />
            <Label>{store.isOpen ? 'Loja Aberta' : 'Loja Fechada'}</Label>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
