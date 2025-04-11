"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { ProductFormInitialData, ExtraGroup } from "@/types/product"
import { ProductBasicInfoSection } from "./ProductBasicInfoSection"
import { ProductPriceCategorySection } from "./ProductPriceCategorySection"
import { ProductImageSection } from "./ProductImageSection"
import { ProductSettingsSection } from "./ProductSettingsSection"
import { ProductExtraGroupsSection } from "./ProductExtraGroupsSection"
import { ProductExtraGroupModal } from "./ProductExtraGroupModal"
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2, Save } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import Cookie from "js-cookie"

interface Props {
  initialData?: ProductFormInitialData
  onSuccess: (savedProduct?: any) => void
  onCancel: () => void
}

export function ProductForm({ initialData, onSuccess, onCancel }: Props) {
  const { user } = useAuth()
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [price, setPrice] = useState(initialData?.price ? initialData.price.toString() : "")
  const [available, setAvailable] = useState(initialData?.available ?? true)
  const [hasStockControl, setHasStockControl] = useState(initialData?.hasStockControl ?? false)
  const [stockQuantity, setStockQuantity] = useState<number | null>(initialData?.stockQuantity ?? null)
  const [categoryId, setCategoryId] = useState<number | null>(initialData?.category?.id ?? null)

  const [stockLoaded, setStockLoaded] = useState<boolean>(!initialData?.hasStockControl)
  const [stockData, setStockData] = useState<{ quantity: number } | null>(null)

  const originalStockQuantityRef = useRef<number | null>(null)

  useEffect(() => {
    if (initialData?.category?.id) {
      setCategoryId(initialData.category.id)
    }
  }, [initialData?.category?.id])

  const [extraGroups, setExtraGroups] = useState<ExtraGroup[]>([])
  const [originalExtraGroups, setOriginalExtraGroups] = useState<ExtraGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  useEffect(() => {
    if (initialData?.imageId) {
      setPreviewUrl(`https://pub-89335a236e764dca827836a2c27c4115.r2.dev/${initialData.imageId}`)
    }
  }, [initialData?.imageId])
  
  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error"
    message: string
  } | null>(null)

  const [showExtraGroupModal, setShowExtraGroupModal] = useState(false)
  const [currentExtraGroup, setCurrentExtraGroup] = useState<ExtraGroup>({
    title: "",
    required: false,
    maxSelection: 1,
    extras: [{ name: "", price: "0", description: "", available: true }],
  })
  const [editingExtraGroupIndex, setEditingExtraGroupIndex] = useState<number | null>(null)
  const [deletingExtraGroup, setDeletingExtraGroup] = useState<number | null>(null)

  useEffect(() => {
    const fetchExtras = async () => {
      if (!initialData?.id) return
      try {
        const token = Cookie.get("token")
        if (!token) return

        const res = await fetch(`http://localhost:3000/api/product-extra/product/${initialData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const errorText = await res.text()
          console.error("Erro ao buscar grupos de extras:", errorText)
          throw new Error("Erro ao buscar grupos de extras")
        }
        const data = await res.json()
        console.log("Extras carregados:", data)
        setExtraGroups(data)
        setOriginalExtraGroups(JSON.parse(JSON.stringify(data))) // Deep copy for comparison
      } catch (err) {
        console.error("Erro ao carregar grupos de extras:", err)
      }
    }
    fetchExtras()
  }, [initialData])

  useEffect(() => {
    if (!initialData?.id || !initialData?.hasStockControl) {
      setStockLoaded(true)
      return
    }

    setStockLoaded(false)

    const fetchStock = async () => {
      try {
        const token = Cookie.get("token")
        if (!token) {
          setStockLoaded(true)
          return
        }

        const res = await fetch(`http://localhost:3000/api/stock/${initialData.id}/${initialData.storeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          console.log("Estoque carregado:", data)
          setStockData(data)

          if (data && typeof data.quantity === "number") {
            setStockQuantity(data.quantity)
            originalStockQuantityRef.current = data.quantity
          } else {
            setStockQuantity(initialData?.stockQuantity ?? 0)
            originalStockQuantityRef.current = initialData?.stockQuantity ?? 0
          }
        } else {
          console.log("Estoque não encontrado, mantendo valor inicial")
          setStockQuantity(initialData?.stockQuantity ?? 0)
          originalStockQuantityRef.current = initialData?.stockQuantity ?? 0
        }

        setStockLoaded(true)
      } catch (err) {
        console.error("Erro ao buscar estoque:", err)
        setStockQuantity(initialData?.stockQuantity ?? 0)
        originalStockQuantityRef.current = initialData?.stockQuantity ?? 0
        setStockLoaded(true)
      }
    }

    if (initialData?.hasStockControl) {
      fetchStock()
    } else {
      setStockQuantity(initialData?.stockQuantity ?? 0)
      originalStockQuantityRef.current = initialData?.stockQuantity ?? 0
      setStockLoaded(true)
    }
  }, [initialData])

  useEffect(() => {
    if (!hasStockControl) {
      setStockQuantity(null)
    } else if (stockQuantity === null) {
      setStockQuantity(0)
    }
  }, [hasStockControl, stockQuantity])

  const openNewExtraGroupModal = () => {
    setCurrentExtraGroup({
      title: "",
      required: false,
      maxSelection: 1,
      extras: [{ name: "", price: "0", description: "", available: true }],
    })
    setEditingExtraGroupIndex(null)
    setShowExtraGroupModal(true)
  }

  const openEditExtraGroupModal = (index: number) => {
    setCurrentExtraGroup(extraGroups[index])
    setEditingExtraGroupIndex(index)
    setShowExtraGroupModal(true)
  }

  const handleExtraGroupSave = (group: ExtraGroup) => {
    if (editingExtraGroupIndex !== null) {
      const updatedGroups = [...extraGroups]
      updatedGroups[editingExtraGroupIndex] = group
      setExtraGroups(updatedGroups)
    } else {
      setExtraGroups([...extraGroups, group])
    }
    setShowExtraGroupModal(false)
  }

  const confirmDeleteExtraGroup = () => {
    if (deletingExtraGroup !== null) {
      const updatedGroups = extraGroups.filter((_, index) => index !== deletingExtraGroup)
      setExtraGroups(updatedGroups)
      setDeletingExtraGroup(null)
    }
  }

  const handleExtraAvailabilityChange = (groupIndex: number, extraIndex: number, available: boolean) => {
    const updatedGroups = [...extraGroups]
    updatedGroups[groupIndex].extras[extraIndex].available = available
    setExtraGroups(updatedGroups)
  }

  const saveExtraGroups = async (productId: number, token: string) => {
    try {
      console.log("Salvando extras para o produto:", productId)
      console.log("Grupos de extras:", extraGroups)

      const existingGroupsRes = await fetch(`http://localhost:3000/api/product-extra/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      let existingGroups: ExtraGroup[] = []
      if (existingGroupsRes.ok) {
        existingGroups = await existingGroupsRes.json()
        console.log("Grupos existentes:", existingGroups)
      }

      for (const group of extraGroups) {
        const groupData = { ...group, productId: productId }
        groupData.extras = groupData.extras.map((extra) => ({ ...extra, price: extra.price.toString() }))
        console.log("Salvando grupo:", groupData)

        if (group.id) {
          const { id, productId, ...updateData } = groupData

          const updateRes = await fetch(`http://localhost:3000/api/product-extra/${group.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          })

          if (!updateRes.ok) {
            const errorText = await updateRes.text()
            console.error("Erro ao atualizar grupo:", errorText)
            throw new Error("Erro ao atualizar grupo de extras")
          }

          console.log("Grupo atualizado com sucesso:", group.id)
        } else {
          const createRes = await fetch(`http://localhost:3000/api/product-extra`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(groupData),
          })

          if (!createRes.ok) {
            const errorText = await createRes.text()
            console.error("Erro ao criar grupo:", errorText)
            throw new Error("Erro ao criar grupo de extras")
          }

          console.log("Grupo criado com sucesso")
        }
      }

      const currentGroupIds = extraGroups.map((g) => g.id).filter(Boolean)
      const groupsToDelete = existingGroups.filter((g) => g.id && !currentGroupIds.includes(g.id))

      console.log("Grupos a serem excluídos:", groupsToDelete)

      for (const group of groupsToDelete) {
        const deleteRes = await fetch(`http://localhost:3000/api/product-extra/${group.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!deleteRes.ok) {
          const errorText = await deleteRes.text()
          console.error("Erro ao excluir grupo:", errorText)
          throw new Error("Erro ao excluir grupo de extras")
        }

        console.log("Grupo excluído com sucesso:", group.id)
      }

      return true
    } catch (err) {
      console.error("Erro ao salvar grupos de extras:", err)
      throw err
    }
  }

  const updateStockQuantity = async (productId: number, storeId: number | string, quantity: number | null) => {
    const token = Cookie.get("token")
    if (!token) {
      console.error("Token não encontrado ao atualizar estoque")
      return false
    }

    try {
      if (!productId || !storeId) {
        console.error("ProductId ou StoreId inválidos", { productId, storeId })
        return false
      }

      const finalQuantity = quantity !== null ? quantity : 0
      console.log(`Atualizando estoque: Produto ${productId}, Loja ${storeId}, Quantidade ${finalQuantity}`)

      const stockUpdateRes = await fetch(`http://localhost:3000/api/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          storeId,
          quantity: finalQuantity,
        }),
      })

      if (!stockUpdateRes.ok) {
        const errorText = await stockUpdateRes.text()
        console.error("Erro ao atualizar estoque:", errorText)
        throw new Error("Erro ao atualizar estoque")
      }

      console.log("Estoque atualizado com sucesso")
      return true
    } catch (err) {
      console.error("Erro ao atualizar estoque:", err)
      return false
    }
  }
  const deleteImage = async () => {
    try {
      if (!previewUrl || !initialData?.imageId) return;
  
      const token = Cookie.get("token");
      if (!token) return;
  
      const rawImageId = initialData.imageId;
      const encodedImageId = encodeURIComponent(rawImageId);
      const deleteUrl = `http://localhost:3000/api/r2/delete/${encodedImageId}`;
  
      console.log("Final delete URL:", deleteUrl);
  
      const res = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erro ao excluir imagem:", errorText);
        setNotification({
          show: true,
          type: "error",
          message: `Erro ao excluir imagem: ${errorText}`,
        });
        return;
      }
  
      console.log("Imagem excluída com sucesso");
  
      // Limpa completamente os dados da imagem no estado
      setPreviewUrl(null);
      setFile(null);
      if (initialData) {
        initialData.imageId = undefined; // ✅ agora compatível com string | undefined
      }
  
      setNotification({
        show: true,
        type: "success",
        message: "Imagem excluída com sucesso!",
      });
    } catch (err) {
      console.error("Erro ao excluir imagem:", err);
      setNotification({
        show: true,
        type: "error",
        message: "Erro ao excluir a imagem.",
      });
    }
  };
  

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const parsedPrice = Number.parseFloat(price.replace(",", "."))
    if (isNaN(parsedPrice)) {
      setError("Preço inválido")
      setLoading(false)
      setNotification({
        show: true,
        type: "error",
        message: "Preço inválido. Por favor, verifique o valor.",
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    try {
      const token = Cookie.get("token")
      if (!token) {
        throw new Error("Token não encontrado")
      }

      const formData = new FormData()

      if (initialData?.imageId && !previewUrl) {
        console.log("Image was removed, deleting from server")
        await deleteImage()
        // Add a flag to the form data to indicate the image was removed
        formData.append("removeImage", "true")
      }

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", parsedPrice.toString())
      formData.append("available", String(available))
      formData.append("hasStockControl", String(hasStockControl))

      if (hasStockControl && stockQuantity !== null) {
        formData.append("stockQuantity", stockQuantity.toString())
      }

      if (categoryId) {
        formData.append("categoryId", categoryId.toString())
      }

      const storeId = user?.store?.id || initialData?.storeId
      if (storeId) {
        formData.append("storeId", storeId.toString())
      } else {
        throw new Error("StoreId não encontrado")
      }

      if (file) {
        formData.append("file", file)
      }

      const res = await fetch(`http://localhost:3000/api/products${initialData ? `/${initialData.id}` : ""}`, {
        method: initialData ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Erro na resposta da API (texto):", errorText)
        throw new Error("Erro ao salvar produto")
      }

      const savedProduct = await res.json()
      console.log("Produto salvo com sucesso:", savedProduct)

      // Ensure the availability status is included in the saved product
      savedProduct.available = available

      if (savedProduct.id) {
        await saveExtraGroups(savedProduct.id, token)
      }

      if (savedProduct.id && hasStockControl) {
        const stockUpdateSuccess = await updateStockQuantity(savedProduct.id, storeId, stockQuantity)

        if (stockUpdateSuccess) {
          console.log("Estoque atualizado com sucesso!")
        } else {
          console.warn("Não foi possível atualizar o estoque, mas o produto foi salvo.")
        }
      }

      setSaveSuccess(true)
      setNotification({
        show: true,
        type: "success",
        message: initialData ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!",
      })

      setTimeout(() => {
        if (hasStockControl && stockQuantity !== null) {
          savedProduct.stockQuantity = stockQuantity
        }
        onSuccess(savedProduct)
      }, 1000)
    } catch (err: any) {
      console.error("Erro no envio do produto:", err)

      setError("Erro ao salvar produto")
      setNotification({
        show: true,
        type: "error",
        message: err?.message || "Erro ao salvar produto. Tente novamente.",
      })

      setTimeout(() => setNotification(null), 3000)
    } finally {
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
          <CardTitle className="text-lg font-medium">{initialData ? "Editar Produto" : "Novo Produto"}</CardTitle>
          <CardDescription>
            {initialData ? "Atualize as informações do produto" : "Adicione um novo produto ao catálogo"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <ProductBasicInfoSection
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
            />

            <ProductPriceCategorySection
              price={price}
              setPrice={setPrice}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
            />

            <ProductImageSection
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              file={file}
              setFile={setFile}
              onDeleteImage={deleteImage}
            />
            <ProductSettingsSection
              available={available}
              setAvailable={(newValue) => {
                setAvailable(newValue)
                // Remove the automatic save functionality
                // The changes will only be saved when the form is submitted
              }}
              hasStockControl={hasStockControl}
              setHasStockControl={setHasStockControl}
              stockQuantity={stockQuantity}
              setStockQuantity={setStockQuantity}
            />

            <ProductExtraGroupsSection
              extraGroups={extraGroups}
              onAddGroup={openNewExtraGroupModal}
              onEditGroup={openEditExtraGroupModal}
              onDeleteGroup={(index) => setDeletingExtraGroup(index)}
              onChangeAvailability={handleExtraAvailabilityChange}
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 pt-4 pb-4 border-t bg-gradient-to-r from-slate-50 to-slate-100">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                disabled={loading || saveSuccess || !stockLoaded}
                className={`relative overflow-hidden transition-all duration-300 ${
                  saveSuccess ? "bg-green-600 hover:bg-green-700" : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Salvando...</span>
                  </>
                ) : !stockLoaded && initialData?.hasStockControl ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Carregando estoque...</span>
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

                {/* Wave effect on click */}
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

      {/* Extra Group Modal */}
      <ProductExtraGroupModal
        open={showExtraGroupModal}
        onClose={() => setShowExtraGroupModal(false)}
        onSave={handleExtraGroupSave}
        initialGroup={currentExtraGroup}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deletingExtraGroup !== null}
        onCancel={() => setDeletingExtraGroup(null)}
        onConfirm={confirmDeleteExtraGroup}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este grupo de extras? Esta ação não poderá ser desfeita."
      />
    </motion.div>
  )
}
