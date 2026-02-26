# Secure Deployment & Daily Study Update

## Goal
Secure the bot's credentials and expand the daily study materials to include Psalms (Tehillim), daily Chumash (Aliyah), and Rambam, following the Chabad-style study list requested by the user.

## User Review Required
> [!NOTE]
> Debido a restricciones técnicas (bloqueos de seguridad), no puedo leer directamente el sitio de Chabad.org. Sin embargo, usaré **Sefaria**, que es la fuente más fiable para obtener exactamente los mismos materiales (Jumash, Tehilím y Rambam) en español/hebreo.

## Proposed Changes

### 1. Daily Study Expansion
#### [MODIFY] [bot.py](file:///c:/Users/Antonio/.gemini/antigravity/scratch/telegram-study-bot/bot.py)
- **Tehilím (Salmos)**: Añadir lógica para calcular los Salmos del día (según el día del mes, 1-30) y proporcionar links directos a Sefaria.
- **Jumash (Aliyá)**: Actualizar la sección de Parashá para que el link lleve a la Aliyá específica del día (Ej: Domingo = 1ª Aliyá).
- **Rambam**: Integrar el estudio diario de Maimónides (1 o 3 capítulos) usando la API de Sefaria.

### 2. Security & Git (Previously Planned)
- Mantener la configuración por archivos `.env` y la inicialización de Git (ya realizada).

## Verification Plan

### Automated Tests
- Ejecutar un script de prueba que verifique que las URLs generadas para Tehilím y Jumash son válidas en Sefaria.

### Manual Verification
- Enviar un mensaje de prueba al bot para ver cómo se visualiza la "Lista de Materiales" completa en el bloque de estudio.

