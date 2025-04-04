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
  Package,
  Edit,
  Trash,
  Coffee,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface Props {
  initialData?: {
    id: number
    name: string
    description: string
    price: string
    available: boolean
    hasStockControl?: boolean
    categoryId?: number
    imageId?: string
  }
  onSuccess: (savedProduct?: any) => void
  onCancel: () => void
}

interface ExtraItem {
  id?: number
  name: string
  price: string
  description: string
  available?: boolean // 👈 novo campo
}

interface ExtraGroup {
  id?: number
  title: string
  required: boolean
  maxSelection: number
  extras: ExtraItem[]
}

export function ProductForm({ initialData, onSuccess, onCancel }: Props) {
  const { user } = useAuth()
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [price, setPrice] = useState(initialData?.price || "")
  const [available, setAvailable] = useState(initialData?.available ?? true)
  const [hasStockControl, setHasStockControl] = useState(initialData?.hasStockControl ?? false)
  const [stockQuantity, setStockQuantity] = useState<number | null>(null)
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

  // Estado para grupos de extras
  const [extraGroups, setExtraGroups] = useState<ExtraGroup[]>([])
  const [showExtraGroupModal, setShowExtraGroupModal] = useState(false)
  const [currentExtraGroup, setCurrentExtraGroup] = useState<ExtraGroup>({
    title: "",
    required: false,
    maxSelection: 1,
    extras: [{ name: "", price: "", description: "", available: true }],
  })
  const [editingExtraGroupIndex, setEditingExtraGroupIndex] = useState<number | null>(null)
  const [deletingExtraGroup, setDeletingExtraGroup] = useState<number | null>(null)

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

  useEffect(() => {
    if (!initialData?.id || !user?.store?.id || !initialData.hasStockControl) return

    const fetchStock = async () => {
      try {
        const token = document.cookie.split("token=")[1]
        const res = await fetch(`http://localhost:3000/api/stock/${initialData.id}/${user.store.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setStockQuantity(data.quantity)
        }
      } catch (err) {
        console.error("Erro ao buscar estoque:", err)
      }
    }

    fetchStock()
  }, [initialData, user])

  // Buscar grupos de extras ao editar um produto
  useEffect(() => {
    const fetchExtras = async () => {
      if (!initialData?.id) return
      try {
        const token = document.cookie.split("token=")[1]
        const res = await fetch(`http://localhost:3000/api/product-extra/product/${initialData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const errorText = await res.text()
          console.error("Erro ao buscar grupos de extras:", errorText)
          throw new Error("Erro ao buscar grupos de extras")
        }
        const data = await res.json()
        console.log("Grupos de extras carregados:", data)
        setExtraGroups(data)
      } catch (err) {
        console.error("Erro ao carregar grupos de extras:", err)
      }
    }
    fetchExtras()
  }, [initialData])

  // Adicionar um useEffect para garantir que o estado de disponibilidade seja sincronizado com os dados iniciais
  useEffect(() => {
    setAvailable(initialData?.available ?? true)
  }, [initialData?.available])

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

  const formatCurrency = (value: string | number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) || 0)

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

  // Funções para gerenciar grupos de extras
  const openNewExtraGroupModal = () => {
    setCurrentExtraGroup({
      title: "",
      required: false,
      maxSelection: 1,
      extras: [{ name: "", price: "", description: "", available: true }],
    })
    setEditingExtraGroupIndex(null)
    setShowExtraGroupModal(true)
  }

  const openEditExtraGroupModal = (index: number) => {
    // Garantir que todos os extras tenham o campo available definido
    const groupToEdit = { ...extraGroups[index] }
    groupToEdit.extras = groupToEdit.extras.map((extra) => ({
      ...extra,
      available: extra.available !== undefined ? extra.available : true,
    }))

    setCurrentExtraGroup(groupToEdit)
    setEditingExtraGroupIndex(index)
    setShowExtraGroupModal(true)
  }

  const handleExtraGroupChange = (field: keyof ExtraGroup, value: any) => {
    setCurrentExtraGroup((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleExtraItemChange = (index: number, field: keyof ExtraItem, value: any) => {
    const updatedExtras = [...currentExtraGroup.extras]
    updatedExtras[index] = {
      ...updatedExtras[index],
      [field]: value,
    }
    setCurrentExtraGroup((prev) => ({
      ...prev,
      extras: updatedExtras,
    }))
  }

  const addExtraItem = () => {
    setCurrentExtraGroup((prev) => ({
      ...prev,
      extras: [...prev.extras, { name: "", price: "", description: "", available: true }],
    }))
  }

  const removeExtraItem = (index: number) => {
    if (currentExtraGroup.extras.length <= 1) return

    const updatedExtras = [...currentExtraGroup.extras]
    updatedExtras.splice(index, 1)
    setCurrentExtraGroup((prev) => ({
      ...prev,
      extras: updatedExtras,
    }))
  }

  // Substitua a função saveExtraGroup por esta versão corrigida:

  const saveExtraGroup = async () => {
    if (!currentExtraGroup.title.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "O título do grupo é obrigatório.",
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    const invalidExtras = currentExtraGroup.extras.some(
      (extra) => !extra.name.trim() || isNaN(Number(extra.price)) || Number(extra.price) < 0,
    )

    if (invalidExtras) {
      setNotification({
        show: true,
        type: "error",
        message: "Todos os extras precisam ter nome e preço válido.",
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    if (!initialData?.id) {
      setExtraGroups((prev) => [...prev, currentExtraGroup])
      setShowExtraGroupModal(false)
      setNotification({
        show: true,
        type: "success",
        message: "Grupo de extras adicionado localmente. Será salvo junto com o produto.",
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    try {
      const token = document.cookie.split("token=")[1]
      const isEditing = editingExtraGroupIndex !== null && currentExtraGroup.id

      const cleanExtras = currentExtraGroup.extras.map((extra) => {
        const base = {
          name: extra.name,
          description: extra.description,
          price: Number(extra.price),
          available: extra.available ?? true,
        }
        if (isEditing && extra.id !== undefined && !isNaN(Number(extra.id))) {
          return { ...base, id: Number(extra.id) }
        }
        return base
      })

      const payload: any = {
        title: currentExtraGroup.title,
        required: currentExtraGroup.required,
        maxSelection: currentExtraGroup.maxSelection,
        extras: cleanExtras,
      }

      if (!isEditing) {
        payload.productId = initialData?.id
      }

      console.log("Payload final:", JSON.stringify(payload, null, 2))

      const method = isEditing ? "PUT" : "POST"
      const url = isEditing
        ? `http://localhost:3000/api/product-extra/${currentExtraGroup.id}`
        : "http://localhost:3000/api/product-extra" // Corrigido a aspas de fechamento aqui

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Erro na resposta da API:", errorText)
        throw new Error(`Erro ao salvar grupo de extras: ${res.status} ${res.statusText}`)
      }

      const savedGroup = await res.json()

      if (editingExtraGroupIndex !== null) {
        const updatedGroups = [...extraGroups]
        updatedGroups[editingExtraGroupIndex] = savedGroup
        setExtraGroups(updatedGroups)
      } else {
        setExtraGroups((prev) => [...prev, savedGroup])
      }

      setNotification({
        show: true,
        type: "success",
        message: isEditing ? "Grupo de extras atualizado!" : "Grupo de extras criado com sucesso!",
      })
      setTimeout(() => setNotification(null), 3000)
      setShowExtraGroupModal(false)
    } catch (err) {
      console.error("Erro ao salvar grupo de extras:", err)
      setNotification({
        show: true,
        type: "error",
        message: `Erro ao salvar grupo de extras: ${err instanceof Error ? err.message : "Erro desconhecido"}`,
      })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const confirmDeleteExtraGroup = async () => {
    if (deletingExtraGroup === null || !extraGroups[deletingExtraGroup]?.id) {
      setDeletingExtraGroup(null)
      return
    }

    try {
      const token = document.cookie.split("token=")[1]
      const groupId = extraGroups[deletingExtraGroup].id

      const res = await fetch(`http://localhost:3000/api/product-extra/${groupId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Erro ao excluir grupo de extras:", errorText)
        throw new Error("Erro ao excluir grupo de extras")
      }

      // Remover grupo do estado
      const updatedGroups = [...extraGroups]
      updatedGroups.splice(deletingExtraGroup, 1)
      setExtraGroups(updatedGroups)

      setNotification({
        show: true,
        type: "success",
        message: "Grupo de extras excluído com sucesso!",
      })
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      console.error("Erro ao excluir grupo de extras:", err)
      setNotification({
        show: true,
        type: "error",
        message: "Erro ao excluir grupo de extras.",
      })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setDeletingExtraGroup(null)
    }
  }

  // Modificar a função handleSubmit para incluir os grupos de extras na criação do produto
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
      formData.append("hasStockControl", String(hasStockControl))
      if (categoryId) formData.append("categoryId", categoryId.toString())
      if (user?.store?.id) formData.append("storeId", user.store.id.toString())
      if (file) formData.append("file", file)

      // Adicionar grupos de extras ao FormData, se existirem
      if (!initialData && extraGroups.length > 0) {
        // Preparar os grupos de extras sem IDs para criação
        const formattedExtraGroups = extraGroups.map((group) => ({
          title: group.title,
          required: group.required,
          maxSelection: group.maxSelection,
          extras: group.extras.map((extra) => ({
            name: extra.name,
            description: extra.description,
            price: Number(extra.price),
            available: extra.available ?? true, // Incluir o campo available
          })),
        }))
        formData.append("extraGroups", JSON.stringify(formattedExtraGroups))
      }

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

      const savedProduct = await res.json()

      // 👉 Cria ou atualiza o estoque se tiver controle ativado
      if (hasStockControl && stockQuantity !== null) {
        const stockPayload = {
          productId: savedProduct.id,
          storeId: user.store.id,
          quantity: stockQuantity,
        }

        const stockMethod = initialData ? "PUT" : "POST"
        const stockUrl = initialData
          ? `http://localhost:3000/api/stock/${savedProduct.id}/${user.store.id}`
          : "http://localhost:3000/api/stock"

        const stockRes = await fetch(stockUrl, {
          method: stockMethod,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(stockPayload),
        })

        if (!stockRes.ok) {
          const errorText = await stockRes.text()
          console.error("Erro ao atualizar estoque:", errorText)
          throw new Error("Erro ao atualizar estoque")
        }
      }

      // Modificar a função handleSubmit para garantir que o produto atualizado seja retornado corretamente
      // Localizar o trecho após o salvamento do produto e antes do setTimeout
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
        onSuccess(savedProduct) // Passar o produto atualizado para o callback
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

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-500" />
                Configurações de Venda
              </h3>
              <Separator className="my-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 rounded-md border border-slate-200 bg-slate-50">
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

              <div className="flex items-center justify-between p-4 rounded-md border border-slate-200 bg-slate-50">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-slate-700">Controle de Estoque</h3>
                  <p className="text-xs text-slate-500">
                    {hasStockControl
                      ? "Este produto terá controle de estoque"
                      : "Estoque não será controlado para este produto"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="hasStockControl"
                    checked={hasStockControl}
                    onCheckedChange={setHasStockControl}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="hasStockControl" className={hasStockControl ? "text-blue-700" : "text-slate-700"}>
                    {hasStockControl ? "Ativado" : "Desativado"}
                  </Label>
                </div>
              </div>

              {hasStockControl && (
                <div className="mt-4 p-4 rounded-md border border-slate-200 bg-slate-50">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Quantidade em Estoque</Label>
                    <Input
                      type="number"
                      min={0}
                      value={stockQuantity ?? ""}
                      onChange={(e) => setStockQuantity(Number(e.target.value))}
                      required={hasStockControl}
                      className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Seção de Grupos de Extras */}
            <div className="space-y-1 mt-8">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-slate-500" />
                  Grupos de Extras
                </h3>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    type="button"
                    onClick={openNewExtraGroupModal}
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar grupo de extras
                  </Button>
                </motion.div>
              </div>
              <Separator className="my-2" />
            </div>

            {extraGroups.length > 0 && (
              <div className="space-y-3">
                {extraGroups.map((group, index) => (
                  <motion.div
                    key={group.id || index}
                    className="border rounded-md p-4 bg-slate-50 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-slate-700">{group.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                          {group.required ? "Obrigatório" : "Opcional"}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                          Máx: {group.maxSelection}
                        </span>
                        <div className="flex gap-1">
                          <motion.button
                            type="button"
                            onClick={() => openEditExtraGroupModal(index)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => setDeletingExtraGroup(index)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                      {group.extras.map((extra: any) => (
                        <li key={extra.id || extra.name} className={extra.available === false ? "text-slate-400" : ""}>
                          {extra.name} — {formatCurrency(extra.price)}{" "}
                          {extra.description && <span className="text-xs text-slate-500">({extra.description})</span>}
                          {extra.available === false && (
                            <span className="text-xs text-red-500 ml-1">(Indisponível)</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            )}

            {extraGroups.length === 0 && initialData?.id && (
              <div className="text-center py-6 bg-slate-50 rounded-md border border-slate-200">
                <Coffee className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600 mb-2">Este produto não possui grupos de extras</p>
                <Button type="button" onClick={openNewExtraGroupModal} variant="outline" size="sm" className="gap-2">
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar grupo de extras
                </Button>
              </div>
            )}

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

      {/* Modal para criar/editar grupo de extras */}
      <Dialog open={showExtraGroupModal} onOpenChange={setShowExtraGroupModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingExtraGroupIndex !== null ? "Editar Grupo de Extras" : "Novo Grupo de Extras"}
            </DialogTitle>
            <DialogDescription>
              {editingExtraGroupIndex !== null
                ? "Atualize as informações do grupo de extras"
                : "Adicione um novo grupo de extras ao produto"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Grupo</Label>
              <Input
                id="title"
                value={currentExtraGroup.title}
                onChange={(e) => handleExtraGroupChange("title", e.target.value)}
                placeholder="Ex: Adicionais, Coberturas, Tamanhos"
                className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="required">Obrigatório</Label>
                <Select
                  value={currentExtraGroup.required ? "true" : "false"}
                  onValueChange={(val) => handleExtraGroupChange("required", val === "true")}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSelection">Máximo de Seleções</Label>
                <Input
                  id="maxSelection"
                  type="number"
                  min="1"
                  value={currentExtraGroup.maxSelection}
                  onChange={(e) => handleExtraGroupChange("maxSelection", Number(e.target.value))}
                  className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Extras</Label>
                <Button type="button" onClick={addExtraItem} variant="outline" size="sm" className="gap-1">
                  <Plus className="h-3 w-3" />
                  Adicionar Extra
                </Button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {currentExtraGroup.extras.map((extra, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-start border-b pb-3">
                    <div className="col-span-5">
                      <Label htmlFor={`extra-name-${index}`} className="text-xs mb-1 block">
                        Nome
                      </Label>
                      <Input
                        id={`extra-name-${index}`}
                        value={extra.name}
                        onChange={(e) => handleExtraItemChange(index, "name", e.target.value)}
                        placeholder="Nome do extra"
                        className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
                      />
                    </div>

                    <div className="col-span-3">
                      <Label htmlFor={`extra-price-${index}`} className="text-xs mb-1 block">
                        Preço
                      </Label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">R$</span>
                        <Input
                          id={`extra-price-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={extra.price}
                          onChange={(e) => handleExtraItemChange(index, "price", e.target.value)}
                          className="pl-7 focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="col-span-3">
                      <Label htmlFor={`extra-desc-${index}`} className="text-xs mb-1 block">
                        Descrição
                      </Label>
                      <Input
                        id={`extra-desc-${index}`}
                        value={extra.description}
                        onChange={(e) => handleExtraItemChange(index, "description", e.target.value)}
                        placeholder="Opcional"
                        className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
                      />
                    </div>

                    <div className="col-span-1 pt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExtraItem(index)}
                        disabled={currentExtraGroup.extras.length <= 1}
                        className="p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Adicionar o Switch para disponibilidade do extra */}
                    <div className="col-span-12 flex items-center gap-2 mt-2">
                      <Switch
                        id={`extra-available-${index}`}
                        checked={extra.available !== false}
                        onCheckedChange={(checked) => handleExtraItemChange(index, "available", checked)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <Label htmlFor={`extra-available-${index}`} className="text-sm">
                        {extra.available !== false ? "Disponível" : "Indisponível"}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowExtraGroupModal(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={saveExtraGroup} className="bg-slate-800 hover:bg-slate-700">
              {editingExtraGroupIndex !== null ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <Dialog open={deletingExtraGroup !== null} onOpenChange={(open) => !open && setDeletingExtraGroup(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este grupo de extras? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setDeletingExtraGroup(null)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDeleteExtraGroup}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

