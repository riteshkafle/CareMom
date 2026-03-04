import type { Appointment, ChatMessage, CommunityChannel, CommunityPost, Doctor, SymptomLog, User } from "@/types"

function toISODate(daysFromToday: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split("T")[0]
}

function toISOTimestamp(hoursFromNow: number): string {
  const date = new Date()
  date.setHours(date.getHours() + hoursFromNow)
  return date.toISOString()
}

export const demoUser: User = {
  id: "demo-user-1",
  name: "Aaliyah Johnson",
  email: "demo@nurturenest.app",
  dueDate: "2026-07-15",
  state: "Georgia",
  riskFactors: ["Hypertension history", "First pregnancy", "BMI above 30"],
  createdAt: "2026-01-08T09:00:00.000Z",
}

const symptomSeed = [
  { headache: false, swelling: false, visionChanges: false, bloodPressureSystolic: 116, bloodPressureDiastolic: 74, painLevel: 2, sleepHours: 7, mood: 4, energyLevel: 4 },
  { headache: true, swelling: false, visionChanges: false, bloodPressureSystolic: 122, bloodPressureDiastolic: 78, painLevel: 3, sleepHours: 6, mood: 3, energyLevel: 3 },
  { headache: false, swelling: false, visionChanges: false, bloodPressureSystolic: 118, bloodPressureDiastolic: 75, painLevel: 2, sleepHours: 8, mood: 4, energyLevel: 4 },
  { headache: false, swelling: true, visionChanges: false, bloodPressureSystolic: 124, bloodPressureDiastolic: 80, painLevel: 3, sleepHours: 6, mood: 3, energyLevel: 2 },
  { headache: true, swelling: true, visionChanges: false, bloodPressureSystolic: 132, bloodPressureDiastolic: 84, painLevel: 4, sleepHours: 5, mood: 3, energyLevel: 2 },
  { headache: false, swelling: false, visionChanges: false, bloodPressureSystolic: 120, bloodPressureDiastolic: 76, painLevel: 2, sleepHours: 7, mood: 4, energyLevel: 3 },
  { headache: false, swelling: false, visionChanges: false, bloodPressureSystolic: 117, bloodPressureDiastolic: 74, painLevel: 1, sleepHours: 8, mood: 5, energyLevel: 4 },
  { headache: false, swelling: false, visionChanges: false, bloodPressureSystolic: 121, bloodPressureDiastolic: 77, painLevel: 2, sleepHours: 7, mood: 4, energyLevel: 4 },
  { headache: true, swelling: false, visionChanges: false, bloodPressureSystolic: 126, bloodPressureDiastolic: 82, painLevel: 3, sleepHours: 6, mood: 3, energyLevel: 3 },
  { headache: false, swelling: false, visionChanges: false, bloodPressureSystolic: 119, bloodPressureDiastolic: 76, painLevel: 2, sleepHours: 7, mood: 4, energyLevel: 3 },
  { headache: false, swelling: false, visionChanges: false, bloodPressureSystolic: 118, bloodPressureDiastolic: 75, painLevel: 2, sleepHours: 7, mood: 4, energyLevel: 4 },
  { headache: false, swelling: true, visionChanges: false, bloodPressureSystolic: 128, bloodPressureDiastolic: 83, painLevel: 4, sleepHours: 5, mood: 3, energyLevel: 2 },
  { headache: false, swelling: false, visionChanges: false, bloodPressureSystolic: 122, bloodPressureDiastolic: 79, painLevel: 3, sleepHours: 6, mood: 3, energyLevel: 3 },
  { headache: false, swelling: false, visionChanges: false, bloodPressureSystolic: 120, bloodPressureDiastolic: 78, painLevel: 2, sleepHours: 7, mood: 4, energyLevel: 4 },
] as const

export function getDemoSymptomHistory(): SymptomLog[] {
  return symptomSeed.map((entry, index) => ({
    id: `demo-log-${index + 1}`,
    date: toISODate(-(symptomSeed.length - 1 - index)),
    ...entry,
  }))
}

export const demoAppointments: Appointment[] = [
  {
    id: "apt-1",
    title: "Prenatal Checkup",
    doctor: "Dr. Sarah Chen",
    date: toISODate(3),
    time: "10:00 AM",
    type: "checkup",
    status: "upcoming",
    notes: "Bring blood pressure readings and symptom notes.",
  },
  {
    id: "apt-2",
    title: "Anatomy Scan Follow-up",
    doctor: "Dr. Maria Rodriguez",
    date: toISODate(8),
    time: "1:30 PM",
    type: "ultrasound",
    status: "upcoming",
    notes: "Review growth percentile and placenta position.",
  },
  {
    id: "apt-3",
    title: "Gestational Diabetes Lab Panel",
    doctor: "Lab Services - MedStar",
    date: toISODate(12),
    time: "9:15 AM",
    type: "lab",
    status: "upcoming",
  },
  {
    id: "apt-4",
    title: "OB Consultation",
    doctor: "Dr. Sarah Chen",
    date: toISODate(-6),
    time: "11:00 AM",
    type: "consultation",
    status: "completed",
    notes: "Reviewed headaches and swelling trends. Continue hydration and rest plan.",
  },
  {
    id: "apt-5",
    title: "Routine Prenatal Visit",
    doctor: "Tanya Brooks, CNM",
    date: toISODate(-16),
    time: "3:00 PM",
    type: "checkup",
    status: "completed",
    notes: "Baby heart rate stable. Weight gain and BP within expected range.",
  },
]

export const demoDoctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Chen",
    specialization: "OB-GYN",
    hospital: "Howard University Hospital",
    location: "Washington, DC",
    inArea: true,
    rating: 4.9,
    reviewCount: 234,
    yearsExperience: 15,
    availableDays: ["Mon", "Tue", "Wed", "Thu"],
    avatarInitials: "SC",
    bio: "Board-certified OB-GYN focused on high-risk pregnancies and culturally responsive maternal care.",
  },
  {
    id: "doc-2",
    name: "Dr. Maria Rodriguez",
    specialization: "Maternal-Fetal Medicine",
    hospital: "MedStar Washington Hospital",
    location: "Washington, DC",
    inArea: true,
    rating: 4.8,
    reviewCount: 189,
    yearsExperience: 20,
    availableDays: ["Mon", "Wed", "Fri"],
    avatarInitials: "MR",
    bio: "Perinatologist managing complex pregnancies including gestational diabetes and preeclampsia risk.",
  },
  {
    id: "doc-3",
    name: "Dr. Angela Williams",
    specialization: "OB-GYN",
    hospital: "Providence Hospital",
    location: "Washington, DC",
    inArea: true,
    rating: 4.7,
    reviewCount: 312,
    yearsExperience: 12,
    availableDays: ["Tue", "Wed", "Thu", "Fri"],
    avatarInitials: "AW",
    bio: "Advocate for Black maternal health equity with a patient-first prenatal approach.",
  },
  {
    id: "doc-4",
    name: "Tanya Brooks, CNM",
    specialization: "Midwife",
    hospital: "BirthCare Midwifery Center",
    location: "Silver Spring, MD",
    inArea: true,
    rating: 5.0,
    reviewCount: 147,
    yearsExperience: 10,
    availableDays: ["Mon", "Tue", "Thu", "Sat"],
    avatarInitials: "TB",
    bio: "Certified nurse-midwife providing holistic prenatal, birth, and postpartum support.",
  },
  {
    id: "doc-5",
    name: "Dr. James Okafor",
    specialization: "Pediatrician",
    hospital: "Children's National Hospital",
    location: "Washington, DC",
    inArea: true,
    rating: 4.9,
    reviewCount: 410,
    yearsExperience: 18,
    availableDays: ["Mon", "Tue", "Wed", "Fri"],
    avatarInitials: "JO",
    bio: "Pediatrician preparing families for newborn care, feeding strategies, and wellness visits.",
  },
  {
    id: "doc-6",
    name: "Lisa Grant, IBCLC",
    specialization: "Lactation Consultant",
    hospital: "MomWell Clinic",
    location: "Bethesda, MD",
    inArea: true,
    rating: 4.8,
    reviewCount: 98,
    yearsExperience: 8,
    availableDays: ["Tue", "Wed", "Sat"],
    avatarInitials: "LG",
    bio: "IBCLC helping new mothers navigate latch issues, milk supply, and feeding plans.",
  },
  {
    id: "doc-7",
    name: "Dr. Priya Patel",
    specialization: "OB-GYN",
    hospital: "Johns Hopkins Hospital",
    location: "Baltimore, MD",
    inArea: false,
    rating: 4.9,
    reviewCount: 520,
    yearsExperience: 22,
    availableDays: ["Mon", "Wed", "Thu"],
    avatarInitials: "PP",
    bio: "OB-GYN specializing in prenatal diagnostics and minimally invasive procedures.",
  },
  {
    id: "doc-8",
    name: "Dr. Rachel Kim",
    specialization: "Maternal-Fetal Medicine",
    hospital: "University of Virginia Medical Center",
    location: "Charlottesville, VA",
    inArea: false,
    rating: 4.7,
    reviewCount: 176,
    yearsExperience: 14,
    availableDays: ["Tue", "Thu", "Fri"],
    avatarInitials: "RK",
    bio: "Expert in fetal imaging, genetic counseling, and high-risk pregnancy care coordination.",
  },
  {
    id: "doc-9",
    name: "Kesha Moore, CD",
    specialization: "Doula",
    hospital: "Black Mothers United",
    location: "Richmond, VA",
    inArea: false,
    rating: 5.0,
    reviewCount: 63,
    yearsExperience: 6,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    avatarInitials: "KM",
    bio: "Certified doula offering emotional and physical support through pregnancy and birth.",
  },
  {
    id: "doc-10",
    name: "Dr. David Hernandez",
    specialization: "Pediatrician",
    hospital: "INOVA Fairfax Hospital",
    location: "Fairfax, VA",
    inArea: false,
    rating: 4.6,
    reviewCount: 289,
    yearsExperience: 16,
    availableDays: ["Mon", "Wed", "Fri"],
    avatarInitials: "DH",
    bio: "Family-focused pediatrician experienced in newborn screenings and infant development.",
  },
]

export const demoCommunityPosts: CommunityPost[] = [
  {
    id: "post-1",
    channelId: "general",
    author: "MamaBear2026",
    isAnonymous: false,
    content: "Just had my 20-week anatomy scan and everything looks great! Baby is measuring right on track. So relieved!",
    timestamp: toISOTimestamp(-4),
    likes: 14,
    comments: [
      { id: "c1", author: "SunnyMom", isAnonymous: false, content: "Congrats! That's such a great milestone.", timestamp: toISOTimestamp(-3) },
      { id: "c2", author: "Anonymous", isAnonymous: true, content: "So happy for you! Mine is next week and I'm nervous.", timestamp: toISOTimestamp(-2) },
    ],
  },
  {
    id: "post-2",
    channelId: "general",
    author: "Anonymous",
    isAnonymous: true,
    content: "Anyone else managing gestational diabetes? Looking for dinner ideas that keep numbers steady.",
    timestamp: toISOTimestamp(-22),
    likes: 9,
    comments: [
      { id: "c3", author: "HealthyMama", isAnonymous: false, content: "Protein + veggie bowls have been my best friend. You’ve got this!", timestamp: toISOTimestamp(-20) },
    ],
  },
  {
    id: "post-3",
    channelId: "first-trimester",
    author: "NewMomJourney",
    isAnonymous: false,
    content: "Week 8 fatigue is intense. Does energy really come back in second trimester?",
    timestamp: toISOTimestamp(-36),
    likes: 19,
    comments: [
      { id: "c4", author: "SecondTimeMom", isAnonymous: false, content: "Yes! Around week 14 I started feeling human again.", timestamp: toISOTimestamp(-35) },
    ],
  },
  {
    id: "post-4",
    channelId: "second-trimester",
    author: "GlowAndGrow",
    isAnonymous: false,
    content: "Started feeling kicks this week and I cried happy tears 🥹",
    timestamp: toISOTimestamp(-42),
    likes: 27,
    comments: [],
  },
  {
    id: "post-5",
    channelId: "third-trimester",
    author: "Anonymous",
    isAnonymous: true,
    content: "Hospital bag checklist recommendations? I feel like I’m forgetting essentials.",
    timestamp: toISOTimestamp(-55),
    likes: 11,
    comments: [
      { id: "c5", author: "PreparedMama", isAnonymous: false, content: "Phone charger, comfy robe, snacks, and baby going-home outfit were key for me.", timestamp: toISOTimestamp(-52) },
    ],
  },
  {
    id: "post-6",
    channelId: "postpartum",
    author: "FourthTrimesterLife",
    isAnonymous: false,
    content: "Postpartum tip: set up hydration stations around your home before delivery. So helpful.",
    timestamp: toISOTimestamp(-70),
    likes: 16,
    comments: [],
  },
  {
    id: "post-7",
    channelId: "nutrition",
    author: "FitPregnancy",
    isAnonymous: false,
    content: "Morning-sickness smoothie: banana, ginger, spinach, coconut water, and chia seeds.",
    timestamp: toISOTimestamp(-80),
    likes: 22,
    comments: [
      { id: "c6", author: "Anonymous", isAnonymous: true, content: "Tried this today and it helped a lot, thank you!", timestamp: toISOTimestamp(-76) },
    ],
  },
]

export function getDemoCommunityChannels(posts: CommunityPost[] = demoCommunityPosts): CommunityChannel[] {
  const channelMeta: Omit<CommunityChannel, "postCount">[] = [
    { id: "general", name: "General", description: "General pregnancy discussions" },
    { id: "first-trimester", name: "First Trimester", description: "Weeks 1-12" },
    { id: "second-trimester", name: "Second Trimester", description: "Weeks 13-27" },
    { id: "third-trimester", name: "Third Trimester", description: "Weeks 28-40" },
    { id: "postpartum", name: "Postpartum", description: "After birth support" },
    { id: "nutrition", name: "Nutrition", description: "Diet and meal ideas" },
  ]

  return channelMeta.map((channel) => ({
    ...channel,
    postCount: posts.filter((post) => post.channelId === channel.id).length,
  }))
}

export const demoVitalsData = [
  { day: "Mon", heartRate: 78, oxygenSaturation: 98, temperature: 97.8, stressScore: 31, respirationRate: 16, sleepHours: 7.5 },
  { day: "Tue", heartRate: 82, oxygenSaturation: 97, temperature: 98.1, stressScore: 44, respirationRate: 17, sleepHours: 6.1 },
  { day: "Wed", heartRate: 76, oxygenSaturation: 99, temperature: 97.6, stressScore: 28, respirationRate: 15, sleepHours: 8.0 },
  { day: "Thu", heartRate: 85, oxygenSaturation: 97, temperature: 98.3, stressScore: 52, respirationRate: 18, sleepHours: 5.7 },
  { day: "Fri", heartRate: 79, oxygenSaturation: 98, temperature: 98.0, stressScore: 36, respirationRate: 16, sleepHours: 7.2 },
  { day: "Sat", heartRate: 74, oxygenSaturation: 99, temperature: 97.5, stressScore: 23, respirationRate: 15, sleepHours: 8.4 },
  { day: "Sun", heartRate: 77, oxygenSaturation: 98, temperature: 97.9, stressScore: 30, respirationRate: 16, sleepHours: 7.7 },
]

export const demoChatSeedMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hello! I'm your Nurture Nest health assistant. I can help answer general questions about pregnancy, symptoms, and wellness. How can I help you today?",
    safetyNote: "I provide general information only. Always consult your healthcare provider for personalized medical advice.",
    escalationFlag: false,
    timestamp: toISOTimestamp(-1),
  },
]

export const demoChatQuickPrompts = [
  "What are signs of preeclampsia?",
  "Is headache normal during pregnancy?",
  "When should I go to the ER?",
  "How can I improve sleep in third trimester?",
]
