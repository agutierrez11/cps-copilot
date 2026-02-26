import os
import json
import httpx
from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens

# Force the exact BL version and language from the user's browser
os.environ["NOTEBOOKLM_BL"] = "boq_labs-tailwind-frontend_20260219.16_p2"

def test_connection():
    try:
        cached = load_cached_tokens()
        if not cached:
            print("Error: No cached tokens found.")
            return
        
        # Initialize client with manual tokens
        # We use a custom User-Agent that matches Google's expectations better
        client = NotebookLMClient(
            cookies=cached.cookies,
            csrf_token=cached.csrf_token,
            session_id=cached.session_id
        )
        
        # Override headers to match localized request
        client._get_client().headers.update({
            "Accept-Language": "es-419,es;q=0.9",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        })
        
        print(f"Connected with SID: {client._session_id}")
        print("Fetching notebooks...")
        
        # Manually call list_notebooks to handle errors better
        notebooks = client.list_notebooks(debug=True)
        
        if not notebooks:
            print("No notebooks found.")
            return
            
        print(f"SUCCESS! Found {len(notebooks)} notebooks:")
        for nb in notebooks:
            print(f"- {nb.title} (ID: {nb.id})")
            
    except Exception as e:
        print(f"Error type: {type(e)}")
        print(f"Error detail: {e}")
        if hasattr(e, 'response'):
             print(f"Response text: {e.response.text[:500]}")

if __name__ == "__main__":
    test_connection()
