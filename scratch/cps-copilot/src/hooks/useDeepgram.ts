import { useState, useCallback, useRef } from 'react';
import { createClient, LiveClient, LiveTranscriptionEvents } from '@deepgram/sdk';

export function useDeepgram() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const microphoneRef = useRef<MediaRecorder | null>(null);
  const deepgramRef = useRef<LiveClient | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startListening = useCallback(async (sourceType: 'mic' | 'display' = 'mic') => {
    try {
      setError(null);
      
      let stream: MediaStream;
      
      if (sourceType === 'display') {
        // Captura nativa de audio de Pestaña/Sistema de Chrome (Sin necesidad de VoiceMeeter en laptops nuevas)
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          } as any
        });
        
        // Obtener el track de audio del sistema
        const audioTracks = displayStream.getAudioTracks();
        if (audioTracks.length === 0) {
          displayStream.getTracks().forEach(t => t.stop());
          throw new Error("No se seleccionó la opción de compartir audio en la ventana. Asegúrate de marcar 'Compartir audio del sistema/pestaña'.");
        }
        
        stream = new MediaStream(audioTracks);
      } else {
        // Captura estándar por micrófono o VoiceMeeter Virtual Cable
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      
      streamRef.current = stream;

      // Inicializar cliente de Deepgram
      const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
      if (!apiKey) {
        throw new Error("API key de Deepgram no encontrada en las variables de entorno.");
      }

      const deepgram = createClient(apiKey);
      
      // Conectar a WebSockets de Deepgram Nova-2 con Impulso Acústico Dialectal de LATAM
      const connection = deepgram.listen.live({
        model: "nova-2",
        language: "es-419",
        smart_format: true,
        punctuate: true,
        keywords: [
          "bacán:3",
          "teso:3",
          "parce:3",
          "culiao:3",
          "cabro chico:3",
          "po:2",
          "changarro:2",
          "lana:2",
          "luca:2",
          "chamba:2"
        ]
      });

      deepgramRef.current = connection;

      connection.on(LiveTranscriptionEvents.Open, () => {
        setIsListening(true);
        const mediaRecorder = new MediaRecorder(stream);
        microphoneRef.current = mediaRecorder;

        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        });

        mediaRecorder.start(250);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (message: any) => {
        const transcriptText = message?.channel?.alternatives?.[0]?.transcript;
        if (transcriptText) {
          setTranscript((prev) => {
             const newText = prev ? prev + " " + transcriptText : transcriptText;
             return newText.length > 5000 ? newText.slice(-5000) : newText.trim();
          });
        }
      });

      connection.on(LiveTranscriptionEvents.Error, (err) => {
        console.error("Error en conexión Deepgram:", err);
        setError("Error en el servicio de transcripción de voz.");
      });

    } catch (err: any) {
      console.error("Error al iniciar captura de audio:", err);
      setError(err.message || "No se pudo acceder a la fuente de audio.");
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (microphoneRef.current && microphoneRef.current.state !== "inactive") {
      microphoneRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (deepgramRef.current) {
      deepgramRef.current.finish();
      deepgramRef.current = null;
    }

    setIsListening(false);
  }, []);

  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    setTranscript
  };
}
