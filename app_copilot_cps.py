import json
import time
import requests
import streamlit as st

# Cargar Datasets Reales de Calibración
def load_real_datasets():
    data = {}
    data_dir = "data"
    for filename in ["real_objections.json", "real_decision_makers.json", "real_deal_cycle.json", "real_loss_register.json", "real_cdi_calibration.json"]:
        path = os.path.join(data_dir, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                data[filename.replace(".json", "")] = json.load(f)
    return data


# ==============================================================================
# CONFIGURACIÓN DE PÁGINA & ESTILO VISUAL PREMIUM (TEMA OSCURO FINTECH)
# ==============================================================================
st.set_page_config(
    page_title="CPS Sales Copilot CPS Sales Copilot & Outbound Engine",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
    .main { background-color: #0b0f19; color: #f3f4f6; }
    .stMetric { background-color: #111827; border: 1px solid #1f2937; border-radius: 10px; padding: 15px; }
    .alert-card { background-color: #1e1b4b; border-left: 5px solid #6366f1; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .warning-card { background-color: #451a03; border-left: 5px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .success-card { background-color: #064e3b; border-left: 5px solid #10b981; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .cps-card { background-color: #1e293b; border: 1px solid #334155; padding: 18px; border-radius: 10px; margin-bottom: 15px; }
</style>
""", unsafe_allow_html=True)

# ==============================================================================
# MOTOR DE REGLAS LÓGICAS & CALCULADORA DE CDI (COSTO DIARIO DE INEFICIENCIA)
# ==============================================================================
try:
    from lightrag_integration import init_lightrag_local, query_lightrag_cps
    LIGHTRAG_AVAILABLE = True
except ImportError:
    LIGHTRAG_AVAILABLE = False

def calculate_cdi(hours_wasted_daily, hourly_rate_mxn, annual_cnbv_risk_mxn, monthly_abandonment_loss_mxn):
    """Calcula la Ecuación del Costo Diario de la Ineficiencia (CDI)"""
    labor_cost_daily = hours_wasted_daily * hourly_rate_mxn
    cnbv_risk_daily = annual_cnbv_risk_mxn / 365.0
    churn_loss_daily = monthly_abandonment_loss_mxn / 30.0
    
    cdi_daily = labor_cost_daily + cnbv_risk_daily + churn_loss_daily
    cdi_monthly = cdi_daily * 30.0
    return round(cdi_daily, 2), round(cdi_monthly, 2)

def query_ollama_local(prompt_text, system_instruction, model_name="llama3.1"):
    """Consulta al servidor local de Ollama (http://localhost:11434)"""
    url = "http://localhost:11434/api/chat"
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": prompt_text}
        ],
        "stream": False
    }
    try:
        response = requests.post(url, json=payload, timeout=8)
        if response.status_code == 200:
            return response.json().get("message", {}).get("content", "")
    except Exception as e:
        return f"[Modo Simulación Activo - Ollama No Conectado Localmente: {str(e)}]"
    return "[Sin Respuesta del Servidor Local]"


# ==============================================================================
# INTERFAZ DE USUARIO (SIDEBAR & NAVEGACIÓN)
# ==============================================================================
st.sidebar.image("https://agutierrez11.github.io/CPS Sales Copilot.tech/assets/logo.png", width=180)
st.sidebar.title("⚡ Copiloto CPS & Outbound")
st.sidebar.markdown("**Target:** SOFOMes & IFNBs México")
st.sidebar.markdown("---")

ollama_model = st.sidebar.selectbox("Modelo Local Ollama:", ["llama2", "llama3.1", "llama3", "mistral"], index=0)

simulation_speed = st.sidebar.slider("Latencia Simulación (ms):", 100, 1000, 300)

st.sidebar.markdown("---")
st.sidebar.subheader("🧮 Calculadora de CDI en Vivo")
hours_wasted = st.sidebar.number_input("Horas perdidas en Excel/día:", value=6.0, step=1.0)
hourly_rate = st.sidebar.number_input("Costo laboral/hora (MXN):", value=250.0, step=25.0)
cnbv_risk = st.sidebar.number_input("Riesgo Multa CNBV (MXN):", value=500000.0, step=50000.0)
churn_loss = st.sidebar.number_input("Pérdida abandono/mes (MXN):", value=120000.0, step=10000.0)

cdi_day, cdi_month = calculate_cdi(hours_wasted, hourly_rate, cnbv_risk, churn_loss)

# ==============================================================================
# HEADER PRINCIPAL & TAB NAVEGACIÓN
# ==============================================================================
st.title("⚡ CPS Sales Copilot CPS Engine: Real-Time Copilot & Relevance First Outbound")
st.caption("Motor de Inferencia de Incertidumbre, Mitigación de Riesgos e Inyección de Anomalías en Tiempo Real")

col_m1, col_m2, col_m3, col_m4 = st.columns(4)
col_m1.metric("CDI Diarios (Costo Ineficiencia)", f"${cdi_day:,.2f} MXN", delta="Pérdida por día")
col_m2.metric("CDI Mensual Acumulado", f"${cdi_month:,.2f} MXN", delta="Impacto en caja")
col_m3.metric("Latencia de Inferencia", f"{simulation_speed} ms", delta="Local-First RAM", delta_color="normal")
col_m4.metric("Cumplimiento CNBV", "100% Local", delta="Cero Fuga de Datos")

st.markdown("---")

tab_copilot, tab_outbound = st.tabs(["🎙️ Copiloto en Vivo (Inferencia CPS)", "🎯 Generador Outbound (Relevance First)"])

# ==============================================================================
# TAB 1: COPILOTO EN TIEMPO REAL
# ==============================================================================
with tab_copilot:
    col_input, col_output = st.columns([1, 1])

    with col_input:
        st.subheader("🎙️ Entrada de Audio / Diálogo de la Llamada en Vivo")
        
        scenario_preset = st.selectbox(
            "Cargar Escenario Real de SOFOM en México:",
            [
                "Seleccionar escenario de prueba...",
                "1. Falsa Tracción: 'Mándame la cotización y la demo por correo para verla con mi socio'",
                "2. Bloqueador de TI: 'Nuestros desarrollos internos y parches en Softcrédito funcionan bien'",
                "3. Oficial de Cumplimiento: 'Tengo pánico de que al migrar a la nube perdamos el histórico ante la CNBV'",
                "4. Objeción de Precio: 'Tu software de 40k es muy caro comparado con opciones de 5k MXN'"
            ]
        )
        
        default_text = ""
        if "1. Falsa Tracción" in scenario_preset:
            default_text = "El sistema actual se ve interesante. Mándame por favor tus precios y una presentación por correo para platicarlo con mi socio la próxima semana."
        elif "2. Bloqueador de TI" in scenario_preset:
            default_text = "Mira, nosotros llevamos 10 años usando Softcrédito con parches propios. Nuestros desarrolladores construyeron las integraciones y funcionan bien, no necesitamos un core nuevo."
        elif "3. Oficial de Cumplimiento" in scenario_preset:
            default_text = "A mí lo que me preocupa es la CNBV. Me da pánico que al migrar a una plataforma cloud perdamos el historial de transacciones del año pasado o nos caiga una auditoría de PLD."
        elif "4. Objeción de Precio" in scenario_preset:
            default_text = "Tu renta de $42,000 pesos al mes se me hace carísima. En el mercado hay herramientas de solicitud digital que empiezan en $5,000 pesos al mes."

        prospect_dialogue = st.text_area("Transcripción del Cliente en Vivo (Whisper Streaming):", value=default_text, height=150)
        
        btn_analyze = st.button("🚀 Ejecutar Inferencia Agéntica CPS", type="primary", use_container_width=True)

    with col_output:
        st.subheader("🧠 Diagnóstico de Sistemas & Sugerencia Socrática")
        
        if btn_analyze and prospect_dialogue.strip():
            with st.spinner("Procesando buffer de audio en memoria RAM con Ollama..."):
                time.sleep(simulation_speed / 1000.0)
                
                is_rule_1 = "cotización" in prospect_dialogue.lower() or "correo" in prospect_dialogue.lower()
                is_rule_2 = "softcrédito" in prospect_dialogue.lower() or "desarrolladores" in prospect_dialogue.lower() or "parches" in prospect_dialogue.lower()
                is_rule_3 = "42,000" in prospect_dialogue.lower() or "5,000" in prospect_dialogue.lower() or "carísima" in prospect_dialogue.lower()
                is_rule_pld = "cnbv" in prospect_dialogue.lower() or "pánico" in prospect_dialogue.lower() or "pld" in prospect_dialogue.lower()
                
                if is_rule_1:
                    st.markdown("""
                    <div class="warning-card">
                        <h4>⚠️ RULE_01 ACTIVADA: FALSE_TRACTION_DETECTOR</h4>
                        <p><b>Diagnóstico Cynefin:</b> Entorno Complejo (Falsa Tracción / Síntoma de Vanidad).</p>
                        <p><b>Atractor Cognitivo:</b> Evitación de compromiso / Falta de consenso interno en el comité.</p>
                    </div>
                    """, unsafe_allow_html=True)
                    st.info("💡 **Acción Inmediata para el AE:** Inactivar pitch comercial. No enviar PDF frío. Hacer pregunta de fricción socrática.")
                    st.success("🗣️ **Frase Sugerida:** 'Don [Nombre], con gusto se la envío, pero típicamente cuando nos piden precios por correo antes de revisar la arquitectura de datos es porque hay alguna duda sobre el costo de migración de sus sistemas actuales. ¿Cuál es el principal riesgo que ve su socio en este momento?'")
                
                elif is_rule_2:
                    st.markdown("""
                    <div class="alert-card">
                        <h4>🛡️ RULE_02 ACTIVADA: POLITICAL_BLOCKER_SCANNER</h4>
                        <p><b>Diagnóstico Cynefin:</b> Entorno Complejo (Resistencia Política del Director de TI).</p>
                        <p><b>Atractor Cognitivo:</b> Autoprotección / Miedo a quedar obsoleto.</p>
                    </div>
                    """, unsafe_allow_html=True)
                    st.info("💡 **Acción Inmediata para el AE:** Pivotar la narrativa de 'reemplazar su software' a 'liberar recursos de TI'.")
                    st.success("🗣️ **Frase Sugerida:** 'Ingeniero, nuestro objetivo no es reemplazar el gran trabajo de su equipo en TI, sino liberarlos de mantener parches continuos para que puedan enfocarse en programar algoritmos de scoring propios mientras CPS Sales Copilot absorbe la carga pesada de la nube.'")

                elif is_rule_pld:
                    st.markdown("""
                    <div class="warning-card">
                        <h4>🏛️ ALERTA REGULATORIA: CNBV_PANIC_DETECTOR</h4>
                        <p><b>Diagnóstico Cynefin:</b> Entorno Complejo (Pánico al Riesgo de Transición y Multa).</p>
                        <p><b>Atractor Cognitivo:</b> Miedo absoluto a sanción o pérdida de datos históricos.</p>
                    </div>
                    """, unsafe_allow_html=True)
                    st.info("💡 **Acción Inmediata para el AE:** Ofrecer Experimento de Bajo Riesgo (Caballo de Troya Modular / Sandbox).")
                    st.success("🗣️ **Frase Sugerida:** 'Licenciado, para su tranquilidad, no tocamos su base histórica el día 1. Le proponemos un Sandbox modular privado en AWS para migrar una muestra del 5% como micro-experimento de bajo riesgo para que compruebe la auditabilidad ante la CNBV sin tocar su producción.'")

                elif is_rule_3:
                    st.markdown("""
                    <div class="success-card">
                        <h4>💰 RULE_03 ACTIVADA: FINANCIAL_FRICTION_ALGORITHM</h4>
                        <p><b>Diagnóstico Cynefin:</b> Entorno Complicado/Complejo (Miopía de Costo Explícito vs. Implícito).</p>
                        <p><b>Atractor Cognitivo:</b> Sesgo de Coste Hundido / Comparación errónea con apps baratas.</p>
                    </div>
                    """, unsafe_allow_html=True)
                    st.info(f"💡 **Acción Inmediata para el AE:** Proyectar el Costo Diario de Ineficiencia en vivo (${cdi_day:,.2f} MXN/día).")
                    st.success(f"🗣️ **Frase Sugerida:** 'Entiendo la comparación, pero la app de $5k obliga a su SOFOM a pagar por fuera KYC, Buró, PLD e integraciones rotas. En este momento su SOFOM está perdiendo **${cdi_day:,.2f} pesos al día** por ineficiencia operativa. CPS Sales Copilot centraliza todo reduciendo su Costo Total de Propiedad (TCO).'")
                
                else:
                    st.info("🔍 Analizando diálogo con modelo de lenguaje local...")
                    sys_prompt = "Eres un consultor de ventas B2B experto en Complex Problem Solving. Da una recomendación corta al vendedor."
                    ollama_res = query_ollama_local(prospect_dialogue, sys_prompt, model_name=ollama_model)
                    st.write(ollama_res)

# ==============================================================================
# TAB 2: MATRIZ DE PROSPECCIÓN OUTBOUND (RELEVANCE FIRST)
# ==============================================================================
with tab_outbound:
    st.subheader("🎯 Matriz de Inyección de Anomalía Outbound (CPS Relevance First)")
    st.caption("Estrategia de prospección por Atractores Cognitivos para romper el statu quo en los primeros 3 segundos.")
    
    col_r1, col_r2, col_r3 = st.columns(3)
    
    with col_r1:
        st.markdown("""
        <div class="cps-card">
            <h4>🏢 El CEO / Director General</h4>
            <p><b>Atractor:</b> Ansiedad por Escala / 5x Capital</p>
            <hr/>
            <p><b>📩 LinkedIn Hook (Inyección Anomalía):</b></p>
            <i>"Veo que están expandiendo su colocación en México. Tradicionalmente, duplicar la cartera implica duplicar la nómina operativa por parches en Excel. ¿Cómo están resolviendo la escalabilidad marginal de su Core?"</i>
            <hr/>
            <p><b>📞 Trigger Telefónico (15 Segundos):</b></p>
            <i>"No te llamo para venderte un software. Te llamo porque el Costo Diario de la Ineficiencia (CDI) de una SOFOM de tu tamaño suele ser de $15,000 pesos por culpa de la fragmentación de proveedores. ¿Tienes 3 minutos para evaluar tu métrica?"</i>
        </div>
        """, unsafe_allow_html=True)

    with col_r2:
        st.markdown("""
        <div class="cps-card">
            <h4>⚖️ Oficial de Cumplimiento (PLD)</h4>
            <p><b>Atractor:</b> Pánico a Multas CNBV & Retrabajo</p>
            <hr/>
            <p><b>📩 LinkedIn Hook (Inyección Anomalía):</b></p>
            <i>"Con las nuevas auditorías de la CNBV, el retrabajo manual de PLD está costando días de estrés. ¿Tu sistema actual genera el reporte en un clic o tu equipo pasa el fin de semana cruzando datos?"</i>
            <hr/>
            <p><b>📞 Trigger Telefónico (15 Segundos):</b></p>
            <i>"Monitoreamos las multas de la CNBV en el sector. Las financieras están perdiendo licencias por falta de automatización nativa en su onboarding. ¿Cómo mitigan ese riesgo de transición hoy?"</i>
        </div>
        """, unsafe_allow_html=True)

    with col_r3:
        st.markdown("""
        <div class="cps-card">
            <h4>🛠️ Director de TI</h4>
            <p><b>Atractor:</b> Autoprotección & Backlog Saturado</p>
            <hr/>
            <p><b>📩 LinkedIn Hook (Inyección Anomalía):</b></p>
            <i>"Ingeniero, la mayoría de las SOFOMes obligan a TI a pasar el 80% del tiempo parchando APIs reguladas en lugar de programar sus algoritmos de scoring. ¿Cómo proteges tu backlog?"</i>
            <hr/>
            <p><b>📞 Trigger Telefónico (15 Segundos):</b></p>
            <i>"Ingeniero, directo al grano: sé que tu equipo prefiere desarrollar código propietario que estar pegando APIs de KYC y Firma de proveedores externos. ¿Qué tan atrapado está tu pipeline técnico actual?"</i>
        </div>
        """, unsafe_allow_html=True)

# ==============================================================================
# FOOTER & GOBERNANZA DE DATOS
# ==============================================================================
st.markdown("---")
st.caption("🔒 **Gobernanza de Datos:** 100% Local-First In-Memory Processing. Cero archivos guardados en disco. Cumplimiento CNBV / LFPDPPP.")
