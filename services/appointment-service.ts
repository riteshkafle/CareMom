import type { Appointment, Doctor } from "@/types"
import { demoAppointments, demoDoctors } from "@/lib/data/demo-data"

const mockAppointments: Appointment[] = demoAppointments

export const mockDoctors: Doctor[] = demoDoctors

export async function mockGetAppointments(): Promise<Appointment[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockAppointments
}

export async function mockGetDoctors(): Promise<Doctor[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockDoctors
}

export async function mockBookAppointment(
  appointment: Omit<Appointment, "id" | "status">
): Promise<Appointment> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return {
    ...appointment,
    id: `apt-${Date.now()}`,
    status: "upcoming",
  }
}

export async function mockCancelAppointment(id: string): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return { success: true }
}
