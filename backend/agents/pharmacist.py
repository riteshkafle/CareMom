import json
from google import genai
from google.genai import types
import sys
import os

# Add parent directory handling if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.fda_service import search_drug_label

def draft_medication_response(gemini_client, supabase, user_context: dict, query: str) -> dict:
    
    # 1. Ask Gemini to extract the Drug Name from the query
    try:
        print(f"   [Pharmacist] Extracting drug name from query using Gemini...")
        extract_prompt = "Extract the main drug or medication name from this query. Return ONLY a valid JSON object with a single 'drug_name' string key. If none, return empty string."
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=extract_prompt + "\n\nQuery: " + query,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        drug_data = json.loads(response.text)
        drug_name = drug_data.get("drug_name", "")
        print(f"   [Pharmacist] Extracted drug: '{drug_name}'")
    except Exception as e:
        print(f"   [Pharmacist] Failed to extract drug name: {e}")
        drug_name = ""

    # 2. Query openFDA for drug safety info
    fda_info_text = "No specific FDA label data found."
    if drug_name:
        fda_data = search_drug_label(drug_name)
        if fda_data:
            fda_info_text = (
                f"Source URL: {fda_data.get('source_url')}\n"
                f"Active Ingredient: {fda_data.get('active_ingredient')}\n"
                f"Pregnancy Warnings: {fda_data.get('pregnancy_warning')}\n"
                f"Boxed Warnings: {fda_data.get('boxed_warning')}\n"
                f"Specific Populations: {fda_data.get('specific_populations')}"
            )

    # 3. Vector search in supabase for Clinical Guidelines
    clinical_context_text = "No clinical guidelines found in database."
    if supabase and gemini_client:
        try:
            print(f"   [Pharmacist] Performing vector RAG search in Supabase for clinical context...")
            embedding_response = gemini_client.models.embed_content(
                model="gemini-embedding-001",
                contents=query
            )
            embedding = embedding_response.embeddings[0].values

            results = supabase.rpc(
                'match_medical_guidelines',
                {'query_embedding': embedding, 'match_threshold': 0.7, 'match_count': 3}
            ).execute()
            
            if results.data:
                print(f"   [Pharmacist] Found {len(results.data)} relevant clinical guidelines.")
                clinical_context_text = "\n".join([r['content'] for r in results.data])
            else:
                print(f"   [Pharmacist] No relevant clinical guidelines found.")
        except Exception as e:
            print(f"   [Pharmacist] RAG Error: {e}")

    # 4. Draft the pharmacist response using both FDA & Clinical contexts
    try:
        system_instruction = (
            "You are a Pharmacist Agent evaluating a drug for a pregnant patient. "
            "You have access to strict FDA Label Warnings (which may be defensive/legal text) "
            "as well as Clinical Guidelines (which offer practical medical advice). "
            "Synthesize both to provide an accurate, empathetic draft response. "
            "Crucially, refer to the patient's specific health profile to customize the guidance (e.g., highlighting allergies or trimester-specific data). "
            "DO NOT give final medical clearance; state that a doctor will review this.\n\n"
            "CRITICAL: Keep your responses extremely short and concise. Use very simple, everyday English language. Avoid medical jargon where possible.\n\n"
            "CRITICAL: If an FDA Label Data section is provided and contains a 'Source URL', you MUST include that exact URL at the very bottom of your response formatted as 'FDA Source: [URL]'. If no FDA URL was provided, do not make one up."
        )
        
        context_str = json.dumps(user_context, indent=2)
        
        prompt = (
            f"Patient Query: {query}\n\n"
            f"--- PATIENT PROFILE ---\n{context_str}\n\n"
            f"--- FDA LABEL DATA ({drug_name}) ---\n{fda_info_text}\n\n"
            f"--- CLINICAL GUIDELINES ---\n{clinical_context_text}\n\n"
            "Draft a helpful response to the patient."
        )
        
        print(f"   [Pharmacist] Drafting response using Gemini...")
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        draft = response.text
        
        print(f"   [Pharmacist] Successfully drafted response. Queueing for doctor review.")
        return {"agent": "pharmacist", "status": "queued", "message": draft}
    except Exception as e:
         return {"agent": "pharmacist", "status": "queued", "message": "I experienced an error drafting the guidelines. A doctor will respond shortly."}
