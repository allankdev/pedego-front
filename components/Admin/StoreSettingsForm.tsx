"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useStoreSettings } from "@/hooks/useStoreSettings"
import {
  Store,
  Phone,
  Mail,
  Globe,
  Truck,
  Clock,
  DollarSign,
  Printer,
  CreditCard,
  Save,
  Loader2,
  AlertCircle,
  MapPin,
  ShoppingBag,
  ArrowLeft,
  ImageIcon,
  X,
  CheckCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

const paymentOptions = ["Pix", "Dinheiro", "Cartão de Crédito", "Cartão de Débito"]
const R2_PUBLIC_URL = "https://pub-89335a236e764dca827836a2c27c4115.r2.dev"

export function StoreSettingsForm() {
  const router = useRouter()
  const { store, setStore, loading, error, fetchStore, updateStore } = useStoreSettings()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error"
    message: string
  } | null>(null)

  useEffect(() => {
    fetchStore()
  }, [])

  const handleChange = (key: string, value: any) => {
    setStore((prev: any) => ({
      ...prev,
      [key]:
        key === "isOpen" || key === "autoPrint"
          ? value === true || value === "true"
          : key === "paymentMethods" && !Array.isArray(value)
            ? []
            : value,
    }))
  }

  const togglePaymentMethod = (method: string) => {
    setStore((prev: any) => {
      const current = Array.isArray(prev.paymentMethods) ? prev.paymentMethods : []
      const methodLower = method.toLowerCase()
      const updated = current.includes(methodLower)
        ? current.filter((m) => m !== methodLower)
        : [...current, methodLower]
      return { ...prev, paymentMethods: updated }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setStore((prev: any) => ({ ...prev, avatarFile: file }))
    }
  }

  const handleRemoveAvatar = () => {
    setStore((prev: any) => ({ ...prev, avatarFile: null, avatarImageId: null }))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async () => {
    if (!store) return

    const {
      avatarFile,
      name,
      whatsapp,
      email,
      country,
      operationMode,
      deliveryTime,
      minOrderValue,
      printFontSize,
      printPaperSize,
      isOpen,
      autoPrint,
      paymentMethods,
      subdomain,
    } = store

    const formattedMinOrderValue =
      minOrderValue === "" || minOrderValue === null ? null : Number(Number.parseFloat(minOrderValue).toFixed(2))

    const formattedIsOpen = typeof isOpen === "boolean" ? isOpen : isOpen === "true"
    const formattedAutoPrint = typeof autoPrint === "boolean" ? autoPrint : autoPrint === "true"

    const formattedPaymentMethods = Array.isArray(paymentMethods)
      ? paymentMethods.map((m) => m.toLowerCase()).filter(Boolean)
      : []

    if (!Array.isArray(formattedPaymentMethods) || formattedPaymentMethods.length === 0) {
      setNotification({
        show: true,
        type: "error",
        message: "Selecione pelo menos uma forma de pagamento.",
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    const payload = {
      name,
      whatsapp,
      email,
      country,
      operationMode,
      deliveryTime,
      printFontSize,
      printPaperSize,
      isOpen: formattedIsOpen,
      autoPrint: formattedAutoPrint,
      minOrderValue: formattedMinOrderValue,
      paymentMethods: formattedPaymentMethods,
    }

    try {
      // Atualiza os dados da loja (sem avatar)
      await updateStore(payload)

      // Envia avatar separadamente se houver
      if (avatarFile) {
        const token = document.cookie.split("token=")[1]
        const formData = new FormData()
        formData.append("file", avatarFile)

        await fetch(`http://localhost:3000/api/stores/${subdomain}/avatar`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
      }

      // Mostrar animação de sucesso
      setSaveSuccess(true)

      // Exibir notificação de sucesso
      setNotification({
        show: true,
        type: "success",
        message: "Configurações da loja atualizadas com sucesso.",
      })
      setTimeout(() => setNotification(null), 3000)

      // Resetar estado de sucesso após 2 segundos
      setTimeout(() => {
        setSaveSuccess(false)
      }, 2000)

      router.refresh()
    } catch (err) {
      console.error("Erro ao atualizar loja:", err)
      setNotification({
        show: true,
        type: "error",
        message: "Ocorreu um erro ao salvar as configurações.",
      })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  if (!store) {
    return (
      <Card className="shadow-sm border-slate-200">
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500">Carregando dados da loja...</p>
          </div>
        </CardContent>
      </Card>
    )
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
        <div className="p-4 pb-0">
          <Button
            variant="outline"
            size="sm"
            className="mb-4 hover:bg-slate-100 transition-all duration-200"
            onClick={() => router.push("/admin")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>

        <CardHeader className="pb-3 border-b bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Store className="h-5 w-5 text-slate-600" />
                Configurações da Loja
              </CardTitle>
              <CardDescription>Gerencie as informações e preferências da sua loja</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge
                  variant={store.isOpen ? "default" : "outline"}
                  className={
                    store.isOpen
                      ? "bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                      : "bg-red-50 text-red-800 hover:bg-red-100 transition-colors"
                  }
                >
                  {store.isOpen ? "Loja Aberta" : "Loja Fechada"}
                </Badge>
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Label className="text-slate-700 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-slate-500" />
              Avatar da Loja
            </Label>

            {store.avatarFile || store.avatarImageId ? (
              <motion.div
                className="relative w-32 h-32"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img
                  src={
                    store.avatarFile ? URL.createObjectURL(store.avatarFile) : `${R2_PUBLIC_URL}/${store.avatarImageId}`
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-md border shadow-sm"
                />
                <motion.button
                  onClick={handleRemoveAvatar}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-red-500" />
                </motion.button>
              </motion.div>
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="w-full max-w-xs focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Store className="h-4 w-4 text-slate-500" />
                  Informações Básicas
                </h3>
                <Separator className="my-2" />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Nome da Loja</Label>
                <Input
                  value={store.name ?? ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-500" />
                    WhatsApp
                  </div>
                </Label>
                <Input
                  value={store.whatsapp ?? ""}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    E-mail
                  </div>
                </Label>
                <Input
                  value={store.email ?? ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                  placeholder="exemplo@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-500" />
                    País
                  </div>
                </Label>
                <Input
                  value={store.country ?? ""}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                  placeholder="Brasil"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-slate-500" />
                  Configurações de Operação
                </h3>
                <Separator className="my-2" />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Modo de operação</Label>
                <Select value={store.operationMode ?? ""} onValueChange={(val) => handleChange("operationMode", val)}>
                  <SelectTrigger className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrega">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Delivery</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="retirada">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Retirada</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ambos">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Ambos</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    Tempo de entrega
                  </div>
                </Label>
                <Input
                  value={store.deliveryTime ?? ""}
                  onChange={(e) => handleChange("deliveryTime", e.target.value)}
                  className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                  placeholder="30-45min"
                />
                <p className="text-xs text-slate-500">Exemplo: 30-45min, 1h, etc.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    Valor mínimo do pedido
                  </div>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                  <Input
                    type="number"
                    value={store.minOrderValue ?? ""}
                    onChange={(e) => handleChange("minOrderValue", e.target.value)}
                    className="pl-10 focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-slate-500">Deixe em branco para não definir valor mínimo</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Printer className="h-4 w-4 text-slate-500" />
                Configurações de Impressão
              </h3>
              <Separator className="my-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700">Tamanho da fonte (impressão)</Label>
                <Input
                  value={store.printFontSize ?? ""}
                  onChange={(e) => handleChange("printFontSize", e.target.value)}
                  className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                  placeholder="12"
                />
                <p className="text-xs text-slate-500">Tamanho em pontos (pt)</p>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Tamanho do papel (impressão)</Label>
                <Input
                  value={store.printPaperSize ?? ""}
                  onChange={(e) => handleChange("printPaperSize", e.target.value)}
                  className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
                  placeholder="80mm"
                />
                <p className="text-xs text-slate-500">Exemplo: 80mm, A4, etc.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-500" />
                Formas de Pagamento
              </h3>
              <Separator className="my-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentOptions.map((method) => (
                <motion.div
                  key={method}
                  className={`border rounded-md p-3 cursor-pointer transition-all ${
                    store.paymentMethods?.includes(method.toLowerCase())
                      ? "bg-slate-100 border-slate-300 shadow-sm"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => togglePaymentMethod(method)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={store.paymentMethods?.includes(method.toLowerCase())}
                      onCheckedChange={() => togglePaymentMethod(method)}
                      className="data-[state=checked]:bg-slate-800 data-[state=checked]:border-slate-800"
                    />
                    <span className="text-sm font-medium">{method}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t mt-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-700">Status da Loja</h3>
              <p className="text-xs text-slate-500">
                {store.isOpen
                  ? "Sua loja está aberta e aceitando pedidos"
                  : "Sua loja está fechada e não está aceitando pedidos"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={!!store.isOpen}
                onCheckedChange={(val) => handleChange("isOpen", val === true)}
                className="data-[state=checked]:bg-green-600"
              />
              <Label className={store.isOpen ? "text-green-700" : "text-red-700"}>
                {store.isOpen ? "Aberta" : "Fechada"}
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Label className="text-slate-700">Impressão automática</Label>
            <Switch
              checked={!!store.autoPrint}
              onCheckedChange={(val) => handleChange("autoPrint", Boolean(val))}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end pt-4 pb-4 border-t bg-gradient-to-r from-slate-50 to-slate-100">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleSubmit}
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
                  <span>Salvar alterações</span>
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
        </CardFooter>
      </Card>
    </motion.div>
  )
}

