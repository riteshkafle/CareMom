"use client"

import { useAuth } from "@/hooks/use-auth"
import { calculatePregnancyWeek, calculateProgress, isPostpartum, getTrimester, getDaysUntilDue } from "@/lib/pregnancy-utils"
import { getContentForWeek } from "@/lib/data/weekly-content"
import { ProgressRing } from "@/components/dashboard/progress-ring"
import { InfoCard } from "@/components/dashboard/info-card"
import { WeeklyInsightCard } from "@/components/dashboard/weekly-insight-card"
import { DailyChecklist } from "@/components/dashboard/daily-checklist"
import { QuickSymptomModal } from "@/components/dashboard/quick-symptom-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, AlertTriangle, CheckCircle, Sparkles, Calendar } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const week = calculatePregnancyWeek(user.dueDate)
  const progress = calculateProgress(user.dueDate)
  const postpartum = isPostpartum(user.dueDate)
  const trimester = getTrimester(week)
  const daysLeft = getDaysUntilDue(user.dueDate)
  const content = getContentForWeek(week)

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">
          {postpartum ? `Welcome back, ${user.name}` : `Hello, ${user.name}`}
        </h1>
        <p className="text-muted-foreground">
          {postpartum
            ? "How are you feeling today? Remember to take care of yourself."
            : `Trimester ${trimester} \u2022 ${daysLeft} days until your due date`}
        </p>
      </div>

      {/* Postpartum banner */}
      {postpartum && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Postpartum Mode</p>
              <p className="text-sm text-muted-foreground">
                Congratulations! Your dashboard is now focused on postpartum recovery and newborn care.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 py-6">
            <ProgressRing progress={progress} week={postpartum ? 40 : week} />
            <div className="flex flex-col items-center gap-1 text-center">
              <Badge variant="secondary" className="text-xs">
                {postpartum ? "Postpartum" : `Trimester ${trimester}`}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {postpartum
                  ? "Focus on your recovery"
                  : `Week ${week} of 40`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Due: {new Date(user.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <QuickSymptomModal />
          </CardContent>
        </Card>

        {/* Weekly insight */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <WeeklyInsightCard content={content} />
          <DailyChecklist items={content.checklist} />
        </div>
      </div>

      {/* Info cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          title="What's Normal"
          icon={CheckCircle}
          items={content.whatsNormal}
          variant="success"
        />
        <InfoCard
          title="When to Call a Doctor"
          icon={AlertTriangle}
          items={content.whenToCallDoctor}
          variant="warning"
        />
        <InfoCard
          title="This Week's Focus"
          icon={Stethoscope}
          items={content.whatsHappening}
        />
      </div>
    </div>
  )
}
