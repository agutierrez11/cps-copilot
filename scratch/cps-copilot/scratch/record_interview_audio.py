import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import time
import os

OUTPUT_PATH = "C:/Users/Antonio/Downloads/Entrevista_ACI_Audio.wav"
SAMPLE_RATE = 44100

print("==================================================")
print("  GRABADOR DE AUDIO AUTOMÁTICO DE ENTREVISTA (CPS) ")
print("==================================================")
print(f"[*] El audio se guardará en: {OUTPUT_PATH}")
print("[*] Grabando en segundo plano... (Presiona Ctrl+C para detener y guardar)\n")

frames = []

def callback(indata, frame_count, time_info, status):
    frames.append(indata.copy())

try:
    with sd.InputStream(samplerate=SAMPLE_RATE, channels=2, callback=callback):
        while True:
            time.sleep(1)
except KeyboardInterrupt:
    print("\n[*] Deteniendo grabación y guardando archivo...")
    if frames:
        audio_data = np.concatenate(frames, axis=0)
        wav.write(OUTPUT_PATH, SAMPLE_RATE, audio_data)
        print(f"✅ ¡GRABACIÓN GUARDADA CON ÉXITO EN:\n   {OUTPUT_PATH}")
    else:
        print("[!] No se capturaron datos de audio.")
