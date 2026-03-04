export interface User {
  id: string
  name: string
  email: string
  dueDate: string
  state: string
  riskFactors: string[]
  createdAt: string
}

export interface WeeklyContent {
  week: number
  babySize: string
  babySizeEmoji: string
  babyLength: string
  babyWeight: string
  whatsHappening: string[]
  whatsNormal: string[]
  whenToCallDoctor: string[]
  checklist: string[]
}

export interface SymptomLog {
  id: string
  date: string
  headache: boolean
  swelling: boolean
  visionChanges: boolean
  bloodPressureSystolic: number | null
  bloodPressureDiastolic: number | null
  painLevel: number
  sleepHours: number
  mood: number
  energyLevel: number
}

export interface MoodEntry {
  date: string
  mood: number
  energy: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  safetyNote?: string
  escalationFlag?: boolean
  timestamp: string
}

export interface Appointment {
  id: string
  title: string
  doctor: string
  date: string
  time: string
  type: "checkup" | "ultrasound" | "lab" | "consultation"
  status: "upcoming" | "completed" | "cancelled"
  notes?: string
}

export interface Doctor {
  id: string
  name: string
  specialization: "OB-GYN" | "Midwife" | "Maternal-Fetal Medicine" | "Pediatrician" | "Lactation Consultant" | "Doula"
  hospital: string
  location: string
  inArea: boolean
  rating: number
  reviewCount: number
  yearsExperience: number
  availableDays: string[]
  avatarInitials: string
  bio: string
}

export interface CommunityPost {
  id: string
  channelId: string
  author: string
  isAnonymous: boolean
  content: string
  timestamp: string
  likes: number
  comments: CommunityComment[]
}

export interface CommunityComment {
  id: string
  author: string
  isAnonymous: boolean
  content: string
  timestamp: string
}

export interface CommunityChannel {
  id: string
  name: string
  description: string
  postCount: number
}

export interface StateHealthData {
  state: string
  abbreviation: string
  maternalMortality: number
  blackMaternalMortality: number
  obRatio: number
}

export interface RedFlagAlert {
  id: string
  severity: "warning" | "critical"
  message: string
  action: string
}

export interface AIResponse {
  answer: string
  safetyNote: string
  escalationFlag: boolean
}
