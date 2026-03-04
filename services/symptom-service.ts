import type { SymptomLog, RedFlagAlert } from "@/types"
import { getDemoSymptomHistory } from "@/lib/data/demo-data"

export function checkRedFlags(log: SymptomLog, pregnancyWeek: number): RedFlagAlert[] {
  const alerts: RedFlagAlert[] = []

  if (log.headache && log.swelling && pregnancyWeek > 20) {
    alerts.push({
      id: "preeclampsia-warning",
      severity: "critical",
      message: "You reported a headache and swelling after week 20. These could be signs of preeclampsia.",
      action: "Contact your healthcare provider immediately or call 911 if symptoms are severe.",
    })
  }

  if (log.visionChanges && pregnancyWeek > 20) {
    alerts.push({
      id: "vision-warning",
      severity: "critical",
      message: "Vision changes during pregnancy can indicate high blood pressure or preeclampsia.",
      action: "Seek medical attention right away.",
    })
  }

  if (log.bloodPressureSystolic && log.bloodPressureSystolic >= 140) {
    alerts.push({
      id: "bp-high",
      severity: "critical",
      message: `Your systolic blood pressure reading of ${log.bloodPressureSystolic} is elevated.`,
      action: "Contact your healthcare provider today. If accompanied by headache or vision changes, seek emergency care.",
    })
  }

  if (log.bloodPressureDiastolic && log.bloodPressureDiastolic >= 90) {
    alerts.push({
      id: "bp-diastolic-high",
      severity: "warning",
      message: `Your diastolic blood pressure reading of ${log.bloodPressureDiastolic} is elevated.`,
      action: "Monitor closely and report to your healthcare provider.",
    })
  }

  if (log.painLevel >= 8) {
    alerts.push({
      id: "severe-pain",
      severity: "critical",
      message: "You reported severe pain (8 or above).",
      action: "Contact your healthcare provider or go to the emergency room.",
    })
  }

  if (log.sleepHours < 3) {
    alerts.push({
      id: "sleep-deprivation",
      severity: "warning",
      message: "Very low sleep can affect your health and your baby's development.",
      action: "Discuss sleep strategies with your healthcare provider.",
    })
  }

  if (log.mood <= 1) {
    alerts.push({
      id: "low-mood",
      severity: "warning",
      message: "You reported very low mood. Your mental health matters.",
      action: "Reach out to your provider about perinatal mental health support. You are not alone.",
    })
  }

  return alerts
}

export async function mockSaveSymptomLog(log: SymptomLog): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}

export async function mockGetSymptomHistory(): Promise<SymptomLog[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return getDemoSymptomHistory()
}
