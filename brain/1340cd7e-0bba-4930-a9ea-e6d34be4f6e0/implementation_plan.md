# Plan de Reestructuración de Jerarquía para Cosma (Script Automatizado)

Dado el gran volumen de empresas en `C:\Users\Antonio\OneDrive\Escritorio\Ecosistema_Fintech_Global`, el plan manual no es escalable. Utilizaremos un script en Python para actualizar la estructura.

## Estructura Objetivo
1. **País** (ej. `Paises/Mexico.md`)
2. **Cámara** (ej. `Camaras/Asociacion_Fintech_MX.md`)
3. **Industria/Vertical** (ej. `Industrias/Paytech.md`)
4. **Empresa** (ej. `Empresas/Albo/Albo.md`)

## Plan de Acción

### Fase 1: Consolidación de Nodos Centrales (Hubs)
- **Cámaras:** Usar los archivos existentes en la carpeta `Asociaciones/` como los Hubs principales (Asociación Fintech México, Colombia Fintech, ABFintechs Brasil, etc.).
- **Jerarquía País > Cámara:** Asegurar que los archivos de Paises apunten a estas Asociaciones.

### Fase 1.5: Expansión Masiva de la Base de Datos (+1000 Empresas)
El objetivo es lograr un mapeo TOTAL del ecosistema Latam. Para ello integraremos grandes volúmenes de datos de las siguientes fuentes:
1. **Asociaciones Locales (Ya en carpeta):** El script extraerá automáticamente a todos los miembros listados dentro de los archivos de la carpeta `Asociaciones/`.
2. **Radares Fintech y Directorios Regionales (Nuevas Fuentes):**
   - **Radares Finnovista 2024:** Cientos de startups de Chile (348), Argentina (383), Colombia (394), México y Perú.
   - **Radar Tech Startup (BuenTrip):** Mapeo de Fintechs en Ecuador.
   - **Directorios:** Directorio de Latam Fintech Hub y LAVCA Startup Directory.

Por cada empresa encontrada en estas listas masivas que falte en tu carpeta, el script **creará automáticamente una nueva carpeta y su archivo Markdown**, inyectando el País correspondiente y dejándola lista en el grafo.

### Fase 2: Procesamiento Masivo de Empresas y Obtención de Logos (Python Script)
Se creará un script en Python que procesará la carpeta `Empresas/`:
1. **Lectura YAML:** Detectará el país (`Country: [[...]]`), la vertical (`Vertical: ...`) y el nombre de la empresa (`Company: ...`).
2. **Actualización de Enlaces:** Reemplazará los enlaces directos aislados por enlaces a la vista de la Industria (ej. `[[Industrias/Paytech]]`).
3. **Obtención Automática de Logos (Clearbit API):**
    - El script utilizará una técnica ingeniosa: la [**API gratuita de Clearbit de Logos**](https://clearbit.com/logo).
    - Basado en el nombre de la empresa, el script intentará inferir su dominio web (ej. `albo` -> `albo.mx` o buscarlo en Google).
    - Alternativamente, si no tenemos los dominios, el script buscará el dominio usando el buscador, y luego inyectará la URL directamente en el `thumbnail`. Ejemplo: `thumbnail: "https://logo.clearbit.com/albo.mx"`
    - Si falla, pondrá un icono genérico según su vertical para no dejar el grafo vacío.
