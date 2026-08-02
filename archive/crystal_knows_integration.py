import os
import re
import requests

CRYSTAL_API_BASE_URL = "https://api.crystalknows.com/v1"

def predict_disc_archetype_heuristics(job_title="", country="", text_bio=""):
    """
    Motor Heurístico Local (Cero costo de API) para predecir el arquetipo DISC
    basado en el rol, país y texto del prospecto o entrevistador.
    """
    title_lower = job_title.lower()
    bio_lower = text_bio.lower()
    
    # 1. Perfil D (Dominante / Ejecutivos C-Level / Ventas Asia)
    if any(k in title_lower for k in ["ceo", "cfo", "vp", "head of", "director", "founder"]) or "asia" in country.lower():
        return {
            "disc_type": "D",
            "archetype": "Dominant Executive / Captain",
            "communication_style": "Direct, results-oriented, concise.",
            "rule": "Use 45-60s short answers with oral numbering (1. First, 2. Second, 3. Third). Zero small talk.",
            "mode": "Local Heuristics Engine (Free)"
        }
        
    # 2. Perfil C (Concienzudo / CTO / IT / Engineering)
    elif any(k in title_lower for k in ["cto", "tech", "architect", "engineer", "developer", "security", "data"]):
        return {
            "disc_type": "C",
            "archetype": "Conscientious / Analyst / Specialist",
            "communication_style": "Detail-oriented, data-driven, systematic.",
            "rule": "Focus on API architecture, python pipelines, SLAs and exact technical metrics.",
            "mode": "Local Heuristics Engine (Free)"
        }

    # 3. Perfil S (Solidez / Compliance / Legal / HR)
    elif any(k in title_lower for k in ["compliance", "legal", "risk", "hr", "recruiter", "talent"]):
        return {
            "disc_type": "S",
            "archetype": "Steady / Supporter / Harmonizer",
            "communication_style": "Collaborative, reassuring, risk-averse.",
            "rule": "Highlight AML/KYC audit safety, risk reduction and smooth onboarding experience.",
            "mode": "Local Heuristics Engine (Free)"
        }
        
    # 4. Perfil I (Influencia / Marketing / Growth)
    return {
        "disc_type": "I",
        "archetype": "Influencer / Promoter",
        "communication_style": "Enthusiastic, big-picture, vision-focused.",
        "rule": "Highlight market expansion, scale, partnerships and vision.",
        "mode": "Local Heuristics Engine (Free)"
    }

def get_crystal_personality_profile(email=None, linkedin_url=None, job_title="", country="", text_bio="", api_token=None):
    """
    Consulta la API oficial si hay API Key configurada.
    De lo contrario, usa el Motor Heurístico Local 100% GRATUITO.
    """
    token = api_token or os.getenv("CRYSTAL_API_KEY")
    if token:
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        params = {}
        if linkedin_url:
            params["linkedin_url"] = linkedin_url
        elif email:
            params["email"] = email
            
        try:
            res = requests.get(f"{CRYSTAL_API_BASE_URL}/profiles", headers=headers, params=params, timeout=3)
            if res.status_code == 200:
                data = res.json()
                data["mode"] = "Crystal Knows Official API (Paid)"
                return data
        except Exception:
            pass

    # Fallback sin costo (Motor Heurístico Local)
    return predict_disc_archetype_heuristics(job_title=job_title, country=country, text_bio=text_bio)
