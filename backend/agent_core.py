import os
import json
from google import genai
from google.genai import types
from supabase import create_client, Client
from dotenv import load_dotenv
from agents.pharmacist import draft_medication_response
from agents.context_manager import get_patient_profile

load_dotenv()

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL", "")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

# Note: In production, ensure these exist or handle absence gracefully
try:
    supabase: Client = create_client(supabase_url, supabase_key)
except Exception as e:
    print("Warning: Supabase credentials not fully configured.")
    supabase = None

# Initialize Gemini Client (for embeddings only)
try:
    gemini_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
except Exception as e:
    print("Warning: Gemini API Key not fully configured.")
    gemini_client = None



class Orchestrator:
    def __init__(self):
        # Using Gemini 2.5 Flash as the default lightweight routing model
        self.model_name = "gemini-2.5-flash"

    def route_query(self, user_query: str) -> str:
        """
        Evaluates the user prompt and routes to the appropriate agent.
        """
        if not gemini_client: return "coach"
        
        system_instruction = (
            "You are the master Orchestrator for a pregnancy AI Coach. "
            "Route the query to one of three agents:\n"
            "1. 'sentry': For medical emergencies or severe red flags (e.g., severe swelling, high BP, bleeding).\n"
            "2. 'pharmacist': For questions about medication safety, dosages, or drug interactions.\n"
            "3. 'coach': For general pregnancy advice, nutrition, symptom logging, and comforting chat.\n\n"
            "You MUST output ONLY a raw JSON object with the keys 'agent' (string) and 'reasoning' (string)."
        )

        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=user_query,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json"
                )
            )
            decision = json.loads(response.text)
            return decision.get("agent", "coach")
        except Exception as e:
            print(f"Routing failed, defaulting to coach: {e}")
            return "coach"

    def handle_request(self, user_id: str, user_query: str):
        """Main entry point to process a user's message."""
        # 1. Embed and store user message in chat_memory
        if gemini_client and supabase:
            embedding_response = gemini_client.models.embed_content(
                model="gemini-embedding-001",
                contents=user_query
            )
            embedding = embedding_response.embeddings[0].values
            
            # Save to Supabase
            supabase.table('chat_memory').insert({
                'user_id': user_id,
                'role': 'user',
                'content': user_query,
                'embedding': embedding
            }).execute()

        # 1.5 Fetch user context
        user_context = get_patient_profile(user_id)

        # 2. Route the query
        target_agent = self.route_query(user_query)
        print(f"[{user_id}] Routed to: {target_agent}")

        # 3. Call specific agent logic
        if target_agent == 'sentry':
            return self._run_sentry(user_context, user_query)
        elif target_agent == 'pharmacist':
            return self._run_pharmacist(user_context, user_query)
        else:
            return self._run_coach(user_context, user_id, user_query)

    def _run_sentry(self, user_context: dict, query: str):
        # Trigger urgent UI alert
        return {"status": "alert", "message": "Please seek immediate medical attention or go to the ER."}

    def _run_pharmacist(self, user_context: dict, query: str):
        # Trigger the Pharmacist Agent workflow calling the openFDA API
        return draft_medication_response(gemini_client, supabase, user_context, query)

    def _run_coach(self, user_context: dict, user_id: str, query: str):
        # General supportive AI coach
        if not gemini_client:
            def fallback(): yield "That's completely normal during the second trimester!"
            return fallback()
            
        system_instruction = (
            "You are a friendly, empathetic AI pregnancy coach. "
            "Your job is to answer general questions, offer nutritional advice, and provide emotional support. "
            "You do NOT prescribe medications or handle emergencies. "
            "CRITICAL: Keep your responses short, concise, and conversational. Use very simple, easy-to-understand English language."
        )
        
        contents = []
        
        # Load up to 10 previous messages from memory
        has_history = False
        if supabase:
            try:
                res = supabase.table('chat_memory').select('role, content').eq('user_id', user_id).order('created_at', desc=True).limit(10).execute()
                if res.data:
                    for row in reversed(res.data):
                        role = "user" if row['role'] == "user" else "model"
                        contents.append(types.Content(role=role, parts=[types.Part.from_text(text=row['content'])]))
                    has_history = True
            except Exception as e:
                print(f"   [Coach] Outputting without history, DB error: {e}")
                
        # If DB fetch failed or empty, at least append current query
        if not has_history:
            contents.append(types.Content(role="user", parts=[types.Part.from_text(text=query)]))
        
        try:
            print(f"   [Coach] Streaming response using Gemini with {'history' if has_history else 'no history'}...")
            response = gemini_client.models.generate_content_stream(
                model="gemini-2.5-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction + f"\n\nPatient Profile:\n{json.dumps(user_context, indent=2)}"
                )
            )
            
            full_response = ""
            for chunk in response:
                if chunk.text:
                    full_response += chunk.text
                    yield chunk.text
                    
            # After stream completes, save assistant response to memory
            if supabase:
                try:
                    supabase.table('chat_memory').insert({
                        'user_id': user_id,
                        'role': 'assistant',
                        'content': full_response
                    }).execute()
                except Exception as dbe:
                    print(f"   [Coach] Failed to save assistant reply to DB: {dbe}")
                
        except Exception as e:
            print(f"   [Coach] Error: {e}")
            yield "That's completely normal! I'm here for you."

if __name__ == "__main__":
    orchestrator = Orchestrator()
    # Example test call (won't run successfully without env vars)
    # print(orchestrator.handle_request("mock-uuid", "Is it safe to take Tylenol for my headache?"))
