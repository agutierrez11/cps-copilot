from notebooklm_mcp.api_client import extract_cookies_from_chrome_export
import json
import os

def extract_fresh_tokens():
    profile_path = r"C:\Users\Antonio\.notebooklm-mcp\chrome-profile"
    # The auth tool likely saved cookies to its internal profile.
    # We want to see if we can trigger a refresh or find where it stored the new ones.
    # For now, let's try to run the auth CLI in a non-interactive way if possible,
    # or look for a results file.
    
    print(f"Checking profile in {profile_path}")
    if os.path.exists(profile_path):
        print("Profile exists.")
    else:
        print("Profile not found.")

if __name__ == "__main__":
    extract_fresh_tokens()
