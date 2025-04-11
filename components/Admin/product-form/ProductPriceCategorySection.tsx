"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DollarSign, Tag, Plus, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"

interface Props {
  price: string
  setPrice: (val: string) => void
  categoryId: number | null
  setCategoryId: (id: number) => void
}

export function ProductPriceCategorySection({ price, setPrice, categoryId, setCategoryId }: Props) {
  const { user } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error"
    message: string
  } | null>(null)

  useEffect(() => {
    if (!user?.store?.id) return

    const fetchCategories = async () => {
      try {
        const token = document.cookie.split("token=")[1]
        const res = await fetch(`http://localhost:3000/api/categories/${user.store.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setCategories(data)

        // se já tiver um categoryId mas a categoria ainda não está na lista, adiciona
        if (categoryId && !data.find((cat: any) => cat.id === categoryId)) {
          const current = await fetch(`http://localhost:3000/api/categories/single/${categoryId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const currentCat = await current.json()
          setCategories((prev) => [...prev, currentCat])
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err)
      }
    }

    fetchCategories()
  }, [user, categoryId])

  const createCategory = async () => {
    if (!newCategory.trim()) return
    setCreatingCategory(true)

    try {
      const token = document.cookie.split("token=")[1]
      const res = await fetch(`http://localhost:3000/api/categories/${user?.store?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      })

      if (!res.ok) throw new Error("Erro ao criar categoria")
      const created = await res.json()
      setCategories((prev) => [...prev, created])
      setCategoryId(created.id)
      setNewCategory("")

      setNotification({
        show: true,
        type: "success",
        message: "Categoria criada com sucesso!",
      })
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      console.error("Erro ao criar categoria:", err)
      setNotification({
        show: true,
        type: "error",
        message: "Erro ao criar categoria.",
      })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setCreatingCategory(false)
    }
  }

  const formatCurrency = (value: string | number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) || 0)

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir apenas números e um único ponto decimal
    let value = e.target.value

    // Substituir vírgula por ponto para decimal
    value = value.replace(",", ".")

    // Remover caracteres inválidos (manter apenas números e um ponto)
    value = value.replace(/[^\d.]/g, "")

    // Garantir que há apenas um ponto decimal
    const parts = value.split(".")
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("")
    }

    setPrice(value)
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-slate-500" />
          Preço e Categoria
        </h3>
        <Separator className="my-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-slate-700">Preço</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
            <Input
              type="text"
              inputMode="decimal"
              value={price}
              onChange={handlePriceChange}
              required
              className="pl-10 focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
            />
          </div>
          {price && (
            <motion.p
              className="text-sm text-slate-600 font-medium"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {formatCurrency(price)}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700 flex items-center gap-2">
            <Tag className="h-4 w-4 text-slate-500" />
            Categoria
          </Label>
          <Select value={categoryId?.toString()} onValueChange={(val) => setCategoryId(Number(val))}>
            <SelectTrigger className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 pt-2">
            <Input
              placeholder="Nova categoria"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                onClick={createCategory}
                disabled={creatingCategory || !newCategory.trim()}
                className="bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {creatingCategory ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
