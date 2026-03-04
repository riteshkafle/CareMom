"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ClipboardPlus } from "lucide-react"
import { toast } from "sonner"

export function QuickSymptomModal() {
  const [open, setOpen] = useState(false)
  const [headache, setHeadache] = useState(false)
  const [swelling, setSwelling] = useState(false)
  const [visionChanges, setVisionChanges] = useState(false)
  const [painLevel, setPainLevel] = useState([0])
  const [mood, setMood] = useState([3])

  function handleSave() {
    toast.success("Symptoms logged successfully")
    setOpen(false)
    setHeadache(false)
    setSwelling(false)
    setVisionChanges(false)
    setPainLevel([0])
    setMood([3])
  }

  const moodLabels = ["Very Low", "Low", "Okay", "Good", "Great"]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <ClipboardPlus className="h-4 w-4" />
          Quick Log
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Quick Symptom Log</DialogTitle>
          <DialogDescription>Record how you&apos;re feeling right now</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 pt-2">
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

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Pain level</Label>
              <span className="text-sm font-medium text-primary">{painLevel[0]}/10</span>
            </div>
            <Slider value={painLevel} onValueChange={setPainLevel} max={10} step={1} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Mood</Label>
              <span className="text-sm font-medium text-primary">{moodLabels[mood[0] - 1]}</span>
            </div>
            <Slider value={mood} onValueChange={setMood} min={1} max={5} step={1} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bp">Blood pressure (optional)</Label>
            <div className="flex items-center gap-2">
              <Input id="bp" type="number" placeholder="Systolic" className="w-24" />
              <span className="text-muted-foreground">/</span>
              <Input type="number" placeholder="Diastolic" className="w-24" />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Log
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
