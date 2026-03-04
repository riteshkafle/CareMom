import type { AIResponse } from "@/types"

const responses: Record<string, AIResponse> = {
  headache: {
    answer:
      "Headaches during pregnancy can be common, especially in the first and third trimesters. They may be caused by hormonal changes, increased blood volume, or stress. Try resting in a dark room, staying hydrated, and applying a cold compress. Acetaminophen (Tylenol) is generally considered safe during pregnancy.",
    safetyNote:
      "If your headache is severe, sudden, or accompanied by vision changes, swelling, or high blood pressure, seek immediate medical attention as these could be signs of preeclampsia.",
    escalationFlag: false,
  },
  swelling: {
    answer:
      "Some swelling (edema) is normal during pregnancy, especially in the feet and ankles. This is caused by increased fluid in your body. Elevating your feet, staying active, and avoiding standing for long periods can help.",
    safetyNote:
      "Sudden or severe swelling in your face, hands, or around your eyes could indicate preeclampsia. Contact your healthcare provider immediately if you experience this.",
    escalationFlag: false,
  },
  preeclampsia: {
    answer:
      "Preeclampsia is a serious pregnancy complication characterized by high blood pressure and signs of organ damage. It usually begins after 20 weeks of pregnancy. Symptoms include severe headaches, vision changes, upper abdominal pain, nausea, and sudden swelling.",
    safetyNote:
      "This is a medical emergency. If you are experiencing these symptoms, please contact your healthcare provider or go to the emergency room immediately.",
    escalationFlag: true,
  },
  bleeding: {
    answer:
      "Any vaginal bleeding during pregnancy should be reported to your healthcare provider. While light spotting can be normal in early pregnancy, heavier bleeding can indicate complications such as miscarriage, ectopic pregnancy, or placental issues.",
    safetyNote:
      "If you are experiencing heavy bleeding, severe pain, or dizziness, call 911 or go to the emergency room immediately.",
    escalationFlag: true,
  },
  default: {
    answer:
      "Thank you for your question. While I can provide general pregnancy information, I recommend discussing specific concerns with your healthcare provider who knows your medical history. Regular prenatal care is the best way to ensure a healthy pregnancy.",
    safetyNote:
      "Always consult with your healthcare provider for personalized medical advice. This AI assistant provides general information only.",
    escalationFlag: false,
  },
}

export async function mockSendMessage(message: string): Promise<AIResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("bleeding") || lowerMessage.includes("blood")) {
    return responses.bleeding
  }
  if (lowerMessage.includes("preeclampsia") || (lowerMessage.includes("high") && lowerMessage.includes("pressure"))) {
    return responses.preeclampsia
  }
  if (lowerMessage.includes("headache") || lowerMessage.includes("head")) {
    return responses.headache
  }
  if (lowerMessage.includes("swelling") || lowerMessage.includes("swollen")) {
    return responses.swelling
  }

  return responses.default
}
