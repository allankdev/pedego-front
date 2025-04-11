"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, X } from 'lucide-react'
import type { ExtraGroup, ExtraItem } from "@/types/product"

interface Props {
  open: boolean
  onClose: () => void
  onSave: (group: ExtraGroup) => void
  initialGroup?: ExtraGroup
}

export function ProductExtraGroupModal({ open, onClose, onSave, initialGroup }: Props) {
  const [group, setGroup] = useState<ExtraGroup>(
    initialGroup || {
      title: "",
      required: false,
      maxSelection: 1,
      extras: [{ name: "", price: "0", description: "", available: true }],
    },
  )

  // Update local state when initialGroup changes
  useEffect(() => {
    if (initialGroup) {
      // Ensure all extras have the correct format
      const formattedExtras = initialGroup.extras.map((extra) => ({
        ...extra,
        price: extra.price.toString(),
        available: extra.available !== false, // Default to true if undefined
      }))

      setGroup({
        ...initialGroup,
        extras: formattedExtras,
      })
    } else {
      // Reset to default when opening for a new group
      setGroup({
        title: "",
        required: false,
        maxSelection: 1,
        extras: [{ name: "", price: "0", description: "", available: true }],
      })
    }
  }, [initialGroup, open])

  const handleExtraChange = (index: number, field: keyof ExtraItem, value: any) => {
    const updatedExtras = [...group.extras]
    updatedExtras[index] = { ...updatedExtras[index], [field]: value }
    setGroup({ ...group, extras: updatedExtras })
  }

  const addExtra = () => {
    setGroup({ ...group, extras: [...group.extras, { name: "", price: "0", description: "", available: true }] })
  }

  const removeExtra = (index: number) => {
    if (group.extras.length <= 1) return
    const updated = [...group.extras]
    updated.splice(index, 1)
    setGroup({ ...group, extras: updated })
  }

  const handleSubmit = () => {
    // Validate form
    if (!group.title.trim()) {
      alert("O título do grupo é obrigatório")
      return
    }

    const invalidExtras = group.extras.some(
      (extra) => !extra.name.trim() || isNaN(Number(extra.price)) || Number(extra.price) < 0,
    )

    if (invalidExtras) {
      alert("Todos os extras precisam ter nome e preço válido")
      return
    }

    // Ensure price is a string and format extras correctly
    const formattedGroup = {
      ...group,
      extras: group.extras.map((extra) => ({
        ...extra,
        price: extra.price.toString(),
        available: extra.available !== false, // Ensure boolean
      })),
    }

    onSave(formattedGroup)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialGroup?.id ? "Editar Grupo de Extras" : "Novo Grupo de Extras"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Grupo</Label>
            <Input
              id="title"
              value={group.title}
              onChange={(e) => setGroup({ ...group, title: e.target.value })}
              placeholder="Ex: Adicionais, Coberturas, Tamanhos"
              className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="required">Obrigatório</Label>
              <Select
                value={group.required ? "true" : "false"}
                onValueChange={(val) => setGroup({ ...group, required: val === "true" })}
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
                value={group.maxSelection}
                onChange={(e) => setGroup({ ...group, maxSelection: Number(e.target.value) || 1 })}
                className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Extras</Label>
              <Button type="button" onClick={addExtra} variant="outline" size="sm" className="gap-1">
                <Plus className="h-3 w-3" />
                Adicionar Extra
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {group.extras.map((extra, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-start border-b pb-3">
                  <div className="col-span-5">
                    <Label htmlFor={`extra-name-${index}`} className="text-xs mb-1 block">
                      Nome
                    </Label>
                    <Input
                      id={`extra-name-${index}`}
                      value={extra.name}
                      onChange={(e) => handleExtraChange(index, "name", e.target.value)}
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
                        onChange={(e) => handleExtraChange(index, "price", e.target.value)}
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
                      value={extra.description || ""}
                      onChange={(e) => handleExtraChange(index, "description", e.target.value)}
                      placeholder="Opcional"
                      className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
                    />
                  </div>

                  <div className="col-span-1 pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExtra(index)}
                      disabled={group.extras.length <= 1}
                      className="p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Availability toggle */}
                  <div className="col-span-12 flex items-center gap-2 mt-2">
                    <Switch
                      id={`extra-available-${index}`}
                      checked={extra.available !== false}
                      onCheckedChange={(checked) => handleExtraChange(index, "available", checked)}
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
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} className="bg-slate-800 hover:bg-slate-700">
            {initialGroup?.id ? "Atualizar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
