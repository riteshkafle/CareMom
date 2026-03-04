"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckSquare } from "lucide-react"

interface DailyChecklistProps {
  items: string[]
}

export function DailyChecklist({ items }: DailyChecklistProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  const completedCount = Object.values(checked).filter(Boolean).length

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-semibold text-foreground">Daily Checklist</CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{items.length} done
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <label key={i} className="flex cursor-pointer items-center gap-3">
              <Checkbox
                checked={checked[i] ?? false}
                onCheckedChange={(val) =>
                  setChecked((prev) => ({ ...prev, [i]: val === true }))
                }
              />
              <span
                className={`text-sm transition-colors ${
                  checked[i] ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {item}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
