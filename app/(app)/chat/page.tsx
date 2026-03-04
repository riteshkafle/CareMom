"use client"

import { useState, useRef, useEffect } from "react"
import type { ChatMessage } from "@/types"
import { marked } from "marked"
import DOMPurify from "dompurify"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MessageCircle,
  Send,
  AlertTriangle,
  ShieldCheck,
  Bot,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { demoChatQuickPrompts, demoChatSeedMessages } from "@/lib/data/demo-data"

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(demoChatSeedMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEscalation, setShowEscalation] = useState(false)
  const [mamaOpen, setMamaOpen] = useState(false)
  const [medicineOpen, setMedicineOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [sessionId, setSessionId] = useState("")


  useEffect(() => {
    // Generate a valid UUID on every page refresh to satisfy Postgres schema
    if (!sessionId) {
      setSessionId(crypto.randomUUID())
    }
  }, [sessionId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  async function handleSend() {
    if (!input.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: sessionId || "123e4567-e89b-12d3-a456-426614174000",
          message: userMessage.content,
        }),
      })

      if (!res.ok) {
        throw new Error("API responded with an error")
      }

      const contentType = res.headers.get("content-type") || ""

      // If backend returned JSON directly (Pharmacist queued, Sentry alert)
      if (contentType.includes("application/json")) {
        const data = await res.json()
        const isAlert = data.status === "alert"
        const isPharmacist = data.agent === "pharmacist"

        setIsTyping(false)
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-response`,
          role: "assistant",
          content: data.message,
          escalationFlag: isAlert,
          safetyNote: isPharmacist ? "Pending Doctor Review" : undefined,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        if (isAlert) setShowEscalation(true)
        return
      }

      // If backend returned a StreamingResponse (Coach text stream)
      setIsTyping(false)
      const responseId = `msg-${Date.now()}-response`
      setMessages((prev) => [
        ...prev,
        {
          id: responseId,
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
        },
      ])

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let done = false
      let fullText = ""
      

      while (reader && !done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          fullText += chunk
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === responseId ? { ...msg, content: fullText } : msg
            )
          )
        }
      }

    } catch (e) {
      console.error(e)
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-error`,
          role: "assistant",
          content: "I'm sorry, I couldn't reach the AI backend.",
          timestamp: new Date().toISOString(),
        },
      ])
      setIsTyping(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickPrompts = demoChatQuickPrompts

  return (
    <div className="flex flex-col gap-4 pb-24 md:pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">AI Health Assistant</h1>
          <p className="text-muted-foreground">
            Ask questions about your pregnancy, symptoms, and wellness
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="gap-2 rounded-lg shadow-sm hover:shadow-md transition-all"
            onClick={() => setMamaOpen(true)}
          >
            🎙️ Talk to MamaCare
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2 rounded-lg shadow-sm hover:shadow-md transition-all"
            onClick={() => setMedicineOpen(true)}
          >
            💊 Medicine Analyzer
          </Button>
        </div>
      </div>

      {/* Escalation banner */}
      {showEscalation && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">
                Urgent Attention Needed
              </p>
              <p className="text-sm text-muted-foreground">
                Based on your conversation, we recommend contacting your healthcare provider or
                calling 911 immediately if you are experiencing a medical emergency.
              </p>
              <div className="mt-2 flex gap-2">
                <a
                  href="tel:911"
                  className="inline-flex items-center rounded-lg bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground"
                >
                  Call 911
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEscalation(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat container */}
      <Card className="flex flex-col border-border w-full max-w-full overflow-hidden shadow-sm">
        <div className="flex-1 p-4 pb-8">
          <div className="flex flex-col gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2 sm:gap-3 w-full",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    msg.role === "user"
                      ? "bg-primary"
                      : "bg-accent"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-accent-foreground" />
                  )}
                </div>

                <div
                  className={cn(
                    "flex w-[85%] sm:max-w-[80%] flex-col gap-2",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm break-words overflow-hidden",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground prose prose-sm max-w-none dark:prose-invert"
                    )}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(marked.parse(msg.content, { async: false }) as string),
                        }}
                      />
                    )}
                  </div>

                  {msg.safetyNote && (
                    <div className="flex items-start gap-1.5 rounded-lg bg-accent/50 px-3 py-2 text-xs">
                      <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{msg.safetyNote}</span>
                    </div>
                  )}

                  {msg.escalationFlag && (
                    <div className="flex items-start gap-1.5 rounded-lg bg-destructive/10 px-3 py-2 text-xs">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-destructive" />
                      <span className="text-destructive">
                        This may require immediate medical attention
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                  <Bot className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                </div>
              </div>
            )}
            {/* Native Window auto-scroll target */}
            <div ref={scrollRef} className="h-4 w-full" />
          </div>
        </div>



        {/* Input */}
        <div className="sticky bottom-0 bg-card z-10 flex items-end gap-2 border-t border-border p-4 rounded-b-xl shadow-sm">
          <div className="flex h-10 w-10 mb-1 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question... (Shift+Enter for newline)"
            disabled={isTyping}
            className="flex-1 min-h-[44px] max-h-[200px] resize-none overflow-y-auto"
            rows={1}
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim() || isTyping} className="mb-1 h-10 w-10">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        This AI assistant provides general pregnancy information only. It is not a substitute
        for professional medical advice. Always consult your healthcare provider.
      </p>

      {/* MamaCare Voice Popup */}
      <Dialog open={mamaOpen} onOpenChange={setMamaOpen}>
        <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-5 pb-3">
            <DialogTitle className="flex items-center gap-2 text-foreground">
              🎙️ Talk to MamaCare
            </DialogTitle>
          </DialogHeader>
          <div className="w-full" style={{ height: 600 }}>
            <iframe
              src="/api/mamacare"
              className="h-full w-full border-0"
              allow="microphone; camera; autoplay"
              title="MamaCare Voice Assistant"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Medicine Analyzer Popup */}
      <Dialog open={medicineOpen} onOpenChange={setMedicineOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-5 pb-3">
            <DialogTitle className="flex items-center gap-2 text-foreground">
              💊 Medicine Analyzer
            </DialogTitle>
          </DialogHeader>
          <div className="w-full" style={{ height: 600 }}>
            <iframe
              src="https://inartistic-cristopher-certifiable.ngrok-free.dev/medicine-scan"
              className="h-full w-full border-0"
              allow="camera; microphone"
              title="Medicine Analyzer"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
