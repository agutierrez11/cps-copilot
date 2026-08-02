import { useState, useCallback, useRef, useEffect } from 'react';
import { createClient, LiveClient } from '@deepgram/sdk';

export function useDeepgram() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const microphoneRef = useRef<MediaRecorder | null>(null);
  const deepgramRef = useRef<LiveClient | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      // 1. Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Initialize Deepgram client
      const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
      if (!apiKey) {
        throw new Error("API key de Deepgram no encontrada en las variables de entorno.");
      }

      const deepgram = createClient(apiKey);
      
      // 3. Connect to Deepgram Live WebSockets
      const connection = deepgram.listen.live({
        model: "nova-2",
        language: "es", // Spanish for StarPago
        smart_format: true,
        punctuate: true,
      });

      deepgramRef.current = connection;

      connection.on("open", () => {
        setIsListening(true);
        // 4. Start recording and sending data
        const mediaRecorder = new MediaRecorder(stream);
        microphoneRef.current = mediaRecorder;

        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        });

        mediaRecorder.start(250); // Send audio chunks every 250ms
      });

      connection.on("transcriptReceived", (message: any) => {
        const transcriptText = message?.channel?.alternatives?.[0]?.transcript;
        if (transcriptText) {
          setTranscript((prev) => {
             const newText = prev + " " + transcriptText;
             // Keep transcript from getting too long for the MVP
             return newText.length > 5000 ? newText.slice(-5000) : newText.trim();
          });
        }
      });

      connection.on("error", (error: any) => {
        console.error("Deepgram connection error:", error);
        setError("Error en la conexión con Deepgram.");
        stopListening();
      });

    } catch (err: any) {
      console.error("Error iniciando Deepgram:", err);
      setError(err.message || "Error al acceder al micrófono.");
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (microphoneRef.current) {
      microphoneRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (deepgramRef.current) {
      deepgramRef.current.finish();
    }
    setIsListening(false);
  }, []);

  return { transcript, isListening, startListening, stopListening, error, setTranscript };
}
