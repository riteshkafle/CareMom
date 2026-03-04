from pydantic import BaseModel, Field
from typing import List, Optional

class SymptomExtraction(BaseModel):
    symptoms: List[str] = Field(description="List of symptoms reported by the patient.")
    severity: int = Field(description="Severity on a scale of 1-10, based on patient description.", ge=1, le=10)
    duration_days: Optional[int] = Field(description="How long the patient has had the symptoms in days if mentioned.", default=None)

class AgentRoutingDecision(BaseModel):
    agent: str = Field(description="The assigned agent to handle the query: 'sentry', 'pharmacist', 'chronicler', or 'coach'.")
    reasoning: str = Field(description="Why this agent was chosen.")

class PharmacistDraft(BaseModel):
    recommended_response: str = Field(description="Draft response for the user about the medication/safety.")
    sources_cited: List[str] = Field(description="List of guidelines cited in the response.")
    requires_doctor_review: bool = Field(description="Whether a doctor MUST review this.", default=True)
