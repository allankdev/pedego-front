import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import type { Order } from "@/types/order"

export function useOrders() {
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
  }, [isLoading, user])

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
      const processed = data.map((order: Order) => ({
        ...order,
        total: order.total || 0,
        items: order.items || [],
      }))
      setOrders(processed)
    } catch (err) {
      console.error("Erro ao buscar pedidos", err)
    } finally {
      setIsRefreshing(false)
    }
  }

  const filterOrders = () => {
    let result = [...orders]
    if (searchQuery) {
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.id.toString().includes(searchQuery)
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter)
    }
    setFilteredOrders(result)
  }

  const handleAdvance = async (orderId: number) => {
    const token = document.cookie.split("token=")[1]
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    const next =
      order.status === "pendente"
        ? "em_producao"
        : order.status === "em_producao"
        ? "entregue"
        : null

    if (!next) return

    try {
      await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: next }),
      })
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: next } : o))
      )
    } catch (err) {
      console.error("Erro ao atualizar pedido", err)
    }
  }

  const handleCancel = async (orderId: number) => {
    const token = document.cookie.split("token=")[1]
    try {
      await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
    } catch (err) {
      console.error("Erro ao cancelar pedido", err)
    }
  }

  return {
    orders,
    filteredOrders,
    fetchOrders,
    handleAdvance,
    handleCancel,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isRefreshing,
    isLoading,
  }
}
