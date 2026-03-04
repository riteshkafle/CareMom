"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"
import { Heart, Wind, Thermometer, Brain, Activity, Moon } from "lucide-react"
import { demoVitalsData } from "@/lib/data/demo-data"

const vitalsData = demoVitalsData

type VitalKey = "heartRate" | "oxygenSaturation" | "temperature" | "stressScore" | "respirationRate" | "sleepHours"

interface VitalConfig {
    key: VitalKey
    label: string
    unit: string
    color: string
    icon: typeof Heart
    min: number
    max: number
    latest: number
    normal: string
}

const vitalConfigs: VitalConfig[] = [
    {
        key: "heartRate", label: "Heart Rate", unit: "bpm", color: "hsl(0, 84%, 60%)",
        icon: Heart, min: 60, max: 100, latest: vitalsData[6].heartRate, normal: "60-100 bpm",
    },
    {
        key: "oxygenSaturation", label: "SpO₂", unit: "%", color: "hsl(210, 84%, 55%)",
        icon: Activity, min: 94, max: 100, latest: vitalsData[6].oxygenSaturation, normal: "95-100%",
    },
    {
        key: "temperature", label: "Temperature", unit: "°F", color: "hsl(30, 84%, 55%)",
        icon: Thermometer, min: 96, max: 100, latest: vitalsData[6].temperature, normal: "97.0-99.0°F",
    },
    {
        key: "stressScore", label: "Stress Score", unit: "", color: "hsl(280, 70%, 55%)",
        icon: Brain, min: 0, max: 100, latest: vitalsData[6].stressScore, normal: "0-40 (low)",
    },
    {
        key: "respirationRate", label: "Respiration", unit: "br/m", color: "hsl(160, 60%, 45%)",
        icon: Wind, min: 10, max: 25, latest: vitalsData[6].respirationRate, normal: "12-20 br/min",
    },
    {
        key: "sleepHours", label: "Sleep", unit: "hrs", color: "hsl(240, 60%, 60%)",
        icon: Moon, min: 0, max: 12, latest: vitalsData[6].sleepHours, normal: "7-9 hours",
    },
]

export function VitalsCharts() {
    const [activeVital, setActiveVital] = useState<VitalKey>("heartRate")
    const activeConfig = vitalConfigs.find((v) => v.key === activeVital)!

    const chartConfig = {
        [activeVital]: {
            label: activeConfig.label,
            color: activeConfig.color,
        },
    }

    return (
        <Card className="border-border">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                        <Activity className="h-5 w-5 text-primary" />
                        Health Vitals
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">Last 7 days</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {/* Vital stat cards row */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {vitalConfigs.map((v) => {
                        const Icon = v.icon
                        const isActive = activeVital === v.key
                        return (
                            <button
                                key={v.key}
                                onClick={() => setActiveVital(v.key)}
                                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-center transition-all ${isActive
                                        ? "bg-primary/10 ring-2 ring-primary/30 shadow-sm"
                                        : "bg-muted hover:bg-muted/80"
                                    }`}
                            >
                                <Icon className="h-4 w-4" style={{ color: v.color }} />
                                <span className="text-[10px] text-muted-foreground leading-tight">{v.label}</span>
                                <span className="text-sm font-bold text-foreground">
                                    {v.latest}
                                    {v.unit && <span className="text-[10px] font-normal text-muted-foreground ml-0.5">{v.unit}</span>}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Line chart */}
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <LineChart data={vitalsData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <YAxis
                            domain={[activeConfig.min, activeConfig.max]}
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                            width={40}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey={activeVital}
                            stroke={activeConfig.color}
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: activeConfig.color, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ChartContainer>

                <p className="text-xs text-muted-foreground text-center">
                    Normal range for {activeConfig.label}: <span className="font-medium text-foreground">{activeConfig.normal}</span>
                </p>
            </CardContent>
        </Card>
    )
}
