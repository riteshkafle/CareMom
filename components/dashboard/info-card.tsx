import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoCardProps {
  title: string
  icon: LucideIcon
  items: string[]
  variant?: "default" | "warning" | "success"
}

export function InfoCard({ title, icon: Icon, items, variant = "default" }: InfoCardProps) {
  return (
    <Card
      className={cn(
        "border-border",
        variant === "warning" && "border-warning bg-warning/5",
        variant === "success" && "border-primary bg-primary/5"
      )}
    >
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Icon
          className={cn(
            "h-5 w-5",
            variant === "default" && "text-primary",
            variant === "warning" && "text-warning-foreground",
            variant === "success" && "text-primary"
          )}
        />
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span
                className={cn(
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                  variant === "default" && "bg-primary/50",
                  variant === "warning" && "bg-warning",
                  variant === "success" && "bg-primary"
                )}
              />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
