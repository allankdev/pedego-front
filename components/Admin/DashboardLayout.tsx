"use client";

import {
  Home,
  Package,
  ShoppingBag,
  Percent,
  MapPin,
  Clock,
  BarChart3,
  TrendingUp,
  Settings,
  Store,
  ShoppingCart,
  Box,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface AdminDashboardLayoutProps {
  user: any;
  stats: any;
  storeStatus: boolean;
  toggleStoreStatus: () => void;
  loading: boolean;
}

export function DashboardLayout({ user, stats, storeStatus, toggleStoreStatus }: AdminDashboardLayoutProps) {
  const router = useRouter();

  const getSubscriptionBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "premium": return "default";
      case "pro": return "secondary";
      case "business": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <div className="flex h-14 items-center border-b px-4">
          <Store className="h-6 w-6 mr-2" />
          <h1 className="font-semibold text-lg">Admin Dashboard</h1>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {[{ label: 'Início', icon: Home, path: '/admin' },
              { label: 'Produtos', icon: Package, path: '/admin/products' },
              { label: 'Pedidos', icon: ShoppingBag, path: '/admin/orders' },
              { label: 'Cupons', icon: Percent, path: '/admin/coupons' },
              { label: 'Bairros', icon: MapPin, path: '/admin/neighborhoods' },
              { label: 'Horários', icon: Clock, path: '/admin/opening-hours' },
              { label: 'Relatórios', icon: BarChart3, path: '/admin/reports' },
              { label: 'Upgrade de Plano', icon: TrendingUp, path: '/admin/upgrade' },
              { label: 'Configurações', icon: Settings, path: '/admin/settings' }
            ].map(({ label, icon: Icon, path }) => (
              <Button key={path} variant="ghost" className="justify-start" onClick={() => router.push(path)}>
                <Icon className="mr-2 h-4 w-4" /> {label}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${storeStatus ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm font-medium">{storeStatus ? "Loja Aberta" : "Loja Fechada"}</span>
            </div>
            <Switch checked={storeStatus} onCheckedChange={toggleStoreStatus} />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Bem-vindo, {user?.store?.name || user.name}</h1>
                <p className="text-muted-foreground">Aqui está um resumo da sua loja hoje.</p>
              </div>
              <Badge variant={getSubscriptionBadgeVariant(stats.subscription)} className="text-sm capitalize px-3 py-1">
                <CreditCard className="mr-1 h-3.5 w-3.5" /> Plano {stats.subscription}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[{
                title: 'Pedidos Recebidos',
                value: stats.totalOrders,
                icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />, subtitle: 'Total de pedidos processados'
              }, {
                title: 'Produtos Cadastrados',
                value: stats.totalProducts,
                icon: <Box className="h-4 w-4 text-muted-foreground" />, subtitle: 'Itens disponíveis para venda'
              }, {
                title: 'Cupons de Desconto',
                value: stats.totalCoupons,
                icon: <Percent className="h-4 w-4 text-muted-foreground" />, subtitle: 'Promoções ativas'
              }, {
                title: 'Bairros Cadastrados',
                value: stats.totalNeighborhoods,
                icon: <MapPin className="h-4 w-4 text-muted-foreground" />, subtitle: 'Áreas de entrega'
              }, {
                title: 'Horários de Funcionamento',
                value: stats.totalOpeningHours,
                icon: <Calendar className="h-4 w-4 text-muted-foreground" />, subtitle: 'Períodos configurados'
              }].map(({ title, value, icon, subtitle }) => (
                <Card key={title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    {icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                  </CardContent>
                </Card>
              ))}
              <Card className="bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Status da Loja</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{storeStatus ? "Aberta" : "Fechada"}</div>
                    <Switch
                      checked={storeStatus}
                      onCheckedChange={toggleStoreStatus}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {storeStatus ? "Aceitando pedidos" : "Pedidos desativados"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}