"use client"

import { useState, useEffect, useCallback } from "react"
import { mockGetAppointments, mockGetDoctors, mockBookAppointment } from "@/services/appointment-service"
import type { Appointment, Doctor } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  CalendarDays,
  Clock,
  Plus,
  Stethoscope,
  FileText,
  CheckCircle,
  Calendar,
  User,
  Video,
  Star,
  MapPin,
  Award,
  Search,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const appointmentTypeIcons: Record<string, typeof Stethoscope> = {
  checkup: Stethoscope,
  ultrasound: FileText,
  lab: FileText,
  consultation: User,
}

const appointmentTypeColors: Record<string, string> = {
  checkup: "bg-primary/10 text-primary",
  ultrasound: "bg-chart-2/10 text-chart-2",
  lab: "bg-chart-3/10 text-chart-3",
  consultation: "bg-chart-4/10 text-chart-4",
}

const specColors: Record<string, string> = {
  "OB-GYN": "bg-primary/10 text-primary",
  "Midwife": "bg-chart-5/10 text-chart-5",
  "Maternal-Fetal Medicine": "bg-chart-4/10 text-chart-4",
  "Pediatrician": "bg-chart-2/10 text-chart-2",
  "Lactation Consultant": "bg-warning/15 text-warning-foreground",
  "Doula": "bg-accent text-accent-foreground",
}

const specGradients: Record<string, string> = {
  "OB-GYN": "from-primary to-chart-2",
  "Midwife": "from-chart-5 to-chart-2",
  "Maternal-Fetal Medicine": "from-chart-4 to-primary",
  "Pediatrician": "from-chart-2 to-primary",
  "Lactation Consultant": "from-warning to-chart-3",
  "Doula": "from-accent to-primary/80",
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM",
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [isDoctorView, setIsDoctorView] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [specFilter, setSpecFilter] = useState<string>("all")

  // Booking state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookDate, setBookDate] = useState("")
  const [bookTime, setBookTime] = useState("")
  const [bookType, setBookType] = useState<Appointment["type"]>("checkup")
  const [bookingLoading, setBookingLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [aptData, docData] = await Promise.all([mockGetAppointments(), mockGetDoctors()])
    setAppointments(aptData)
    setDoctors(docData)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function openBooking(doctor: Doctor) {
    setSelectedDoctor(doctor)
    setBookDate("")
    setBookTime("")
    setBookType("checkup")
    setBookingOpen(true)
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDoctor) return
    setBookingLoading(true)
    const newApt = await mockBookAppointment({
      title: `${bookType.charAt(0).toUpperCase() + bookType.slice(1)} with ${selectedDoctor.name}`,
      doctor: selectedDoctor.name,
      date: bookDate,
      time: bookTime,
      type: bookType,
    })
    setAppointments((prev) => [...prev, newApt])
    toast.success(`Appointment booked with ${selectedDoctor.name}`)
    setBookingOpen(false)
    setBookingLoading(false)
  }

  const upcoming = appointments.filter((a) => a.status === "upcoming")
  const completed = appointments.filter((a) => a.status === "completed")

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpec = specFilter === "all" || doc.specialization === specFilter
    return matchesSearch && matchesSpec
  })

  const inAreaDoctors = filteredDoctors.filter((d) => d.inArea)
  const outOfAreaDoctors = filteredDoctors.filter((d) => !d.inArea)

  function AppointmentCard({ apt }: { apt: Appointment }) {
    const Icon = appointmentTypeIcons[apt.type] || Stethoscope
    const colorClass = appointmentTypeColors[apt.type] || "bg-muted text-muted-foreground"

    return (
      <Card className="border-border transition-shadow hover:shadow-md">
        <CardContent className="flex items-start gap-4 py-4">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-start justify-between">
              <p className="font-semibold text-foreground">{apt.title}</p>
              <Badge
                variant={apt.status === "upcoming" ? "default" : "secondary"}
                className="text-xs"
              >
                {apt.status === "upcoming" ? "Upcoming" : "Completed"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{apt.doctor}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {new Date(apt.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {apt.time}
              </span>
            </div>
            {apt.notes && (
              <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                {apt.notes}
              </p>
            )}
            {apt.id === "apt-1" && apt.status === "upcoming" && (
              <Button
                size="sm"
                className="mt-2 gap-2 self-start"
                onClick={() => window.open("https://meet.google.com/hzv-sxdu-ivq", "_blank")}
              >
                <Video className="h-4 w-4" />
                Join Meeting
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  function DoctorCard({ doctor }: { doctor: Doctor }) {
    const gradient = specGradients[doctor.specialization] || "from-gray-500 to-gray-600"
    const specColor = specColors[doctor.specialization] || "bg-muted text-muted-foreground"

    return (
      <Card className="group relative overflow-hidden border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Top gradient accent */}
        <div className={cn("h-1.5 w-full bg-gradient-to-r", gradient)} />
        <CardContent className="flex flex-col gap-4 p-5">
          {/* Header: avatar + name/spec */}
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white shadow-md",
              gradient
            )}>
              {doctor.avatarInitials}
            </div>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{doctor.name}</p>
              <Badge className={cn("w-fit text-xs font-medium", specColor)} variant="secondary">
                {doctor.specialization}
              </Badge>
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {doctor.bio}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{doctor.rating}</span>
              <span>({doctor.reviewCount})</span>
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5" />
              {doctor.yearsExperience} yrs
            </span>
          </div>

          {/* Location & hospital */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{doctor.hospital}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {doctor.location}
            </span>
          </div>

          {/* Available days */}
          <div className="flex flex-wrap gap-1">
            {doctor.availableDays.map((day) => (
              <span
                key={day}
                className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Book button */}
          <Button
            size="sm"
            className={cn("w-full gap-2 bg-gradient-to-r text-white shadow-sm transition-all hover:shadow-md", gradient)}
            onClick={() => openBooking(doctor)}
          >
            <CalendarDays className="h-4 w-4" />
            Schedule Appointment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">Manage your prenatal care schedule</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDoctorView(!isDoctorView)}
          className="gap-2"
        >
          <Stethoscope className="h-4 w-4" />
          {isDoctorView ? "Patient View" : "Doctor View"}
        </Button>
      </div>

      {isDoctorView ? (
        <DoctorDashboard appointments={appointments} />
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({completed.length})
            </TabsTrigger>
            <TabsTrigger value="find-doctor" className="gap-2">
              <Search className="h-4 w-4" />
              Find a Doctor
            </TabsTrigger>
          </TabsList>

          {/* Upcoming tab */}
          <TabsContent value="upcoming" className="flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))
            ) : upcoming.length === 0 ? (
              <Card className="border-border">
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                  <p className="font-medium text-foreground">No upcoming appointments</p>
                  <p className="text-sm text-muted-foreground">
                    Book your next prenatal visit to stay on track
                  </p>
                </CardContent>
              </Card>
            ) : (
              upcoming.map((apt) => <AppointmentCard key={apt.id} apt={apt} />)
            )}
          </TabsContent>

          {/* Completed tab */}
          <TabsContent value="completed" className="flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))
            ) : completed.length === 0 ? (
              <Card className="border-border">
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <CheckCircle className="h-10 w-10 text-muted-foreground" />
                  <p className="font-medium text-foreground">No completed appointments</p>
                </CardContent>
              </Card>
            ) : (
              completed.map((apt) => <AppointmentCard key={apt.id} apt={apt} />)
            )}
          </TabsContent>

          {/* Find a Doctor tab */}
          <TabsContent value="find-doctor" className="flex flex-col gap-6">
            {/* Search & filter bar */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, specialty, or hospital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={specFilter} onValueChange={setSpecFilter}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="All Specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  <SelectItem value="OB-GYN">OB-GYN</SelectItem>
                  <SelectItem value="Midwife">Midwife</SelectItem>
                  <SelectItem value="Maternal-Fetal Medicine">Maternal-Fetal Medicine</SelectItem>
                  <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                  <SelectItem value="Lactation Consultant">Lactation Consultant</SelectItem>
                  <SelectItem value="Doula">Doula</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <>
                {/* In Your Area */}
                {inAreaDoctors.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Doctors in Your Area</h2>
                      <Badge variant="secondary" className="text-xs">{inAreaDoctors.length}</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {inAreaDoctors.map((doc) => (
                        <DoctorCard key={doc.id} doctor={doc} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Out of Your Area */}
                {outOfAreaDoctors.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <h2 className="text-lg font-semibold text-foreground">Doctors Outside Your Area</h2>
                      <Badge variant="outline" className="text-xs">{outOfAreaDoctors.length}</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {outOfAreaDoctors.map((doc) => (
                        <DoctorCard key={doc.id} doctor={doc} />
                      ))}
                    </div>
                  </div>
                )}

                {filteredDoctors.length === 0 && (
                  <Card className="border-border">
                    <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                      <Search className="h-10 w-10 text-muted-foreground" />
                      <p className="font-medium text-foreground">No doctors found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filter
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Booking Dialogs */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Schedule Appointment
            </DialogTitle>
            <DialogDescription>
              {selectedDoctor && (
                <span>Book a visit with <strong>{selectedDoctor.name}</strong></span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedDoctor && (
            <form onSubmit={handleBook} className="flex flex-col gap-4 pt-2">
              {/* Doctor info summary */}
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
                  specGradients[selectedDoctor.specialization] || "from-gray-500 to-gray-600"
                )}>
                  {selectedDoctor.avatarInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedDoctor.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedDoctor.specialization} • {selectedDoctor.hospital}</p>
                </div>
              </div>

              {/* Appointment type */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="apt-type">Appointment Type</Label>
                <Select value={bookType} onValueChange={(v) => setBookType(v as Appointment["type"])}>
                  <SelectTrigger id="apt-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="ultrasound">Ultrasound</SelectItem>
                    <SelectItem value="lab">Lab Work</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="apt-date">Date</Label>
                <Input
                  id="apt-date"
                  type="date"
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                {selectedDoctor.availableDays.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Available: {selectedDoctor.availableDays.join(", ")}
                  </p>
                )}
              </div>

              {/* Time slots */}
              <div className="flex flex-col gap-2">
                <Label>Time Slot</Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookTime(slot)}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 text-xs font-medium transition-all",
                        bookTime === slot
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className={cn(
                  "w-full gap-2 bg-gradient-to-r text-white",
                  specGradients[selectedDoctor.specialization] || "from-gray-500 to-gray-600"
                )}
                disabled={bookingLoading || !bookDate || !bookTime}
              >
                {bookingLoading ? "Booking..." : "Confirm Appointment"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DoctorDashboard({ appointments }: { appointments: Appointment[] }) {
  const [noteText, setNoteText] = useState("")

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Stethoscope className="h-5 w-5 text-primary" />
            Provider Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">Total Appointments</p>
              <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-xs text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-primary">
                {appointments.filter((a) => a.status === "upcoming").length}
              </p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-accent-foreground">
                {appointments.filter((a) => a.status === "completed").length}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Add Clinical Note</Label>
            <textarea
              className="min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter clinical notes..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <Button
              size="sm"
              className="self-end"
              onClick={() => {
                toast.success("Note saved")
                setNoteText("")
              }}
            >
              Save Note
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Patient Symptom Log Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="text-sm text-foreground">Average mood this week</span>
              <Badge variant="secondary">3.8 / 5</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="text-sm text-foreground">Average sleep</span>
              <Badge variant="secondary">6.5 hrs</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="text-sm text-foreground">Red flags this week</span>
              <Badge variant="destructive">0</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="text-sm text-foreground">AI escalation flags</span>
              <Badge variant="destructive">0</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
