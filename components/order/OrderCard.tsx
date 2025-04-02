"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Check,
  ChevronDown,
  Eye,
  Package,
  Phone,
  Truck,
  User,
  X,
  ArrowRight,
} from "lucide-react"
import type { Order } from "@/types/order"

type Props = {
  order: Order
  onAdvance: (id: number) => void
  onCancel: (id: number) => void
  onView: () => void
  getStatusBadge: (status: string) => React.ReactNode
  formatCurrency: (value: number) => string
  formatDate: (date: string) => string
}

export function OrderCard({
  order,
  onAdvance,
  onCancel,
  onView,
  getStatusBadge,
  formatCurrency,
  formatDate,
}: Props) {
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
