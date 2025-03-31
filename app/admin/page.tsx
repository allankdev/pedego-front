"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  Box,
  Calendar,
  Clock,
  CreditCard,
  Home,
  MapPin,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Store,
  TrendingUp,
} from "lucide-react"

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    subscription: "trial",
    totalCoupons: 0,
    totalNeighborhoods: 0,
    totalOpeningHours: 0,
  })

  const [storeStatus, setStoreStatus] = useState<boolean>(false)

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.push("/auth/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (user) fetchStats()
  }, [user])

  const fetchStats = async () => {
    const token = document.cookie.split("token=")[1]

    const [ordersRes, productsRes, subscriptionRes, couponsRes, neighborhoodsRes, openingHoursRes, storeRes] =
      await Promise.all([
        fetch("http://localhost:3000/api/orders/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:3000/api/subscriptions/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/coupons", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/neighborhoods/" + user?.store?.id, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/opening-hours/" + user?.store?.id, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:3000/api/stores/${user?.store?.subdomain}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

    const orders = await ordersRes.json()
    const products = await productsRes.json()
    const subscription = await subscriptionRes.json()
    const coupons = await couponsRes.json()
    const neighborhoods = await neighborhoodsRes.json()
    const openingHours = await openingHoursRes.json()
    const store = await storeRes.json()

    setStats({
      totalOrders: orders.length || 0,
      totalProducts: products.length || 0,
      subscription: subscription?.type || "trial",
      totalCoupons: coupons.length || 0,
      totalNeighborhoods: neighborhoods.length || 0,
      totalOpeningHours: openingHours.length || 0,
    })

    setStoreStatus(store?.isOpen)
  }

  const toggleStoreStatus = async () => {
    const token = document.cookie.split("token=")[1]
    const subdomain = user?.store?.subdomain
    if (!subdomain) return

    const res = await fetch(`http://localhost:3000/api/stores/${subdomain}/toggle-open`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      setStoreStatus(!storeStatus)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const getSubscriptionBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "premium":
        return "default"
      case "pro":
        return "secondary"
      case "business":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <div className="flex h-14 items-center border-b px-4">
          <Store className="h-6 w-6 mr-2" />
          <h1 className="font-semibold text-lg">Admin Dashboard</h1>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin")}>
              <Home className="mr-2 h-4 w-4" />
              Início
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/products")}>
              <Package className="mr-2 h-4 w-4" />
              Produtos
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/orders")}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Pedidos
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/coupons")}>
              <Percent className="mr-2 h-4 w-4" />
              Cupons
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/neighborhoods")}>
              <MapPin className="mr-2 h-4 w-4" />
              Bairros
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/opening-hours")}>
              <Clock className="mr-2 h-4 w-4" />
              Horários
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/reports")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Relatórios
            </Button>
            <Separator className="my-2" />
            <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/upgrade")}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Upgrade de Plano
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button variant="outline" size="icon" className="md:hidden">
            <Store className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${storeStatus ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm font-medium">{storeStatus ? "Loja Aberta" : "Loja Fechada"}</span>
            </div>
            <Switch checked={storeStatus} onCheckedChange={toggleStoreStatus} />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Bem-vindo, {user?.store?.name || user.name}</h1>
                <p className="text-muted-foreground">Aqui está um resumo da sua loja hoje.</p>
              </div>
              <Badge variant={getSubscriptionBadgeVariant(stats.subscription)} className="text-sm capitalize px-3 py-1">
                <CreditCard className="mr-1 h-3.5 w-3.5" />
                Plano {stats.subscription}
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Pedidos Recebidos</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Total de pedidos processados</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
                  <Box className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Itens disponíveis para venda</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Cupons de Desconto</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCoupons}</div>
                  <p className="text-xs text-muted-foreground">Promoções ativas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Bairros Cadastrados</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalNeighborhoods}</div>
                  <p className="text-xs text-muted-foreground">Áreas de entrega</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Horários de Funcionamento</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOpeningHours}</div>
                  <p className="text-xs text-muted-foreground">Períodos configurados</p>
                </CardContent>
              </Card>
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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Acesse as principais funcionalidades da sua loja</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4"
                    onClick={() => router.push("/admin/products")}
                  >
                    <Package className="h-6 w-6" />
                    <span className="text-sm">Gerenciar Produtos</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4"
                    onClick={() => router.push("/admin/orders")}
                  >
                    <ShoppingBag className="h-6 w-6" />
                    <span className="text-sm">Ver Pedidos</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4"
                    onClick={() => router.push("/admin/reports")}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">Ver Relatórios</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4"
                    onClick={() => router.push("/admin/coupons")}
                  >
                    <Percent className="h-6 w-6" />
                    <span className="text-sm">Gerenciar Cupons</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4"
                    onClick={() => router.push("/admin/neighborhoods")}
                  >
                    <MapPin className="h-6 w-6" />
                    <span className="text-sm">Gerenciar Bairros</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4"
                    onClick={() => router.push("/admin/opening-hours")}
                  >
                    <Clock className="h-6 w-6" />
                    <span className="text-sm">Gerenciar Horários</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4"
                    onClick={() => router.push("/admin/upgrade")}
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">Upgrade de Plano</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4"
                    onClick={() => router.push("/admin/settings")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-sm">Configurações</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

