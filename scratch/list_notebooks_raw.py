import httpx
import json
import urllib.parse
import os

# Definitive tokens from user
TOKEN_AT = "AIXQIkYmtGhozHDyFGAD5Lrn8FPL:1771835356317"
SESSION_ID = "3263897056082837503"
BL_VERSION = "boq_labs-tailwind-frontend_20260219.16_p2"

COOKIES = {
    "SID": "g.a0007AgD0JZISnP4H1bKPmz5B2RJpUMPQNMp4qDBhHabc230txefOAc9VnC7kZUtuChDoEDl5gACgYKAUMSARISFQHGX2Mi7xIEYZX9xfeixlQotvOW4BoVAUF8yKp7Mc3RQlfs7W-0AdvieEsJ0076",
    "__Secure-1PSID": "g.a0007AgD0JZISnP4H1bKPmz5B2RJpUMPQNMp4qDBhHabc230txefWXfiiR8Ok6bSp2c1XLQsyAACgYKAW8SARISFQHGX2Mi3G78Cxs8t4G9NtOvhevyzBoVAUF8yKphhx1E-ZmqQ_vBbBY94Wsb0076",
    "__Secure-3PSID": "g.a0007AgD0JZISnP4H1bKPmz5B2RJpUMPQNMp4qDBhHabc230txefNJhnD4T6YQF6bxpdcON9NAACgYKAXgSARISFQHGX2MiSa8C_cKHVpps-C5_vMxKKBoVAUF8yKpW0H-FlYE1uR0Ty1Nmpu7Z0076",
    "HSID": "A2ObU1dhOxsfOiNjM",
    "SSID": "AtZUDRgajHZxyxBwh",
    "APISID": "Wr3SiBktYfWrSzJj/A4Yrhse2waLI8ynW9",
    "SAPISID": "_QiUmwcthrVapdAN/ASZLxibtRugCNiWnG",
    "__Secure-1PSIDTS": "sidts-CjcBBj1CYrH0snu3G2cOZr0bUee1BeGBlI52ip8nh_b4saH9Ukik7rG7ChDO__EYwA_Y8ZdyOYsiEAA",
    "__Secure-3PSIDTS": "sidts-CjcBBj1CYrH0snu3G2cOZr0bUee1BeGBlI52ip8nh_b4saH9Ukik7rG7ChDO__EYwA_Y8ZdyOYsiEAA",
    "SIDCC": "AKEyXzUyofLo9ABBetWSoup-miB8GHTlQaHxHT19kYnzYOt5X2oSiM3UqpIY8rHwrZPv5EPM",
    "__Secure-1PSIDCC": "AKEyXzVnGhQJF0v951_T2Z_OEYoYfXrdIZDS4rwNDi20vwNrl3iLaXLpwM5PVDGkrfiXtCfz",
    "__Secure-3PSIDCC": "AKEyXzWFFS06C4_c0OJGREeo-PAvNjDov_ijIlzbnv-tn9kkYaH4mUPTGiCn79D1nLKRcXBZ",
}

def list_notebooks_raw():
    rpc_id = "wXbhsf"  # list_notebooks
    
    # Matching user's browser query params
    params = {
        "rpcids": rpc_id,
        "source-path": "/",
        "bl": BL_VERSION,
        "f.sid": SESSION_ID,
        "hl": "es-419",
        "rt": "c"
    }
    
    url = f"https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute?{urllib.parse.urlencode(params)}"
    
    # Matching user's browser payload format
    f_req = [[[rpc_id, "[null,1,null,[2]]", None, "generic"]]]
    body = f"f.req={urllib.parse.quote(json.dumps(f_req, separators=(',', ':')), safe='')}&at={urllib.parse.quote(TOKEN_AT, safe='')}&"
    
    # Matching user's browser headers exactly
    headers = {
        "Accept": "*/*",
        "Accept-Language": "es-419,es;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Origin": "https://notebooklm.google.com",
        "Referer": "https://notebooklm.google.com/",
        "Sec-Ch-Ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "X-Goog-Authuser": "0",
        "X-Same-Domain": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Cookie": "; ".join(f"{k}={v}" for k, v in COOKIES.items())
    }
    
    print(f"Requesting URL: {url}")
    
    with httpx.Client(headers=headers) as client:
        response = client.post(url, content=body)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Error Body: {response.text[:500]}")
            return

        text = response.text
        if text.startswith(")]}'"):
            text = text[4:]
        
        print("Response received. Parsing...")
        # Simple extraction for verification
        if "wrb.fr" in text:
            print("SUCCESS! Data found in response.")
            with open("notebooks_raw.json", "w", encoding="utf-8") as f:
                f.write(text)
            print("Full response saved to notebooks_raw.json")
        else:
            print("Response does not contain expected RPC markers.")
            print(f"Response start: {text[:500]}")

if __name__ == "__main__":
    list_notebooks_raw()
