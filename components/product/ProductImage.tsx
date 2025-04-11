"use client"

import { useState } from "react"
import { ShoppingBag } from "lucide-react"

const R2_PUBLIC_URL = "https://pub-89335a236e764dca827836a2c27c4115.r2.dev"

type Props = {
  imageId?: string
  alt: string
}

export function ProductImage({ imageId, alt }: Props) {
  const [hasError, setHasError] = useState(false)

  if (!imageId || hasError) {
    return (
      <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
        <ShoppingBag className="h-12 w-12 text-slate-300" />
      </div>
    )
  }

  return (
    <img
      src={`${R2_PUBLIC_URL}/${imageId}`}
      alt={alt}
      className="w-full h-48 object-cover"
      onError={() => setHasError(true)}
    />
  )
}
