This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
src/
src/
│
├── app/                    # App Router (Páginas do Next.js)
│   ├── auth/               # Autenticação
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   ├── store/              # Restaurantes (subdomínios)
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── [subdomain]/    # Restaurante dinâmico por subdomínio
│   │   │   ├── page.tsx
│   │   │   ├── admin/      # Painel administrativo do restaurante
│   │   │   │   ├── dashboard/  # Dashboard do restaurante
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── products/   # Gerenciamento de produtos
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── orders/     # Gerenciamento de pedidos
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/   # Configurações do restaurante
│   │   │   │       └── page.tsx
│   ├── orders/             # Pedidos
│   │   ├── page.tsx        # Listagem de pedidos
│   │   ├── [id]/           # Detalhe do pedido
│   │   │   └── page.tsx
│   ├── checkout/           # Checkout de pedidos
│   │   └── page.tsx
│   ├── notifications/      # Notificações do usuário
│   │   └── page.tsx
│   ├── admin/              # Área administrativa global
│   │   ├── dashboard/      # Dashboard global
│   │   │   └── page.tsx
│   │   ├── stores/         # Gerenciamento de restaurantes
│   │   │   └── page.tsx
│   │   ├── users/          # Gerenciamento de usuários
│   │   │   └── page.tsx
│   │   ├── orders/         # Gerenciamento de pedidos globais
│   │   │   └── page.tsx
│   │   └── settings/       # Configurações globais da plataforma
│   │       └── page.tsx
│   ├── user/               # Área do usuário
│   │   ├── dashboard/      # Dashboard do usuário
│   │   │   └── page.tsx
│   │   ├── orders/         # Pedidos do usuário
│   │   │   └── page.tsx
│   │   ├── favorites/      # Restaurantes favoritos
│   │   │   └── page.tsx
│   │   └── settings/       # Configurações do usuário
│   │       └── page.tsx
│   ├── layout.tsx          # Layout principal
│
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Componentes de UI (botões, inputs, modais)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   ├── layout/             # Estrutura da página
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   ├── store/              # Componentes específicos de restaurantes
│   │   ├── StoreCard.tsx
│   ├── order/              # Componentes específicos de pedidos
│   │   ├── OrderCard.tsx
│   ├── notifications/      # Notificações
│   │   ├── Notification.tsx
│   ├── dashboard/          # Componentes específicos para dashboards
│   │   ├── AdminDashboard.tsx
│   │   ├── StoreDashboard.tsx
│   │   ├── UserDashboard.tsx
│
├── hooks/                  # Hooks personalizados para consumo da API
│   ├── useAuth.ts
│   ├── useOrders.ts
│   ├── useProducts.ts
│   ├── useStores.ts
│   ├── useUsers.ts
│   ├── useNotifications.ts
│   ├── usePayments.ts
│   ├── useDeliveries.ts
│   ├── useGeolocation.ts
│   ├── useStock.ts
│
├── lib/                    # Lógica e chamadas à API
│   ├── api/                # Serviços da API
│   │   ├── auth.ts
│   │   ├── orders.ts
│   │   ├── products.ts
│   │   ├── stores.ts
│   │   ├── users.ts
│   │   ├── notifications.ts
│   │   ├── payments.ts
│   │   ├── deliveries.ts
│   │   ├── geolocation.ts
│   │   ├── stock.ts
│   ├── store/              # Zustand para gerenciamento de estado
│   │   ├── authStore.ts
│   │   ├── orderStore.ts
│   │   ├── productStore.ts
│   │   ├── storeStore.ts
│   ├── utils/              # Funções auxiliares
│
├── providers/              # Provedores de contexto
│   ├── AuthProvider.tsx
│   ├── StoreProvider.tsx
│
├── styles/                 # Estilos globais (Tailwind)
│   ├── globals.css
│   ├── theme.ts
│
└── types/                  # Definições de tipos TypeScript
    ├── auth.ts
    ├── order.ts
    ├── product.ts
    ├── store.ts
    ├── user.ts
    ├── dashboard.ts