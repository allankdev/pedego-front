'use client';

import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const paymentOptions = ['Pix', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'];

export function StoreSettingsForm() {
  const {
    store,
    setStore,
    loading,
    error,
    fetchStore,
    updateStore,
  } = useStoreSettings();

  useEffect(() => {
    fetchStore();
  }, []);

  const handleChange = (key: string, value: any) => {
    setStore((prev: any) => ({ ...prev, [key]: value }));
  };

  const togglePaymentMethod = (method: string) => {
    setStore((prev: any) => {
      const current = prev.paymentMethods || [];
      const methodLower = method.toLowerCase();
      return {
        ...prev,
        paymentMethods: current.includes(methodLower)
          ? current.filter((m: string) => m !== methodLower)
          : [...current, methodLower],
      };
    });
  };

  const handleSubmit = async () => {
    if (!store) return;
    const minOrderValue =
      store.minOrderValue === '' || store.minOrderValue === null
        ? null
        : parseFloat(store.minOrderValue);

    await updateStore({
      ...store,
      minOrderValue,
      paymentMethods: store.paymentMethods?.map((m: string) => m.toLowerCase()) || [],
    });
  };

  if (!store) return <p className="p-4">Carregando dados da loja...</p>;

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        {error && <p className="text-red-500">{error}</p>}

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
            onChange={(e) => handleChange('minOrderValue', e.target.value)}
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
  );
}