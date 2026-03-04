import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeeklyContent } from "@/types"
import { Baby } from "lucide-react"

interface WeeklyInsightCardProps {
  content: WeeklyContent
}

export function WeeklyInsightCard({ content }: WeeklyInsightCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Baby className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            {"Your baby is about the size of a"} {content.babySize.toLowerCase()}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {content.babyLength} long, ~{content.babyWeight}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            This week
          </p>
          <ul className="flex flex-col gap-1.5">
            {content.whatsHappening.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
