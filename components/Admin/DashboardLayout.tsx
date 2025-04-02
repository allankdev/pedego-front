"use client"

import {
  Home,
  Package,
  ShoppingBag,
  Percent,
  MapPin,
  Clock,
  BarChart3,
  Settings,
  Store,
  ShoppingCart,
  Box,
  Layers,
  Bell,
  Menu,
  User,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface AdminDashboardLayoutProps {
  user: any
  stats: any
  storeStatus: boolean
  toggleStoreStatus: () => void
  loading: boolean
}

export function DashboardLayout({ user, stats, storeStatus, toggleStoreStatus }: AdminDashboardLayoutProps) {
  const router = useRouter()

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const menuItems = [
    { label: "Início", icon: Home, path: "/admin" },
    { label: "Produtos", icon: Package, path: "/admin/products" },
    { label: "Pedidos", icon: ShoppingBag, path: "/admin/orders" },
    { label: "Cupons", icon: Percent, path: "/admin/coupons" },
    { label: "Bairros", icon: MapPin, path: "/admin/neighborhoods" },
    { label: "Horários", icon: Clock, path: "/admin/opening-hours" },
    { label: "Relatórios", icon: BarChart3, path: "/admin/reports" },
    { label: "Categorias", icon: Layers, path: "/admin/categories" },
    { label: "Configurações", icon: Settings, path: "/admin/settings" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-semibold">Admin Dashboard</h1>
        </div>

        <div className="flex-1 overflow-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map(({ label, icon: Icon, path }) => (
              <Button
                key={path}
                variant={path === "/admin" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => router.push(path)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="px-2 py-2">
            <div className="rounded-lg bg-muted/30 p-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">{user?.store?.name || "Sua Loja"}</p>
                <Badge variant="outline" className="text-xs">
                  {stats.subscription}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${storeStatus ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-xs">{storeStatus ? "Loja Aberta" : "Loja Fechada"}</span>
                </div>
                <Switch checked={storeStatus} onCheckedChange={toggleStoreStatus} className="h-4 w-7" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-3 left-3 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="h-16 border-b px-6 flex flex-row items-center">
            <div className="bg-primary/10 p-1.5 rounded-md mr-2">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <SheetTitle>Admin Dashboard</SheetTitle>
          </SheetHeader>
          <div className="py-4 px-3">
            <div className="space-y-1">
              {menuItems.map(({ label, icon: Icon, path }) => (
                <Button
                  key={path}
                  variant={path === "/admin" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => router.push(path)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-6">
          <div className="w-8 md:hidden" /> {/* Spacer for mobile menu button */}
          <div className="hidden md:block font-medium">Dashboard</div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full md:hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Bem-vindo, {user?.name?.split(" ")[0] || "Usuário"}
                </h1>
                <p className="text-muted-foreground mt-1">Resumo da sua loja</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${storeStatus ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm mr-2">{storeStatus ? "Loja Aberta" : "Loja Fechada"}</span>
                <Switch checked={storeStatus} onCheckedChange={toggleStoreStatus} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Pedidos",
                  value: stats.totalOrders,
                  icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
                },
                {
                  title: "Produtos",
                  value: stats.totalProducts,
                  icon: <Box className="h-4 w-4 text-muted-foreground" />,
                },
                {
                  title: "Cupons",
                  value: stats.totalCoupons,
                  icon: <Percent className="h-4 w-4 text-muted-foreground" />,
                },
                {
                  title: "Bairros",
                  value: stats.totalNeighborhoods,
                  icon: <MapPin className="h-4 w-4 text-muted-foreground" />,
                },
              ].map(({ title, value, icon }) => (
                <Card key={title} className="border-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    {icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        icon: ShoppingBag,
                        title: "Novo pedido recebido",
                        time: "5 min",
                        description: "Pedido #1234 - R$ 75,90",
                      },
                      {
                        icon: Package,
                        title: "Produto atualizado",
                        time: "2h",
                        description: "X-Tudo Especial - Preço alterado",
                      },
                      { icon: Percent, title: "Cupom criado", time: "1d", description: "BEMVINDO10 - 10% de desconto" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{item.title}</p>
                            <Badge variant="outline" className="text-xs">
                              {item.time}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Package, label: "Novo Produto", path: "/admin/products/new" },
                      { icon: Percent, label: "Criar Cupom", path: "/admin/coupons" },
                      { icon: MapPin, label: "Bairros", path: "/admin/neighborhoods" },
                      { icon: Settings, label: "Configurações", path: "/admin/settings" },
                    ].map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-10"
                        onClick={() => router.push(action.path)}
                      >
                        <action.icon className="h-4 w-4 mr-2" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

