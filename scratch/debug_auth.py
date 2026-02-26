from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens
import httpx
import re

def debug_refresh():
    try:
        cached = load_cached_tokens()
        if not cached:
            print("No cached tokens.")
            return
            
        cookie_header = "; ".join(f"{k}={v}" for k, v in cached.cookies.items())
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Cookie": cookie_header
        }
        
        with httpx.Client(headers=headers, follow_redirects=True) as client:
            print("Fetching homepage...")
            response = client.get("https://notebooklm.google.com/")
            print(f"Final URL: {response.url}")
            print(f"Status Code: {response.status_code}")
            
            if "accounts.google.com" in str(response.url):
                print("Redirected to login. Cookies are not being accepted.")
                # Print some headers to see if we're missing something
                print(f"Response Headers: {dict(response.headers)}")
            else:
                print("Successfully loaded homepage!")
                csrf_match = re.search(r'"SNlM0e":"([^"]+)"', response.text)
                if csrf_match:
                    print(f"Found CSRF: {csrf_match.group(1)}")
                else:
                    print("CSRF token not found in page source.")
                    with open("debug_page.html", "w", encoding="utf-8") as f:
                        f.write(response.text)
                    print("Saved page to debug_page.html")
                    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_refresh()
