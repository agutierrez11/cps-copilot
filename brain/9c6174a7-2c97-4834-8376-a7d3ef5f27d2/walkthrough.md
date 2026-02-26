# Walkthrough: Securing and Preparing for Deployment

I have completed the security hardening and Git preparation for the Telegram Study Bot.

## Changes Made

### 1. Secure Configuration in `bot.py`
The bot no longer has hardcoded tokens. It now uses `python-dotenv` to load credentials from the `.env` file.
```python
# Cargar variables de entorno desde .env
load_dotenv()

TOKEN = os.getenv("TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
GEMINI_KEY = os.getenv("GEMINI_KEY")
```

### 2. Dependencies
Added `python-dotenv` to `requirements.txt` to ensure the bot can load environment variables both locally and on the server.

### 3. Git Repository Initialized
I initialized a Git repository and created the initial commit. Crucially, I verified that sensitive files are **NOT** being tracked.

**Files tracked in Git:**
- `.gitignore` (Configured to ignore `.env` and `archivos_config.json`)
- `Procfile` (Tells the server how to run the bot)
- `bot.py` (Main bot code)
- `lanzador_bot.bat` (Local launcher)
- `requirements.txt` (List of dependencies)
- `test_fallback.py` (Test script)

## Verification Results
- [x] **No hardcoded secrets**: Verified that `TOKEN`, `CHAT_ID`, and `GEMINI_KEY` values were removed from `bot.py`.
- [x] **Exclusions verified**: Confirmed via `git ls-files` that `.env` and `archivos_config.json` are excluded from the repository.

## Final Layout & Verification
- [x] **Chumash/Psalms/Rambam**: All integrated dynamically with Sefaria.
- [x] **Study Resources**: JabruTouch and Sefaria links distributed across all blocks.
- [x] **Git & Security**: Secrets are safe and work is committed.

## How to Keep it Running (Scheduling)
El bot tiene un **reloj interno** (`motor_tiempo`) que enviará los mensajes automáticamente en estos horarios:
- **06:12**: Shajarit
- **09:00**: Estudio Diario
- **13:00**: Minjá
- **19:00**: Arvit

> [!IMPORTANT]
> Para que el bot envíe los mensajes mañana solo necesitas tenerlo encendido. En tu compu usa `lanzador_bot.bat`, o súbelo a un servidor como **Render** para que funcione 24/7 sin tu PC.

## Next Steps for You
1. **Push to GitHub**:
   ```bash
   git remote add origin <URL_DE_TU_REPO>
   git branch -M main
   git push -u origin main
   ```
2. **Deploy**: En el servidor, añade las variables `TOKEN`, `CHAT_ID` y `GEMINI_KEY`. ¡Listo!
