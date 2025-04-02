"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Clock,
  Plus,
  Pencil,
  Trash,
  Loader2,
  AlertCircle,
  CalendarDays,
  ArrowLeft,
} from "lucide-react"
import Cookie from "js-cookie"
import { useAuth } from "@/hooks/useAuth"

const daysOfWeek = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"]

const dayColors = {
  segunda: "bg-blue-50 border-blue-200 text-blue-700",
  terça: "bg-purple-50 border-purple-200 text-purple-700",
  quarta: "bg-green-50 border-green-200 text-green-700",
  quinta: "bg-amber-50 border-amber-200 text-amber-700",
  sexta: "bg-pink-50 border-pink-200 text-pink-700",
  sábado: "bg-orange-50 border-orange-200 text-orange-700",
  domingo: "bg-red-50 border-red-200 text-red-700",
}

export function OpeningHourForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [hours, setHours] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({ day: "", open: "", close: "" })

  const fetchHours = async () => {
    setLoading(true)
    setError(null)
    const token = Cookie.get("token")

    try {
      const res = await fetch(`http://localhost:3000/api/opening-hours/${user?.store?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setHours(Array.isArray(data) ? data : [])
    } catch {
      setError("Erro ao buscar horários. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.store?.id) fetchHours()
  }, [user])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm({ day: "", open: "", close: "" })
    setEditing(null)
  }

  const handleSubmit = async () => {
    if (!form.day || !form.open || !form.close) {
      setError("Preencha todos os campos")
      return
    }

    setSubmitting(true)
    setError(null)
    const token = Cookie.get("token")

    try {
      const method = editing ? "PUT" : "POST"
      const url = editing
        ? `http://localhost:3000/api/opening-hours/${editing.id}`
        : `http://localhost:3000/api/opening-hours/${user?.store?.id}`

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.message || "Erro ao salvar horário")
        return
      }

      fetchHours()
      resetForm()
    } catch {
      setError("Erro ao salvar horário. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (hour: any) => {
    setEditing(hour)
    setForm({ day: hour.day, open: hour.open, close: hour.close })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja remover este horário?")) return
    const token = Cookie.get("token")

    try {
      await fetch(`http://localhost:3000/api/opening-hours/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchHours()
    } catch {
      setError("Erro ao remover horário.")
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>        
        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Dashboard
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Editar Horário" : "Novo Horário"}</CardTitle>
            <CardDescription>
              {editing ? "Atualize o horário de funcionamento" : "Adicione um horário por dia da semana"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Dia da semana
              </Label>
              {editing ? (
                <div className="mt-1 font-medium capitalize">{form.day}</div>
              ) : (
                <select
                  value={form.day}
                  onChange={(e) => handleChange("day", e.target.value)}
                  className="w-full mt-1 border rounded px-3 py-2 text-sm"
                >
                  <option value="">Selecione o dia</option>
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Abertura
                </Label>
                <Input type="time" value={form.open} onChange={(e) => handleChange("open", e.target.value)} />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Fechamento
                </Label>
                <Input type="time" value={form.close} onChange={(e) => handleChange("close", e.target.value)} />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-2">
              {editing && (
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Cancelar
                </Button>
              )}
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : editing ? (
                  <Pencil className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {editing ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horários Cadastrados</CardTitle>
            <CardDescription>Lista por dia da semana</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : hours.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-md bg-muted/40">
                <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Nenhum horário cadastrado</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-2">
                <div className="space-y-3">
                  {hours
                    .sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day))
                    .map((hour) => (
                      <div
                        key={hour.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md hover:bg-muted/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 flex items-center justify-center rounded-full border ${dayColors[hour.day]}`}>                            <span className="text-xs font-bold">{hour.day.slice(0, 3).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-semibold capitalize">{hour.day}</p>
                            <p className="text-xs text-muted-foreground">
                              {hour.open.slice(0, 5)} - {hour.close.slice(0, 5)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0 flex-wrap justify-end">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(hour)} className="px-2">
                            <Pencil size={14} className="mr-1" /> Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(hour.id)}
                            className="px-2 text-destructive hover:bg-destructive/10"
                          >
                            <Trash size={14} className="mr-1" /> Remover
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
