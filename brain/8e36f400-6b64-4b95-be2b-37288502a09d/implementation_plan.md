# Plan de Implementación: Gestión de PDFs Interactivos

El usuario desea integrar sus libros en PDF directamente en Telegram.

## Cambios Propuestos

### Bot Logic (`bot.py`)
- **Gestión de Archivos:** Añadir un `message_handler` para documentos que capture el `file_id` de los PDFs subidos.
- **Persistencia:** Guardar la relación entre el nombre del libro (ej: `Shuljan_Aruj.pdf`) y su `file_id` en un archivo `archivos_config.json`.
- **Interfaz:** Añadir un botón opcional "📄 Abrir PDF" en el teclado de cada bloque si el bot tiene el archivo guardado.
- **Acción:** Al pulsar "Abrir PDF", el bot enviará el archivo usando el `file_id` (operación instantánea en los servidores de Telegram).

## Verificación Plan
- Enviar un PDF llamado `Shuljan_Aruj.pdf` al bot y verificar que lo confirme.
- Usar el comando `/plan` o esperar a una alerta y verificar que aparezca el botón de PDF.
- Pulsar el botón y verificar que el bot reenvíe el archivo correctamente.
