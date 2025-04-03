"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/admin/ProductForm"
import Cookie from "js-cookie"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  Tag,
  DollarSign,
  Search,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  X,
  ArrowLeft,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const R2_PUBLIC_URL = "https://pub-89335a236e764dca827836a2c27c4115.r2.dev"

export default function ProductsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error"
    message: string
  } | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchProducts = async () => {
    const token = Cookie.get("token")
    if (!token || !user?.store?.id) return

    try {
      setLoadingProducts(true)
      const res = await fetch(`http://localhost:3000/api/products?storeId=${user.store.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      console.log("Produtos carregados:", data)
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Erro ao buscar produtos:", err)
      setNotification({
        show: true,
        type: "error",
        message: "Erro ao carregar produtos. Tente novamente.",
      })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/auth/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (user?.store?.id) {
      fetchProducts()
    }
  }, [user])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) return

    const token = Cookie.get("token")

    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Erro ao excluir produto:", errorText)
        throw new Error("Erro ao excluir produto")
      }

      console.log("Produto deletado com status:", res.status)

      // Mostrar notificação de sucesso
      setNotification({
        show: true,
        type: "success",
        message: `Produto "${name}" excluído com sucesso!`,
      })
      setTimeout(() => setNotification(null), 3000)

      fetchProducts()
    } catch (err) {
      console.error("Erro ao deletar produto:", err)

      // Mostrar notificação de erro
      setNotification({
        show: true,
        type: "error",
        message: "Erro ao excluir produto. Tente novamente.",
      })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchProducts()
    setTimeout(() => setRefreshing(false), 600) // Manter a animação por pelo menos 600ms
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category?.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Redirecionar se não for admin
  if (user.role !== "ADMIN") {
    router.push("/auth/login")
    return null
  }

  return (
    <motion.div
      className="p-6 space-y-6 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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

      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
              <ShoppingBag className="h-6 w-6 text-slate-700" />
              Gerenciar Produtos
            </h2>
            <p className="text-slate-500 mt-1">Gerencie o catálogo de produtos da sua loja</p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin")}
                className="gap-2 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="gap-2 hover:bg-slate-100 transition-colors"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => {
                  setEditingProduct(null)
                  setShowForm(true)
                }}
                className="gap-2 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </motion.div>
          </div>
        </div>

        <Separator className="my-4" />

        <AnimatePresence>
          {showForm && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative bg-slate-50 rounded-lg p-4 border border-slate-200">
                <button
                  onClick={closeForm}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm hover:shadow transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
                <ProductForm
                  initialData={editingProduct}
                  onSuccess={() => {
                    fetchProducts()
                    closeForm()

                    // Mostrar notificação de sucesso
                    setNotification({
                      show: true,
                      type: "success",
                      message: editingProduct
                        ? `Produto "${editingProduct.name}" atualizado com sucesso!`
                        : "Novo produto criado com sucesso!",
                    })
                    setTimeout(() => setNotification(null), 3000)
                  }}
                  onCancel={closeForm}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="overflow-hidden h-full border-slate-200 hover:border-slate-300 transition-colors">
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-48 rounded-t-lg rounded-b-none" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="overflow-hidden h-full border-slate-200 hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="relative">
                      {product.imageId ? (
                        <img
                          src={`${R2_PUBLIC_URL}/${product.imageId}`}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                          <ShoppingBag className="h-12 w-12 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={product.available ? "default" : "destructive"}
                          className={`
                            ${
                              product.available
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }
                            shadow-sm
                          `}
                        >
                          {product.available ? "Disponível" : "Indisponível"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Tag className="h-3.5 w-3.5" />
                        <span className="italic">{product.category?.name || "Sem categoria"}</span>
                      </div>

                      <div className="flex items-center gap-1 font-medium text-slate-900">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {Number.parseFloat(product.price).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2 p-4 pt-0">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="w-full gap-1 bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="w-full gap-1 bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Excluir
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-12">
            <div className="bg-slate-50 rounded-lg p-8 max-w-md mx-auto border border-slate-200">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum produto encontrado</h3>
              <p className="text-slate-500 mb-4">
                Não encontramos produtos correspondentes à sua busca por "{searchTerm}".
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")} className="gap-2">
                <X className="h-4 w-4" />
                Limpar busca
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-slate-50 rounded-lg p-8 max-w-md mx-auto border border-slate-200">
              <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum produto cadastrado</h3>
              <p className="text-slate-500 mb-4">Você ainda não possui produtos cadastrados no seu catálogo.</p>
              <Button
                onClick={() => {
                  setEditingProduct(null)
                  setShowForm(true)
                }}
                className="gap-2 bg-slate-800 hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

