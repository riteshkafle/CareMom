import os
import sys
import glob
import time
import math
from pypdf import PdfReader
from dotenv import load_dotenv

# Ensure we can import from parent directory to get Supabase/Gemini instances
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from agent_core import supabase, client

# Load env variables (in case script is run directly)
load_dotenv()

# Define the folder where PDFs live
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

def extract_text_from_pdf(file_path: str) -> str:
    """Extracts text from a single PDF file using pypdf."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    """
    Splits a large string of text into smaller chunks for vector embedding.
    Uses a simple sliding window overlap strategy to prevent cutting sentences in half.
    """
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += (chunk_size - overlap)
    return chunks

def ingest_pdfs():
    """Finds all PDFs in the data folder, chunks them, embeds them, and uploads to Supabase."""
    if not supabase or not client:
        print("Error: Supabase or Gemini client not configured. Check .env")
        return

    pdf_files = glob.glob(os.path.join(DATA_DIR, "*.pdf"))
    if not pdf_files:
        print(f"No PDFs found in {DATA_DIR}. Please add some and try again!")
        return

    print(f"Found {len(pdf_files)} PDF(s). Starting ingestion...")

    total_chunks = 0
    for pdf in pdf_files:
        filename = os.path.basename(pdf)
        print(f"\nProcessing '{filename}'...")
        
        # 1. Extract Full Text
        text = extract_text_from_pdf(pdf)
        if not text.strip():
            print(f"Warning: No readable text found in {filename}.")
            continue
            
        # 2. Chunk the text
        chunks = chunk_text(text)
        print(f"   Splitting into {len(chunks)} chunks.")
        
        # 3. Embed and Upload each chunk
        for i, chunk in enumerate(chunks):
            # We don't want to embed empty chunks
            if len(chunk.strip()) < 10:
                continue
                
            # Check if this exact chunk from this PDF already exists
            try:
                existing = supabase.table('medical_guidelines').select('id').eq('metadata->>source', filename).eq('metadata->>chunk_index', i).limit(1).execute()
                if existing.data:
                    print(f"   Skipping chunk {i} (Already exists)")
                    continue
            except Exception as e:
                print(f"   Warning checking existing chunk: {e}")
                
            retry_count = 0
            while retry_count < 3:
                try:
                    # Respect free tier rate limit: 100 requests per minute
                    # Sleeping 1 second between requests ensures we stay well under it
                    time.sleep(1)
                    
                    # Embed via Gemini
                    embedding_response = client.models.embed_content(
                        model="gemini-embedding-001",
                        contents=chunk
                    )
                    embedding = embedding_response.embeddings[0].values
                    
                    # Upload to Supabase medical_guidelines table
                    metadata = {"source": filename, "chunk_index": i}
                    
                    result = supabase.table('medical_guidelines').insert({
                        'content': chunk,
                        'metadata': metadata,
                        'embedding': embedding
                    }).execute()
                    
                    print(f"      [OK] Uploaded chunk {i+1}/{len(chunks)} of {filename}")
                    total_chunks += 1
                    break # Success, exit retry loop
                    
                except Exception as e:
                    error_str = str(e)
                    if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                        wait_time = math.pow(2, retry_count) * 15 # Wait 15s, 30s
                        print(f"   Rate limit hit. Waiting {wait_time}s before retry...")
                        time.sleep(wait_time)
                        retry_count += 1
                    else:
                        print(f"   Error embedding chunk {i} of {filename}: {e}")
                        break # Skip this chunk if it's not a rate limit issue
                        
        print(f"   Finished uploading '{filename}'.")

    print(f"\nSuccess! Uploaded a total of {total_chunks} vectorized chunks to Supabase.")

if __name__ == "__main__":
    # Ensure the data directory exists
    os.makedirs(DATA_DIR, exist_ok=True)
    ingest_pdfs()
