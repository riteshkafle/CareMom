import json
from google import genai
from google.genai import types

def evaluate_red_flags(client: genai.Client, query: str) -> dict:
    model_name = "gemini-2.5-flash"
    system_instruction = (
        "You are the Sentry Agent for pregnant patients. Your job is to strictly evaluate "
        "if the symptoms described require IMMEDIATE medical attention (e.g. severe bleeding, "
        "vision changes, extreme swelling, severe upper abdominal pain, decreased fetal movement). "
        "Return JSON with 'is_emergency' (boolean) and 'reason' (string)."
    )
    
    response = client.models.generate_content(
        model=model_name,
        contents=query,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json"
        )
    )
    try:
        data = json.loads(response.text)
        if data.get("is_emergency"):
            return {"agent": "sentry", "status": "alert", "message": f"EMERGENCY ALERT: {data.get('reason')}. Please seek immediate medical help."}
        else:
            return {"agent": "sentry", "status": "warning", "message": "Your symptoms have been noted. If they worsen, contact your doctor."}
    except Exception as e:
        return {"agent": "sentry", "status": "alert", "message": "Failed to parse red flags. Defaulting to alert."}
