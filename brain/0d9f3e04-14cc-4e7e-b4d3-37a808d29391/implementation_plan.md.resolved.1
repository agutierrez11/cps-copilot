# Telegram Study Bot — Mejoras para Estudio Noajida

Bot de estudio diario adaptado para Bnei Noaj. Inspirado en la app Shiurim Jitas. El usuario pide oraciones (Shajarit, Minjá, Arvit), Torá, Talmud y Salmos en español.

## Proposed Changes

### 1. Rediseño de bloques de estudio

#### [MODIFY] [bot.py](file:///C:/Users/Antonio/.gemini/antigravity/scratch/telegram-study-bot/bot.py)

| Bloque | Hora | Contenido |
|---|---|---|
| 🌅 **Shajarit** | 06:12 | Modé Aní + oración matutina + Parashat HaShavúa (dinámica) + 📄 PDF |
| 📖 **Estudio** | 09:00 | Daf Yomi (dinámico) + Salmos del día |
| ☀️ **Minjá** | 13:00 | Oración de la tarde (Pág 23) + Sustento (Pág 26) + 📄 PDF |
| 🌙 **Arvit** | 19:00 | Shemá Israel + oración nocturna (Pág 28) + 📄 PDF |

**Remover**: Solo Tania (es Jasidut, no aplica a Noajida).

**Agregar**: `obtener_parasha()` usando Sefaria API para link traducido al español.

---

### 2. Fix: PDF no se entrega al presionar botón

- Agregar logging al handler `send_file_` con `key` y estado de DB
- Try/except en `send_document` con mensaje claro si falla
- Si `file_id` expiró, pedir que reenvíe el PDF

---

### 3. Fix: IA falla en Telegram

- La respuesta de Gemini con `*`, `_`, `[` rompe el Markdown de Telegram
- Sanitizar respuesta: escapar HTML especiales, convertir `**x**` → `<b>x</b>`
- Usar `parse_mode="HTML"` para IA, con fallback a texto plano

---

### 4. Prompt de IA contextualizado

```diff
- "Explica brevemente: {pregunta}"
+ "Eres un asistente de estudio para Bnei Noaj. Responde en español,
+  breve y claro. Enfócate en las 7 Leyes de Noé y Torá accesible
+  para no judíos. Pregunta: {pregunta}"
```

## Verification Plan

1. Verificar sintaxis con `python -c "import ast; ..."`
2. `/plan` → se muestran 4 bloques con contenido correcto
3. Botón PDF → entrega archivo o muestra error claro
4. Botón IA → responde sin crash
5. Bloque Shajarit → muestra Parashá dinámica de la semana
