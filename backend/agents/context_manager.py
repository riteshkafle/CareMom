# Mock Context Manager
# In a real application, this would fetch data from the `pregnancy_profiles` and `symptom_logs` Supabase tables.

def get_patient_profile(user_id: str) -> dict:
    """
    Returns a mock patient health profile for demo purposes.
    """
    print(f"   [ContextManager] Fetching health profile for user {user_id}...")
    
    # Hardcoded mock profile for Aliyah Johnson
    mock_profile = {
        "personal_info": {
            "name": "Aliyah Johnson",
            "age": 29
        },
        "pregnancy_details": {
            "trimester": "Second Trimester",
            "gestational_age_weeks": 24,
            "expected_due_date": "2026-06-12"
        },
        "medical_history": {
            "pre_existing_conditions": ["Mild asthma (well-controlled)"],
            "pregnancy_complications": ["None currently"],
            "allergies": ["Penicillin", "Latex text"],
            "current_medications": ["Prenatal vitamins", "Albuterol inhaler (as needed)"]
        },
        "recent_vitals": {
            "blood_pressure": "115/75",
            "weight_gain_lbs": 14
        }
    }
    
    print(f"   [ContextManager] Successfully retrieved profile for {mock_profile['personal_info']['name']}.")
    return mock_profile
