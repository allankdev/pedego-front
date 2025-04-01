'use client';

type Props = {
  status: 'pendente' | 'em_producao' | 'entregue' | 'cancelado';
};

const statusSteps = ['pendente', 'em_producao', 'entregue'] as const;

export function OrderStatusTracker({ status }: Props) {
  const getStepIndex = (status: string) => statusSteps.indexOf(status as any);

  return (
    <div className="mb-6">
      <p className="font-medium mb-2">⏱ Status do pedido:</p>
      <div className="flex items-center justify-between">
        {statusSteps.map((step, index) => (
          <div key={step} className="flex-1 text-center">
            <div
              className={`w-4 h-4 mx-auto rounded-full ${
                index <= getStepIndex(status)
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}
            />
            <p className="text-sm mt-1 capitalize">{step.replace('_', ' ')}</p>
          </div>
        ))}
      </div>

      <div className="mt-2 text-center">
        {status === 'pendente' && (
          <p className="text-yellow-600">⏳ Seu pedido está aguardando confirmação da loja...</p>
        )}
        {status === 'em_producao' && (
          <p className="text-blue-600">👨‍🍳 Seu pedido está sendo preparado!</p>
        )}
        {status === 'entregue' && (
          <p className="text-green-600">✅ Pedido entregue. Bom apetite!</p>
        )}
        {status === 'cancelado' && (
          <p className="text-red-600">❌ Pedido cancelado pela loja.</p>
        )}
      </div>
    </div>
  );
}
