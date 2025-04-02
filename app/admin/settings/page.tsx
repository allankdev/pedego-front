"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm"
import { motion } from "framer-motion"

export default function StoreSettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/auth/login")
    }
  }, [isLoading, user, router])

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (isLoading || !user?.store) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="p-6 space-y-6 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold">Configurações da Loja</h2>
      <StoreSettingsForm />
    </motion.div>
  )
}

