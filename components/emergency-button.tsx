"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Phone } from "lucide-react"

export function EmergencyButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-destructive shadow-lg transition-transform hover:scale-105 active:scale-95 md:bottom-6"
        aria-label="Need urgent help?"
      >
        <Phone className="h-6 w-6 text-destructive-foreground" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Need Urgent Help?</DialogTitle>
            <DialogDescription className="pt-2 text-base text-foreground">
              If you are experiencing severe symptoms such as heavy bleeding, severe headache with
              vision changes, chest pain, difficulty breathing, or seizures:
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-2">
            <a
              href="tel:911"
              className="flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-3 text-center font-semibold text-destructive-foreground transition-colors hover:opacity-90"
            >
              <Phone className="h-5 w-5" />
              Call 911
            </a>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Postpartum Support International Helpline:</span>
                <br />
                1-800-944-4773 (call or text)
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold">988 Suicide & Crisis Lifeline:</span>
                <br />
                Call or text 988
              </p>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Always contact your healthcare provider if you have concerns about your health or
              your baby&apos;s health.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
