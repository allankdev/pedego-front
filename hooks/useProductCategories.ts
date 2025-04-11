"use client"

import { useEffect, useState } from "react"
import Cookie from "js-cookie"

export function useProductCategories(storeId?: number) {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!storeId) return
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const token = Cookie.get("token")
        const res = await fetch(`http://localhost:3000/api/categories/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Erro ao carregar categorias")
        const data = await res.json()
        setCategories(data)
      } catch (err: any) {
        setError(err.message || "Erro ao buscar categorias")
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [storeId])

  return { categories, loading, error }
}