"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Plus, Pencil, Trash, ArrowLeft, Loader2, AlertCircle, DollarSign } from "lucide-react"
import Cookie from "js-cookie"
import { useAuth } from "@/hooks/useAuth"

export function NeighborhoodForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [neighborhoods, setNeighborhoods] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    deliveryFee: "",
  })

  const fetchNeighborhoods = async () => {
    setIsLoading(true)
    setError(null)
    const token = Cookie.get("token")
    if (!token || !user?.store?.id) {
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/api/neighborhoods/${user?.store?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.message || "Erro ao buscar bairros")
        return
      }

      const data = await res.json()
      setNeighborhoods(Array.isArray(data) ? data : [])
    } catch (error) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.store?.id) fetchNeighborhoods()
  }, [user])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.deliveryFee) return

    setIsSubmitting(true)
    setError(null)
    const token = Cookie.get("token")
    if (!token || !user?.store?.id) {
      setIsSubmitting(false)
      return
    }

    try {
      const method = editing ? "PUT" : "POST"
      const url = editing
        ? `http://localhost:3000/api/neighborhoods/${editing.id}`
        : `http://localhost:3000/api/neighborhoods/${user?.store?.id}`

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          deliveryFee: Number.parseFloat(form.deliveryFee),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.message || `Erro ao ${editing ? "editar" : "criar"} bairro`)
        return
      }

      fetchNeighborhoods()
      resetForm()
    } catch (error) {
      setError(`Erro ao ${editing ? "editar" : "criar"} bairro. Tente novamente.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (bairro: any) => {
    setEditing(bairro)
    setForm({
      name: bairro.name,
      deliveryFee: bairro.deliveryFee.toString(),
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este bairro?")) return

    setError(null)
    const token = Cookie.get("token")
    if (!token) return

    try {
      const res = await fetch(`http://localhost:3000/api/neighborhoods/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.message || "Erro ao excluir bairro")
        return
      }

      fetchNeighborhoods()
    } catch (error) {
      setError("Erro ao excluir bairro. Tente novamente.")
    }
  }

  const resetForm = () => {
    setForm({ name: "", deliveryFee: "" })
    setEditing(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" className="mb-4" onClick={() => router.push("/admin")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao Dashboard
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">{editing ? "Editar Bairro" : "Novo Bairro"}</CardTitle>
            <CardDescription>
              {editing ? "Modifique as informações do bairro" : "Adicione um novo bairro e defina a taxa de entrega"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="neighborhood-name" className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Nome do bairro</span>
                </Label>
                <Input
                  id="neighborhood-name"
                  placeholder="Ex: Centro, Jardim América..."
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-fee" className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>Taxa de entrega</span>
                </Label>
                <Input
                  id="delivery-fee"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 5.00"
                  value={form.deliveryFee}
                  onChange={(e) => handleChange("deliveryFee", e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                {editing && (
                  <Button variant="outline" onClick={resetForm} className="flex-1">
                    Cancelar
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !form.name || !form.deliveryFee}
                  className={`${editing ? "flex-1" : "w-full"}`}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : editing ? (
                    <Pencil className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {editing ? "Salvar Alterações" : "Adicionar Bairro"}
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

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Bairros Cadastrados</CardTitle>
              <CardDescription>Lista de bairros e taxas de entrega</CardDescription>
            </div>
            {neighborhoods.length > 0 && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                <MapPin className="mr-1 h-3.5 w-3.5" /> {neighborhoods.length}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : neighborhoods.length === 0 ? (
              <div className="text-center py-8 bg-muted/40 rounded-md border border-dashed">
                <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum bairro cadastrado</p>
                <p className="text-xs text-muted-foreground mt-1">Adicione bairros para definir áreas de entrega</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {neighborhoods.map((bairro) => (
                    <div
                      key={bairro.id}
                      className="flex items-center justify-between p-4 rounded-md border bg-background hover:bg-muted/20 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{bairro.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <DollarSign className="h-3.5 w-3.5" />
                          <span>Taxa de entrega: {formatCurrency(Number.parseFloat(bairro.deliveryFee))}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(bairro)} className="h-8 px-2">
                          <Pencil size={15} className="mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(bairro.id)}
                          className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash size={15} className="mr-1" />
                          Excluir
                        </Button>
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

