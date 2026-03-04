"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { ClipboardPlus, Check } from "lucide-react"

const moodEmojis = ["😞", "😟", "😐", "🙂", "😊"]
const moodLabels = ["Very Low", "Low", "Okay", "Good", "Great"]

export function SelfLogPanel() {
    const [headache, setHeadache] = useState(false)
    const [visionIssues, setVisionIssues] = useState(false)
    const [painLevel, setPainLevel] = useState([0])
    const [mood, setMood] = useState([3])
    const [saved, setSaved] = useState(false)

    function handleSave() {
        setSaved(true)
        toast.success("Today's log saved successfully")
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <Card className="border-border">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-foreground text-sm">
                    <ClipboardPlus className="h-4 w-4 text-primary" />
                    How Are You Feeling Today?
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {/* Toggle symptoms */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
                        <Label htmlFor="log-headache" className="text-xs cursor-pointer">Headache</Label>
                        <Switch id="log-headache" checked={headache} onCheckedChange={setHeadache} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
                        <Label htmlFor="log-vision" className="text-xs cursor-pointer">Vision Issues</Label>
                        <Switch id="log-vision" checked={visionIssues} onCheckedChange={setVisionIssues} />
                    </div>
                </div>

                {/* Pain level */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Pain Level</Label>
                        <span className="text-xs font-semibold text-primary">{painLevel[0]}/10</span>
                    </div>
                    <Slider value={painLevel} onValueChange={setPainLevel} max={10} step={1} />
                </div>

                {/* Mood */}
                <div className="flex flex-col gap-2">
                    <Label className="text-xs">Mood</Label>
                    <div className="flex items-center justify-between gap-1">
                        {moodEmojis.map((emoji, i) => (
                            <button
                                key={i}
                                onClick={() => setMood([i + 1])}
                                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-lg transition-all ${mood[0] === i + 1
                                        ? "bg-primary/10 ring-2 ring-primary/30 scale-110"
                                        : "bg-muted hover:bg-muted/80"
                                    }`}
                            >
                                <span>{emoji}</span>
                                <span className="text-[9px] text-muted-foreground">{moodLabels[i]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <Button size="sm" className="w-full gap-2" onClick={handleSave}>
                    {saved ? <Check className="h-4 w-4" /> : <ClipboardPlus className="h-4 w-4" />}
                    {saved ? "Saved!" : "Log Today's Check-in"}
                </Button>
            </CardContent>
        </Card>
    )
}
