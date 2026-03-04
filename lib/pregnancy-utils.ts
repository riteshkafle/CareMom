import { differenceInWeeks, differenceInDays, isPast } from "date-fns"

export function calculatePregnancyWeek(dueDate: string): number {
  const due = new Date(dueDate)
  const today = new Date()
  // Pregnancy is 40 weeks total, so conception is ~40 weeks before due date
  const conceptionDate = new Date(due)
  conceptionDate.setDate(conceptionDate.getDate() - 280)
  const weeks = differenceInWeeks(today, conceptionDate)
  return Math.max(1, Math.min(weeks, 42))
}

export function calculatePregnancyDay(dueDate: string): number {
  const due = new Date(dueDate)
  const conceptionDate = new Date(due)
  conceptionDate.setDate(conceptionDate.getDate() - 280)
  const days = differenceInDays(new Date(), conceptionDate)
  return Math.max(1, Math.min(days, 294))
}

export function calculateProgress(dueDate: string): number {
  const day = calculatePregnancyDay(dueDate)
  return Math.min(100, (day / 280) * 100)
}

export function isPostpartum(dueDate: string): boolean {
  return isPast(new Date(dueDate))
}

export function getTrimester(week: number): 1 | 2 | 3 {
  if (week <= 12) return 1
  if (week <= 27) return 2
  return 3
}

export function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate)
  const today = new Date()
  return Math.max(0, differenceInDays(due, today))
}
