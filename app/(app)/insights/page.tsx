"use client"

import { useState } from "react"
import { stateHealthData, nationalAverage } from "@/lib/data/health-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts"
import { BarChart3, TrendingUp, MapPin, AlertTriangle, Info } from "lucide-react"

export default function InsightsPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null)

  const sortedByMortality = [...stateHealthData].sort(
    (a, b) => b.maternalMortality - a.maternalMortality
  )

  const disparityData = stateHealthData
    .slice(0, 15)
    .map((s) => ({
      state: s.abbreviation,
      overall: s.maternalMortality,
      black: s.blackMaternalMortality,
    }))
    .sort((a, b) => b.black - a.black)

  const obRatioData = [...stateHealthData]
    .sort((a, b) => a.obRatio - b.obRatio)
    .slice(0, 15)
    .map((s) => ({
      state: s.abbreviation,
      ratio: s.obRatio,
    }))

  const selectedStateData = selectedState
    ? stateHealthData.find((s) => s.abbreviation === selectedState)
    : null

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Public Health Insights</h1>
        <p className="text-muted-foreground">
          Understanding maternal health disparities across the United States
        </p>
      </div>

      {/* Key stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="flex flex-col gap-1 py-4">
            <span className="text-xs text-muted-foreground">National Average</span>
            <span className="text-2xl font-bold text-foreground">
              {nationalAverage.maternalMortality}
            </span>
            <span className="text-xs text-muted-foreground">deaths per 100k live births</span>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col gap-1 py-4">
            <span className="text-xs text-muted-foreground">Black Maternal Mortality</span>
            <span className="text-2xl font-bold text-foreground">
              {nationalAverage.blackMaternalMortality}
            </span>
            <span className="text-xs text-destructive">
              {(nationalAverage.blackMaternalMortality / nationalAverage.whiteMaternalMortality).toFixed(1)}x higher than white mothers
            </span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex flex-col gap-1 py-4">
            <span className="text-xs text-muted-foreground">White Maternal Mortality</span>
            <span className="text-2xl font-bold text-foreground">
              {nationalAverage.whiteMaternalMortality}
            </span>
            <span className="text-xs text-muted-foreground">deaths per 100k live births</span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex flex-col gap-1 py-4">
            <span className="text-xs text-muted-foreground">Hispanic Maternal Mortality</span>
            <span className="text-2xl font-bold text-foreground">
              {nationalAverage.hispanicMaternalMortality}
            </span>
            <span className="text-xs text-muted-foreground">deaths per 100k live births</span>
          </CardContent>
        </Card>
      </div>

      {/* Info banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 py-4">
          <Info className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-foreground leading-relaxed">
            The U.S. has the highest maternal mortality rate among developed nations.
            Approximately 80% of pregnancy-related deaths are preventable. Black women are
            disproportionately affected, dying at rates nearly 3x higher than white women
            regardless of income or education level.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="mortality" className="w-full">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="mortality" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            By State
          </TabsTrigger>
          <TabsTrigger value="disparity" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Racial Disparity
          </TabsTrigger>
          <TabsTrigger value="access" className="gap-2">
            <MapPin className="h-4 w-4" />
            OB Access
          </TabsTrigger>
        </TabsList>

        {/* Maternal Mortality by State */}
        <TabsContent value="mortality">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Maternal Mortality Rate by State
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Deaths per 100,000 live births (click a bar to view details)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sortedByMortality} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="abbreviation"
                    width={40}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      color: "var(--color-foreground)",
                    }}
                    formatter={(value: number) => [`${value} per 100k`, "Mortality Rate"]}
                  />
                  <ReferenceLine
                    x={nationalAverage.maternalMortality}
                    stroke="var(--color-destructive)"
                    strokeDasharray="3 3"
                    label={{
                      value: "National Avg",
                      position: "top",
                      fill: "var(--color-destructive)",
                      fontSize: 11,
                    }}
                  />
                  <Bar
                    dataKey="maternalMortality"
                    radius={[0, 4, 4, 0]}
                    cursor="pointer"
                    onClick={(data) => setSelectedState(data.abbreviation)}
                  >
                    {sortedByMortality.map((entry) => (
                      <Cell
                        key={entry.abbreviation}
                        fill={
                          entry.abbreviation === selectedState
                            ? "var(--color-primary)"
                            : entry.maternalMortality > nationalAverage.maternalMortality
                            ? "var(--color-destructive)"
                            : "var(--color-chart-1)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {selectedStateData && (
                <Card className="mt-4 border-primary/30 bg-primary/5">
                  <CardContent className="grid gap-4 py-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">State</p>
                      <p className="text-lg font-bold text-foreground">{selectedStateData.state}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Overall Mortality</p>
                      <p className="text-lg font-bold text-foreground">
                        {selectedStateData.maternalMortality}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Black Maternal Mortality</p>
                      <p className="text-lg font-bold text-destructive">
                        {selectedStateData.blackMaternalMortality}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Racial Disparity */}
        <TabsContent value="disparity">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Black vs. Overall Maternal Mortality
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Highlighting the disproportionate impact on Black mothers (top 15 states)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={disparityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="state"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Bar
                    dataKey="overall"
                    name="Overall"
                    fill="var(--color-chart-1)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="black"
                    name="Black Mothers"
                    fill="var(--color-destructive)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-chart-1" />
                  <span className="text-xs text-muted-foreground">Overall Mortality</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-destructive" />
                  <span className="text-xs text-muted-foreground">Black Maternal Mortality</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OB Access */}
        <TabsContent value="access">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                OB-GYN to Population Ratio
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                States with the lowest OB-GYN access (per 10,000 women of reproductive age)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={obRatioData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="state"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      color: "var(--color-foreground)",
                    }}
                    formatter={(value: number) => [
                      `${value} per 10k`,
                      "OB-GYN Ratio",
                    ]}
                  />
                  <Bar dataKey="ratio" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]}>
                    {obRatioData.map((entry) => (
                      <Cell
                        key={entry.state}
                        fill={
                          entry.ratio < 5
                            ? "var(--color-destructive)"
                            : entry.ratio < 7
                            ? "var(--color-warning)"
                            : "var(--color-chart-2)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-destructive" />
                  <span className="text-xs text-muted-foreground">{"Critical (< 5 per 10k)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-warning" />
                  <span className="text-xs text-muted-foreground">{"Low (5-7 per 10k)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-chart-2" />
                  <span className="text-xs text-muted-foreground">{"Adequate (7+ per 10k)"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-border">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold">Data Sources:</span> This visualization uses sample data
            based on patterns from CDC Maternal Mortality reports and ACOG provider distribution
            studies. Actual figures may vary. Data is presented for educational awareness only.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
