"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Eye,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

type Order = {
  id: number
  customerName: string
  customerPhone: string
  status: string
  createdAt: string
  total: number
  items: any[]
  address?: string
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.push("/auth/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (user) fetchOrders()
  }, [user])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  const fetchOrders = async () => {
    try {
      setIsRefreshing(true)
      const token = document.cookie.split("token=")[1]
      const res = await fetch("http://localhost:3000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      // Add sample total and items if they don't exist in the API response
      const processedData = data.map((order: Order) => ({
        ...order,
        total: order.total || Math.floor(Math.random() * 200) + 50,
        items: order.items || [{ name: "Item de exemplo", quantity: 1 }],
      }))

      setOrders(processedData)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const filterOrders = () => {
    let result = [...orders]

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toString().includes(searchQuery),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(result)
  }

  const handleAdvance = async (orderId: number) => {
    const token = document.cookie.split("token=")[1]
    const currentStatus = orders.find((o) => o.id === orderId)?.status

    const nextStatus =
      currentStatus === "pendente" ? "em_producao" : currentStatus === "em_producao" ? "entregue" : null

    if (!nextStatus) return

    try {
      await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      })

      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order)))
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const handleCancel = async (orderId: number) => {
    const token = document.cookie.split("token=")[1]

    try {
      await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      setOrders((prev) => prev.filter((order) => order.id !== orderId))
    } catch (error) {
      console.error("Error canceling order:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        )
      case "em_producao":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Package className="h-3 w-3" />
            Em Produção
          </Badge>
        )
      case "entregue":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Entregue
          </Badge>
        )
      case "cancelado":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <X className="h-3 w-3" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status.replace("_", " ")}</Badge>
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            Pedidos
          </h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos recebidos pela sua loja</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por cliente ou número do pedido..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_producao">Em Produção</SelectItem>
            <SelectItem value="entregue">Entregue</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="production">Em Produção</TabsTrigger>
          <TabsTrigger value="delivered">Entregues</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhum pedido encontrado</h3>
                <p className="text-muted-foreground mt-1">Não encontramos pedidos com os filtros selecionados.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                >
                  Limpar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={handleAdvance}
                onCancel={handleCancel}
                onView={() => router.push(`/orders/${order.id}`)}
                getStatusBadge={getStatusBadge}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredOrders
            .filter((order) => order.status === "pendente")
            .map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={handleAdvance}
                onCancel={handleCancel}
                onView={() => router.push(`/orders/${order.id}`)}
                getStatusBadge={getStatusBadge}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))}
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          {filteredOrders
            .filter((order) => order.status === "em_producao")
            .map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={handleAdvance}
                onCancel={handleCancel}
                onView={() => router.push(`/orders/${order.id}`)}
                getStatusBadge={getStatusBadge}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {filteredOrders
            .filter((order) => order.status === "entregue")
            .map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={handleAdvance}
                onCancel={handleCancel}
                onView={() => router.push(`/orders/${order.id}`)}
                getStatusBadge={getStatusBadge}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

type OrderCardProps = {
  order: Order
  onAdvance: (id: number) => void
  onCancel: (id: number) => void
  onView: () => void
  getStatusBadge: (status: string) => React.ReactNode
  formatCurrency: (value: number) => string
  formatDate: (dateString: string) => string
}

function OrderCard({ order, onAdvance, onCancel, onView, getStatusBadge, formatCurrency, formatDate }: OrderCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Pedido #{order.id}</CardTitle>
              {getStatusBadge(order.status)}
            </div>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(order.createdAt)}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{formatCurrency(order.total)}</div>
            <div className="text-xs text-muted-foreground">
              {order.items.length} {order.items.length === 1 ? "item" : "itens"}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm font-medium">{order.customerName}</div>
                <div className="text-xs text-muted-foreground">Cliente</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm font-medium">{order.customerPhone}</div>
                <div className="text-xs text-muted-foreground">Telefone</div>
              </div>
            </div>
          </div>
          {order.address && (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{order.address}</div>
                  <div className="text-xs text-muted-foreground">Endereço de entrega</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4 flex flex-wrap gap-2 justify-between">
        <Button variant="outline" size="sm" onClick={onView} className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          Ver detalhes
        </Button>

        <div className="flex flex-wrap gap-2">
          {order.status === "pendente" && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => onAdvance(order.id)}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
              >
                <Package className="h-4 w-4" />
                Iniciar Produção
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(order.id)}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </>
          )}

          {order.status === "em_producao" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onAdvance(order.id)}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4" />
              Marcar como Entregue
            </Button>
          )}

          {(order.status === "entregue" || order.status === "cancelado") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  Ações
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Imprimir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

