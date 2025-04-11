"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Package } from "lucide-react"
import { useEffect } from "react"

interface Props {
  available: boolean
  setAvailable: (val: boolean) => void
  hasStockControl: boolean
  setHasStockControl: (val: boolean) => void
  stockQuantity: number | null
  setStockQuantity: (val: number | null) => void
}

export function ProductSettingsSection({
  available,
  setAvailable,
  hasStockControl,
  setHasStockControl,
  stockQuantity,
  setStockQuantity,
}: Props) {
  // When hasStockControl changes to false, reset stockQuantity to null
  useEffect(() => {
    if (!hasStockControl) {
      setStockQuantity(null)
    } else if (stockQuantity === null) {
      // If enabling stock control and quantity is null, set a default of 0
      setStockQuantity(0)
    }
  }, [hasStockControl, setStockQuantity, stockQuantity])

  const handleStockQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log(`Campo de estoque alterado para: ${value}`)

    // If the field is empty, set as null
    if (value === "") {
      setStockQuantity(null)
      return
    }

    // Convert to integer
    const numValue = Number.parseInt(value, 10)

    // Check if it's a valid number
    if (!isNaN(numValue)) {
      setStockQuantity(numValue)
    }
  }

  return (
    <div className="space-y-3">
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
              {available ? "Este produto está disponível para venda" : "Este produto não está disponível para venda"}
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
          <div className="col-span-1 md:col-span-2 p-4 rounded-md border border-slate-200 bg-slate-50">
            <div className="space-y-2">
              <Label htmlFor="stockQuantity" className="text-slate-700">
                Quantidade em Estoque
              </Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={stockQuantity === null ? "" : stockQuantity}
                onChange={handleStockQuantityChange}
                required={hasStockControl}
                className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
              />
              <p className="text-xs text-slate-500">
                Valor atual: {stockQuantity === null ? "Não definido" : stockQuantity}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
