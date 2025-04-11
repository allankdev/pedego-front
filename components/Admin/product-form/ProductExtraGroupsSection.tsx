"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Coffee, Edit, Trash } from 'lucide-react'
import type { ExtraGroup } from "@/types/product"
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Props {
  extraGroups: ExtraGroup[]
  onAddGroup: () => void
  onEditGroup: (index: number) => void
  onDeleteGroup: (index: number) => void
  onChangeAvailability: (groupIndex: number, extraIndex: number, available: boolean) => void
}

export function ProductExtraGroupsSection({
  extraGroups,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
  onChangeAvailability,
}: Props) {
  const formatCurrency = (value: string | number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) || 0)

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Coffee className="h-4 w-4 text-slate-500" />
            Grupos de Extras
          </h3>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="button"
              onClick={onAddGroup}
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

      {extraGroups.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-md border border-slate-200">
          <Coffee className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 mb-2">Este produto não possui grupos de extras</p>
          <Button type="button" onClick={onAddGroup} variant="outline" size="sm" className="gap-2">
            <Plus className="h-3.5 w-3.5" />
            Adicionar grupo de extras
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {extraGroups.map((group, groupIndex) => (
            <motion.div
              key={group.id || groupIndex}
              className="border rounded-md p-4 bg-slate-50 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: groupIndex * 0.05 }}
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
                      onClick={() => onEditGroup(groupIndex)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => onDeleteGroup(groupIndex)}
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
                {group.extras.map((extra, extraIndex) => (
                  <li key={extra.id || extraIndex} className={extra.available === false ? "text-slate-400" : ""}>
                    <div className="flex items-center justify-between">
                      <div>
                        {extra.name} — {formatCurrency(extra.price)}{" "}
                        {extra.description && <span className="text-xs text-slate-500">({extra.description})</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`extra-available-${extraIndex}`}
                          checked={extra.available !== false}
                          onCheckedChange={(checked) => onChangeAvailability(groupIndex, extraIndex, checked)}
                          className="data-[state=checked]:bg-green-600"
                        />
                        <Label htmlFor={`extra-available-${extraIndex}`} className="text-sm">
                          {extra.available !== false ? "Disponível" : "Indisponível"}
                        </Label>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
