'use client';

import { Button } from '@/components/ui/button';

type Props = {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItemCard({ item, onIncrease, onDecrease, onRemove }: Props) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm">R$ {item.price.toFixed(2)} x {item.quantity}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button size="sm" onClick={onDecrease}>-</Button>
          <span>{item.quantity}</span>
          <Button size="sm" onClick={onIncrease}>+</Button>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onRemove}>
        Remover
      </Button>
    </div>
  );
}
