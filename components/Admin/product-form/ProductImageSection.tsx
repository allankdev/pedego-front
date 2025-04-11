"use client"

import type React from "react"
import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ImageIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  previewUrl: string | null
  setPreviewUrl: (url: string | null) => void
  file: File | null
  setFile: (file: File | null) => void
  onDeleteImage?: () => Promise<void>
}

export function ProductImageSection({ previewUrl, setPreviewUrl, file, setFile, onDeleteImage }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
        setFile(file)
      }
      reader.readAsDataURL(file)
    } else {
      // se o usuário cancelar o upload
      setPreviewUrl(null)
      setFile(null)
    }
  }

  const clearImage = async () => {
    console.log("Clearing image, previewUrl:", previewUrl)

    // limpa visual e input
    setPreviewUrl(null)
    setFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = "" // limpa input
    }

    try {
      if (previewUrl && onDeleteImage) {
        console.log("Calling onDeleteImage function")
        await onDeleteImage()
      }

      console.log("Image cleared successfully")
    } catch (error) {
      console.error("Error clearing image:", error)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-slate-500" />
          Imagem do Produto
        </h3>
        <Separator className="my-2" />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-700">Imagem do Produto</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
        />

        <AnimatePresence>
          {previewUrl && (
            <motion.div
              key="preview-image"
              className="relative w-40 h-40 mt-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={previewUrl}
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
        </AnimatePresence>
      </div>
    </div>
  )
}
