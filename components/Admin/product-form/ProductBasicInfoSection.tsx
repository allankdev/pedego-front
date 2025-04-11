"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { FileText } from 'lucide-react'

interface Props {
  name: string
  setName: (val: string) => void
  description: string
  setDescription: (val: string) => void
}

export function ProductBasicInfoSection({ name, setName, description, setDescription }: Props) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-500" />
          Informações Básicas
        </h3>
        <Separator className="my-2" />
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-slate-700">Nome do produto</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700">Descrição</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-[100px] focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
          />
        </div>
      </div>
    </div>
  )
}
