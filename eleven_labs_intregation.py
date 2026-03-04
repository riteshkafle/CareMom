from dotenv import load_dotenv
import os
import re
import base64
import requests
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

ELEVENLABS_API_KEY = os.getenv("eleven_labs_api_key")
AGENT_ID = os.getenv("eleven_labs_agent_id")


@app.route("/api/signed-url", methods=["GET"])
def get_signed_url():
    """
    Your React app calls this endpoint to get a one-time signed WebSocket URL.
    The frontend then connects directly to ElevenLabs over that WebSocket.
    """
    if not ELEVENLABS_API_KEY or not AGENT_ID:
        return jsonify({"error": "Missing API key or Agent ID in .env"}), 500

    try:
        resp = requests.get(
            f"https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id={AGENT_ID}",
            headers={"xi-api-key": ELEVENLABS_API_KEY},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        return jsonify({"signed_url": data.get("signed_url")})
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 502


@app.route("/")
def index():
    """Demo page — shows a button that opens the conversation popup."""
    return render_template("index.html")


@app.route("/conversation")
def conversation():
    """
    Full-screen conversation page. Open this as a popup or iframe from React:
      window.open('http://localhost:8000/conversation', 'ai-chat', 'width=440,height=640')
    """
    return render_template("conversation.html")



NVIDIA_INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
NVIDIA_API_KEY = os.getenv("nvidia_api_key")

MEDICINE_QUERY = """
You are a medical image analysis assistant designed to help pregnant women.

Step 1: Determine whether the uploaded image contains a medicine (e.g., tablet strip, syrup bottle, injection, prescription drug packaging).
- If the image does NOT contain medicine, clearly say: "The uploaded image does not appear to be a medicine product."

Step 2: If the image DOES contain medicine:
- Identify the medicine name (brand and/or generic name).
- State what the medicine is typically used for.
- Explain how this medicine may affect a pregnant woman.
- Clearly state whether it is generally considered:
    (a) Safe in pregnancy,
    (b) Unsafe in pregnancy, or
    (c) Requires doctor's supervision.
- Mention possible risks to the fetus if known.
- Advise consulting a licensed healthcare professional before taking it.

Important:
- If the medicine name is unclear, say that the label is not readable.
- Do not make up information if the image is blurry or incomplete.
- Keep the explanation simple and easy to understand.
- Add a disclaimer that this is not medical advice.
- Provide the final answer in only one or two short paragraphs.
"""


@app.route("/medicine-scan")
def medicine_scan():
    """Page for scanning / uploading medicine images."""
    return render_template("medicine_scan.html")


@app.route("/api/analyze-medicine", methods=["POST"])
def analyze_medicine():
    """
    Accept a base64-encoded image from the frontend, send it to the
    NVIDIA Nemotron vision model, and return the analysis text.
    """
    data = request.get_json(silent=True)
    if not data or "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    image_b64 = data["image"]  # data:image/...;base64,XXXX  or raw b64

    # If the frontend sent a data-URL, extract the mime and base64 parts
    if image_b64.startswith("data:"):
        match = re.match(r"data:(image/\w+);base64,(.*)", image_b64, re.DOTALL)
        if not match:
            return jsonify({"error": "Invalid data URL"}), 400
        mime = match.group(1)
        raw_b64 = match.group(2)
    else:
        mime = "image/jpeg"
        raw_b64 = image_b64

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    messages = [
        {"role": "system", "content": "/think"},
        {
            "role": "user",
            "content": [
                {"type": "text", "text": MEDICINE_QUERY},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{mime};base64,{raw_b64}"},
                },
            ],
        },
    ]

    payload = {
        "max_tokens": 4096,
        "temperature": 1,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "messages": messages,
        "stream": False,
        "model": "nvidia/nemotron-nano-12b-v2-vl",
    }

    try:
        resp = requests.post(
            NVIDIA_INVOKE_URL, headers=headers, json=payload, timeout=120
        )
        resp.raise_for_status()
        result = resp.json()
        content = result["choices"][0]["message"]["content"]
        # Strip <think>…</think> reasoning block if present
        content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
        return jsonify({"result": content})
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 502


if __name__ == "__main__":
    NGROK_URL = "https://inartistic-cristopher-certifiable.ngrok-free.dev"
    print(f"API Key: {'present' if ELEVENLABS_API_KEY else '✗'}")
    print(f"Agent ID: {'present' if AGENT_ID else '✗'}")
    print()
    print(f"  Demo page:        {NGROK_URL}")
    print(f"  Conversation:     {NGROK_URL}/conversation")
    print(f"  Medicine Scan:    {NGROK_URL}/medicine-scan")
    print(f"  Signed URL API:   {NGROK_URL}/api/signed-url")
    print()
    app.run(debug=True, port=8000, host="0.0.0.0")
