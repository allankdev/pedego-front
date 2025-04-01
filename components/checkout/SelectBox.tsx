'use client'

import { cn } from '@/lib/utils'

interface SelectBoxProps {
  label: string
  selected: boolean
  onClick: () => void
  description?: string
}

export function SelectBox({ label, selected, onClick, description }: SelectBoxProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'border rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm',
        selected ? 'border-black bg-muted' : 'border-gray-300'
      )}
    >
      <p className="font-medium">{label}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
