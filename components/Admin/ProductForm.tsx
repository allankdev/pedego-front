"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import {
  AlertCircle,
  Loader2,
  Plus,
  Save,
  Tag,
  DollarSign,
  FileText,
  ShoppingBag,
  ImageIcon,
  X,
  CheckCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

interface Props {
  initialData?: {
    id: number
    name: string
    description: string
    price: string
    available: boolean
    categoryId?: number
    imageId?: string
  }
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({ initialData, onSuccess, onCancel }: Props) {
  const { user } = useAuth()
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [price, setPrice] = useState(initialData?.price || "")
  const [available, setAvailable] = useState(initialData?.available ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageId ? `https://pub-89335a236e764dca827836a2c27c4115.r2.dev/${initialData.imageId}` : null,
  )

  const [categories, setCategories] = useState<any[]>([])
  const [categoryId, setCategoryId] = useState<number | null>(initialData?.categoryId || null)
  const [newCategory, setNewCategory] = useState("")
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error"
    message: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      } catch (err) {
        console.error("Erro ao carregar categorias:", err)
        setError("Erro ao carregar categorias")
      }
    }
    fetchCategories()
  }, [user])

  const createCategory = async () => {
    if (!newCategory.trim()) return
    setCreatingCategory(true)
    setError(null)

    try {
      const token = document.cookie.split("token=")[1]
      const res = await fetch(`http://localhost:3000/api/categories/${user.store.id}`, {
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

      // Mostrar notificação de sucesso
      setNotification({
        show: true,
        type: "success",
        message: "Categoria criada com sucesso!",
      })
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      console.error("Erro ao criar categoria:", err)
      setError("Erro ao criar categoria")

      // Mostrar notificação de erro
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const parsedPrice = Number.parseFloat(price)
    if (isNaN(parsedPrice)) {
      setError("Preço inválido")
      setLoading(false)

      // Mostrar notificação de erro
      setNotification({
        show: true,
        type: "error",
        message: "Preço inválido. Por favor, verifique o valor.",
      })
      setTimeout(() => setNotification(null), 3000)

      return
    }

    try {
      const token = document.cookie.split("token=")[1]
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", parsedPrice.toString())
      formData.append("available", String(available))
      if (categoryId) formData.append("categoryId", categoryId.toString())
      if (user?.store?.id) formData.append("storeId", user.store.id.toString())
      if (file) formData.append("file", file)

      console.log("Enviando produto:", Object.fromEntries(formData.entries()))

      const res = await fetch(`http://localhost:3000/api/products${initialData ? `/${initialData.id}` : ""}`, {
        method: initialData ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Erro na resposta da API (texto):", text)
        throw new Error("Erro ao salvar produto")
      }

      // Mostrar animação de sucesso
      setSaveSuccess(true)

      // Mostrar notificação de sucesso
      setNotification({
        show: true,
        type: "success",
        message: initialData ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!",
      })

      // Resetar estado de sucesso após 2 segundos
      setTimeout(() => {
        setSaveSuccess(false)
        onSuccess()
      }, 1500)
    } catch (err) {
      console.error("Erro no envio do produto:", err)
      setError("Erro ao salvar produto")

      // Mostrar notificação de erro
      setNotification({
        show: true,
        type: "error",
        message: "Erro ao salvar produto. Tente novamente.",
      })
      setTimeout(() => setNotification(null), 3000)

      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setPreviewUrl(null)
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatCurrency = (value: string) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) || 0)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p className="font-medium">{notification.message}</p>
          </div>
        </motion.div>
      )}

      <Card className="shadow-md border-slate-200 overflow-hidden">
        <CardHeader className="pb-3 border-b bg-gradient-to-r from-slate-50 to-slate-100">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-slate-600" />
            {initialData ? "Editar Produto" : "Novo Produto"}
          </CardTitle>
          <CardDescription>
            {initialData ? "Atualize as informações do produto" : "Adicione um novo produto ao catálogo"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                Informações Básicas
              </h3>
              <Separator className="my-2" />
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-slate-700">Nome do produto</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Descrição</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[100px] focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                />
              </div>
            </div>

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
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-slate-500" />
                Imagem do Produto
              </h3>
              <Separator className="my-2" />
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                />
                {previewUrl && (
                  <motion.div
                    className="relative w-40 h-40 mt-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="rounded-md border w-full h-full object-cover shadow-sm"
                    />
                    <motion.button
                      type="button"
                      className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
                      onClick={clearImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-700">Disponibilidade</h3>
                <p className="text-xs text-slate-500">
                  {available
                    ? "Este produto está disponível para venda"
                    : "Este produto não está disponível para venda"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="available"
                  checked={available}
                  onCheckedChange={setAvailable}
                  className="data-[state=checked]:bg-green-600"
                />
                <Label htmlFor="available" className={available ? "text-green-700" : "text-red-700"}>
                  {available ? "Disponível" : "Indisponível"}
                </Label>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 pt-4 pb-4 border-t bg-gradient-to-r from-slate-50 to-slate-100">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                disabled={loading || saveSuccess}
                className={`relative overflow-hidden transition-all duration-300 ${
                  saveSuccess ? "bg-green-600 hover:bg-green-700" : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Salvando...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Salvo com sucesso!</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span>{initialData ? "Atualizar" : "Criar"}</span>
                  </>
                )}

                {/* Efeito de onda ao clicar */}
                {!loading && !saveSuccess && (
                  <motion.span
                    className="absolute inset-0 bg-white opacity-25 rounded-md"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

