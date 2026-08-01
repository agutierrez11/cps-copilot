import os
import sys
from pathlib import Path
from groq import Groq

# Load .env
env_path = Path(".env")
if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                k, v = line.strip().split("=", 1)
                os.environ[k.strip()] = v.strip()

key = os.environ.get("GROQ_API_KEY")
print("GROQ KEY PRESENT:", bool(key))
client = Groq(api_key=key)

models = client.models.list()
print("MODELS COUNT:", len(models.data))
whisper_models = [m.id for m in models.data if "whisper" in m.id]
print("WHISPER MODELS AVAILABLE:", whisper_models)
