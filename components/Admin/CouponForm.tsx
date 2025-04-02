"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, Trash, Plus, Ticket, Calendar, Percent, Loader2, AlertCircle, Tag, ArrowLeft } from "lucide-react"
import Cookie from "js-cookie"
import { useRouter } from "next/navigation"

export function CouponForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: 0,
    expiresAt: "",
  })
  const [editCoupon, setEditCoupon] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchCoupons = async () => {
    setLoading(true)
    setError(null)
    const token = Cookie.get("token")
    if (!token || !user?.store?.subdomain) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.message || "Erro ao buscar cupons")
        return
      }

      const data = await res.json()
      if (Array.isArray(data)) {
        setCoupons(data)
      } else {
        setError("Erro ao obter os cupons. Tente novamente.")
      }
    } catch (error) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.store?.subdomain) fetchCoupons()
  }, [user])

  const createCoupon = async () => {
    setIsSubmitting(true)
    setError(null)
    const token = Cookie.get("token")
    if (!token || !user?.store?.id) {
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/api/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newCoupon,
          storeId: user.store.id,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setCoupons([...coupons, data])
        setNewCoupon({ code: "", discount: 0, expiresAt: "" })
      } else {
        const errorData = await res.json()
        setError(errorData.message || "Erro ao criar o cupom")
      }
    } catch (error) {
      setError("Erro ao criar o cupom. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateCoupon = async () => {
    setIsSubmitting(true)
    setError(null)
    const token = Cookie.get("token")
    if (!token || !editCoupon?.id) {
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/api/coupons/${editCoupon.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newCoupon }),
      })

      if (res.ok) {
        const updated = await res.json()
        setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        setEditCoupon(null)
        setNewCoupon({ code: "", discount: 0, expiresAt: "" })
      } else {
        const errorData = await res.json()
        setError(errorData.message || "Erro ao editar o cupom")
      }
    } catch (error) {
      setError("Erro ao atualizar o cupom. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteCoupon = async (id: string) => {
    setError(null)
    const token = Cookie.get("token")
    if (!token) return

    try {
      const res = await fetch(`http://localhost:3000/api/coupons/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id))
      } else {
        setError("Erro ao excluir o cupom. Tente novamente.")
      }
    } catch (error) {
      setError("Erro ao excluir o cupom. Tente novamente.")
    }
  }

  const handleEdit = (coupon: any) => {
    setEditCoupon(coupon)
    setNewCoupon({
      code: coupon.code,
      discount: coupon.discount,
      expiresAt: formatDateForInput(coupon.expiresAt),
    })
  }

  const cancelEdit = () => {
    setEditCoupon(null)
    setNewCoupon({ code: "", discount: 0, expiresAt: "" })
  }

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ""
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString

    // Otherwise, try to parse and format
    try {
      const date = new Date(dateString)
      return date.toISOString().split("T")[0]
    } catch (e) {
      return ""
    }
  }

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  const isExpired = (dateString: string) => {
    try {
      const expiryDate = new Date(dateString)
      return expiryDate < new Date()
    } catch (e) {
      return false
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" className="mb-4" onClick={() => router.push("/admin")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">{editCoupon ? "Editar Cupom" : "Novo Cupom"}</CardTitle>
            <CardDescription>
              {editCoupon ? "Modifique os detalhes do cupom" : "Crie um novo cupom promocional"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-code" className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5" />
                  <span>Código do cupom</span>
                </Label>
                <Input
                  id="coupon-code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="Ex: PROMO10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-discount" className="flex items-center gap-2">
                  <Percent className="h-3.5 w-3.5" />
                  <span>Desconto (%)</span>
                </Label>
                <Input
                  id="coupon-discount"
                  type="number"
                  min="1"
                  max="100"
                  value={newCoupon.discount || ""}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: Number.parseInt(e.target.value, 10) || 0 })}
                  placeholder="Ex: 10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-expiry" className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Data de Expiração</span>
                </Label>
                <Input
                  id="coupon-expiry"
                  type="date"
                  value={newCoupon.expiresAt}
                  onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-2">
                {editCoupon && (
                  <Button variant="outline" onClick={cancelEdit} className="flex-1">
                    Cancelar
                  </Button>
                )}
                <Button
                  onClick={editCoupon ? updateCoupon : createCoupon}
                  disabled={isSubmitting || !newCoupon.code || !newCoupon.discount || !newCoupon.expiresAt}
                  className={`${editCoupon ? "flex-1" : "w-full"}`}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {editCoupon ? "Salvar Alterações" : "Criar Cupom"}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Cupons Disponíveis</CardTitle>
              <CardDescription>Lista de todos os cupons promocionais da sua loja</CardDescription>
            </div>
            {coupons.length > 0 && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Ticket className="mr-1 h-3.5 w-3.5" /> {coupons.length}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-8 bg-muted/40 rounded-md border border-dashed">
                <Ticket className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum cupom encontrado</p>
                <p className="text-xs text-muted-foreground mt-1">Crie seu primeiro cupom para começar</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className={`p-4 rounded-md transition-all border ${
                        isExpired(coupon.expiresAt) ? "bg-muted/40 opacity-70" : "bg-background hover:bg-muted/20"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-mono">
                              {coupon.code}
                            </Badge>
                            {isExpired(coupon.expiresAt) && (
                              <Badge
                                variant="outline"
                                className="text-destructive border-destructive/20 bg-destructive/10"
                              >
                                Expirado
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Percent className="h-3.5 w-3.5" />
                              <span>{coupon.discount}% de desconto</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Válido até {formatDateForDisplay(coupon.expiresAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-auto">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(coupon)}
                            className="h-8 px-2"
                            disabled={isSubmitting}
                          >
                            <Pencil size={15} className="mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteCoupon(coupon.id.toString())}
                            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={isSubmitting}
                          >
                            <Trash size={15} className="mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

