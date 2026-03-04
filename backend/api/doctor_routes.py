from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/doctor", tags=["doctor"])

class ApprovalRequest(BaseModel):
    doctor_id: str
    queue_item_id: str
    approved: bool
    edited_response: Optional[str] = None

@router.get("/queue")
async def get_review_queue(doctor_id: str):
    """
    Fetches the pending items the Pharmacist Agent drafted for review.
    """
    # Implementation would require initializing supabase client
    # data = supabase.table('doctor_review_queue').select('*').eq('status', 'pending').execute()
    return {"status": "success", "data": []}

@router.post("/approve")
async def approve_response(request: ApprovalRequest):
    """
    Approves or edits an AI drafted response and sends it to the patient.
    """
    if request.approved:
        # 1. Update doctor_review_queue status to 'approved'
        # 2. Insert into chat_memory for the patient with role 'assistant'
        # 3. Trigger realtime notification to patient UI
        return {"status": "success", "message": "Response approved and sent to patient."}
    else:
        # Update queue status to 'rejected'
        return {"status": "success", "message": "Response rejected by doctor."}
