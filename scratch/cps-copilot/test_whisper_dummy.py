import os
import sys
from pathlib import Path
from groq import Groq

env_path = Path(".env")
if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                k, v = line.strip().split("=", 1)
                os.environ[k.strip()] = v.strip()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Create a small dummy 1-second silent WAV file header
wav_header = b'RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00'

try:
    res = client.audio.transcriptions.create(
        file=("test.wav", wav_header),
        model="whisper-large-v3-turbo",
        response_format="text"
    )
    print("WHISPER TEST SUCCESS:", res)
except Exception as e:
    print("WHISPER TEST ERROR:", type(e), e)
