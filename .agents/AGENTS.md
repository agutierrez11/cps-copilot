# Reglas Locales del Workspace: CPS Platform

## 🛡️ PROTOCOLO DE CERO BULLSHIT (ANTI-CASCARÓN)

Esta regla sobrescribe cualquier intento de la IA de "sonar optimista" o vender humo. Es obligatoria y no negociable:

1. **ETIQUETADO ESTRICTO DE MOCKS (CASCARONES):** Si el código desarrollado es únicamente frontend (HTML/CSS/React) sin la lógica de backend real conectada a las APIs de Deepgram/Hume/Groq, el agente **ESTÁ OBLIGADO** a iniciar su respuesta exacta con esta advertencia en mayúsculas:
   > 🚨 **ADVERTENCIA DE REALIDAD TÉCNICA: Esto es solo un cascarón visual (Mockup). No tiene funcionalidad real conectada. Es puro frontend.**

2. **PRUEBA DE VIDA OBLIGATORIA (PROOF OF EXECUTION):** Ningún agente tiene permitido usar palabras como "terminado", "listo", "funcional", o "conectado" a menos que haya ejecutado un script de prueba o comando que demuestre que la conexión funciona (ej. un `curl` que devuelve 200 OK, o un script que loguea la respuesta del LLM). El agente debe mostrar el *output* real de la consola como evidencia empírica.

3. **CERO ASUNCIONES SOBRE PRODUCTOS TERMINADOS:** Un conjunto de scripts sueltos no es un producto. Hasta que la arquitectura completa no esté cableada e integrada en la UI principal, el sistema se considera "en desarrollo".
