"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { calculatePregnancyWeek } from "@/lib/pregnancy-utils"
import { checkRedFlags, mockGetSymptomHistory, mockSaveSymptomLog } from "@/services/symptom-service"
import type { SymptomLog, RedFlagAlert } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  AlertTriangle,
  Activity,
  Brain,
  Moon,
  Zap,
  TrendingUp,
  Save,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { VitalsCharts } from "@/components/dashboard/vitals-charts"
import { SelfLogPanel } from "@/components/dashboard/self-log-panel"

export default function SymptomsPage() {
  const { user } = useAuth()
  const [history, setHistory] = useState<SymptomLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [alerts, setAlerts] = useState<RedFlagAlert[]>([])

  // Form state
  const [headache, setHeadache] = useState(false)
  const [swelling, setSwelling] = useState(false)
  const [visionChanges, setVisionChanges] = useState(false)
  const [bpSystolic, setBpSystolic] = useState("")
  const [bpDiastolic, setBpDiastolic] = useState("")
  const [painLevel, setPainLevel] = useState([0])
  const [sleepHours, setSleepHours] = useState("")
  const [mood, setMood] = useState([3])
  const [energyLevel, setEnergyLevel] = useState([3])

  const week = user ? calculatePregnancyWeek(user.dueDate) : 0

  const loadHistory = useCallback(async () => {
    setLoading(true)
    const data = await mockGetSymptomHistory()
    setHistory(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const log: SymptomLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      headache,
      swelling,
      visionChanges,
      bloodPressureSystolic: bpSystolic ? parseInt(bpSystolic) : null,
      bloodPressureDiastolic: bpDiastolic ? parseInt(bpDiastolic) : null,
      painLevel: painLevel[0],
      sleepHours: sleepHours ? parseInt(sleepHours) : 0,
      mood: mood[0],
      energyLevel: energyLevel[0],
    }

    const flags = checkRedFlags(log, week)
    setAlerts(flags)

    await mockSaveSymptomLog(log)
    setHistory((prev) => [...prev, log])
    toast.success("Symptoms logged successfully")
    setSaving(false)

    // Reset form
    setHeadache(false)
    setSwelling(false)
    setVisionChanges(false)
    setBpSystolic("")
    setBpDiastolic("")
    setPainLevel([0])
    setSleepHours("")
    setMood([3])
    setEnergyLevel([3])
  }

  const moodLabels = ["Very Low", "Low", "Okay", "Good", "Great"]
  const energyLabels = ["Exhausted", "Low", "Moderate", "Good", "Energized"]

  const chartData = history.map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", { weekday: "short" }),
    mood: log.mood,
    energy: log.energyLevel,
    pain: log.painLevel,
    sleep: log.sleepHours,
    bp: log.bloodPressureSystolic,
  }))

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Symptom & Mood Tracker</h1>
        <p className="text-muted-foreground">
          Track your symptoms daily to help identify patterns and potential concerns
        </p>
      </div>

      {/* Red flag alerts */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={
                alert.severity === "critical"
                  ? "border-destructive bg-destructive/5"
                  : "border-warning bg-warning/5"
              }
            >
              <CardContent className="flex items-start gap-3 py-4">
                <AlertTriangle
                  className={`h-5 w-5 shrink-0 ${alert.severity === "critical" ? "text-destructive" : "text-warning"
                    }`}
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground">{alert.message}</p>
                  <p className="text-sm text-muted-foreground">{alert.action}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Health Vitals from wearable/server */}
      <VitalsCharts />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Log form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="h-5 w-5 text-primary" />
              Log Today&apos;s Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="headache">Headache</Label>
                  <Switch id="headache" checked={headache} onCheckedChange={setHeadache} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="swelling">Swelling</Label>
                  <Switch id="swelling" checked={swelling} onCheckedChange={setSwelling} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="vision">Vision changes</Label>
                  <Switch id="vision" checked={visionChanges} onCheckedChange={setVisionChanges} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Blood pressure</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Systolic"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(e.target.value)}
                    className="w-28"
                  />
                  <span className="text-muted-foreground">/</span>
                  <Input
                    type="number"
                    placeholder="Diastolic"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(e.target.value)}
                    className="w-28"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label>Pain level</Label>
                  <span className="text-sm font-medium text-primary">{painLevel[0]}/10</span>
                </div>
                <Slider value={painLevel} onValueChange={setPainLevel} max={10} step={1} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="sleep">Sleep hours</Label>
                <Input
                  id="sleep"
                  type="number"
                  placeholder="Hours of sleep"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  min={0}
                  max={24}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-muted-foreground" />
                    Mood
                  </Label>
                  <span className="text-sm font-medium text-primary">{moodLabels[mood[0] - 1]}</span>
                </div>
                <Slider value={mood} onValueChange={setMood} min={1} max={5} step={1} />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    Energy level
                  </Label>
                  <span className="text-sm font-medium text-primary">
                    {energyLabels[energyLevel[0] - 1]}
                  </span>
                </div>
                <Slider value={energyLevel} onValueChange={setEnergyLevel} min={1} max={5} step={1} />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Log"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Weekly summary and trends */}
        <div className="flex flex-col gap-4">
          {/* Weekly summary card */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 rounded-lg bg-muted p-3">
                    <span className="text-xs text-muted-foreground">Avg Mood</span>
                    <span className="text-lg font-semibold text-foreground">
                      {history.length > 0
                        ? (history.reduce((sum, l) => sum + l.mood, 0) / history.length).toFixed(1)
                        : "--"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg bg-muted p-3">
                    <span className="text-xs text-muted-foreground">Avg Sleep</span>
                    <span className="text-lg font-semibold text-foreground">
                      {history.length > 0
                        ? (history.reduce((sum, l) => sum + l.sleepHours, 0) / history.length).toFixed(1)
                        : "--"}
                      h
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg bg-muted p-3">
                    <span className="text-xs text-muted-foreground">Avg Energy</span>
                    <span className="text-lg font-semibold text-foreground">
                      {history.length > 0
                        ? (history.reduce((sum, l) => sum + l.energyLevel, 0) / history.length).toFixed(1)
                        : "--"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg bg-muted p-3">
                    <span className="text-xs text-muted-foreground">Avg Pain</span>
                    <span className="text-lg font-semibold text-foreground">
                      {history.length > 0
                        ? (history.reduce((sum, l) => sum + l.painLevel, 0) / history.length).toFixed(1)
                        : "--"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mood & Energy chart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                <Brain className="h-4 w-4 text-primary" />
                Mood & Energy Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                    <YAxis domain={[0, 5]} className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        color: "var(--color-foreground)",
                      }}
                    />
                    <Line type="monotone" dataKey="mood" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: "var(--color-primary)" }} name="Mood" />
                    <Line type="monotone" dataKey="energy" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ fill: "var(--color-chart-2)" }} name="Energy" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Sleep & Pain chart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                <Moon className="h-4 w-4 text-primary" />
                Sleep & Pain
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                    <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        color: "var(--color-foreground)",
                      }}
                    />
                    <Bar dataKey="sleep" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} name="Sleep (hrs)" />
                    <Bar dataKey="pain" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} name="Pain" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
