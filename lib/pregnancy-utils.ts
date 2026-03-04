import { differenceInWeeks, differenceInDays, isPast } from "date-fns"

/**
 * All functions accept an optional `today?: Date` parameter.
 * When provided (e.g. in tests) calculations become deterministic.
 */

export function calculatePregnancyWeek(dueDate: string, today?: Date): number {
  const due = new Date(dueDate)
  const now = today ?? new Date()
  // Pregnancy is 40 weeks total, so conception is ~40 weeks before due date
  const conceptionDate = new Date(due)
  conceptionDate.setDate(conceptionDate.getDate() - 280)
  const weeks = differenceInWeeks(now, conceptionDate)
  return Math.max(1, Math.min(weeks, 42))
}

export function calculatePregnancyDay(dueDate: string, today?: Date): number {
  const due = new Date(dueDate)
  const now = today ?? new Date()
  const conceptionDate = new Date(due)
  conceptionDate.setDate(conceptionDate.getDate() - 280)
  const days = differenceInDays(now, conceptionDate)
  return Math.max(1, Math.min(days, 294))
}

export function calculateProgress(dueDate: string, today?: Date): number {
  const day = calculatePregnancyDay(dueDate, today)
  return Math.min(100, (day / 280) * 100)
}

export function isPostpartum(dueDate: string, today?: Date): boolean {
  // use a deterministic comparison when `today` is supplied
  if (today) {
    return new Date(dueDate).getTime() < today.getTime()
  }
  return isPast(new Date(dueDate))
}

export function getTrimester(week: number): 1 | 2 | 3 {
  if (week <= 12) return 1
  if (week <= 27) return 2
  return 3
}

export function getDaysUntilDue(dueDate: string, today?: Date): number {
  const due = new Date(dueDate)
  const now = today ?? new Date()
  return Math.max(0, differenceInDays(due, now))
}