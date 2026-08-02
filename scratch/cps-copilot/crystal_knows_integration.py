import os
import requests

CRYSTAL_API_BASE_URL = "https://api.crystalknows.com/v1"

def get_crystal_personality_profile(email=None, linkedin_url=None, api_token=None):
    """
    Consulta la API de Crystal Knows (https://docs.crystalknows.com/developers/crystal-api)
    para obtener el arquetipo de personalidad DISC (Dominance, Influence, Steadiness, Conscientiousness).
    """
    token = api_token or os.getenv("CRYSTAL_API_KEY")
    if not token:
        return {"status": "simulated", "disc_type": "D", "archetype": "Captain / Dominant Executive", "recommendation": "Use 45-60s concise structured answers with oral numbering."}
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    params = {}
    if linkedin_url:
        params["linkedin_url"] = linkedin_url
    elif email:
        params["email"] = email
        
    try:
        res = requests.get(f"{CRYSTAL_API_BASE_URL}/profiles", headers=headers, params=params, timeout=5)
        if res.status_code == 200:
            return res.json()
    except Exception as e:
        pass
    
    return {"status": "fallback", "disc_type": "D", "archetype": "Dominant Executive", "recommendation": "Direct, structured, number-driven pitch."}
