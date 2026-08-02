import urllib.request
import json
import re

cookies = {
    'SID': 'g.a000AwkD0LX49VtOXdDV2pSvqyiAhmBzcRRVyXmzKKESUOTwUoxMZ4ySxj0koYzMXilfkvi2YwACgYKATASARISFQHGX2MiW60YlZ8gDugAvkMiQ5jUiBoVAUF8yKoLmQX9Bfh93LoP5EKVJZJS0076',
    '__Secure-1PSID': 'g.a000AwkD0LX49VtOXdDV2pSvqyiAhmBzcRRVyXmzKKESUOTwUoxMPqLkTKMZCAgXk6YPc5Y17wACgYKAXMSARISFQHGX2MibOU2Qz2HUGXFcqrWQp5nbRoVAUF8yKq1EiRQDabkW7dA7VvtygIZ0076',
    'HSID': 'AgDCYStV4Ap1NyRNr',
    'SSID': 'A3L6mszuJKbt2UAEb',
    'APISID': 'n6hFy2DFa_VCo92I/AQsHIyH97V3yPPW_P',
    'SAPISID': 'BT75RtU7V6TeBgj0/AvkUufePhmnOhKINX',
    '__Secure-1PAPISID': 'BT75RtU7V6TeBgj0/AvkUufePhmnOhKINX',
    'SIDCC': 'AKEyXzXqy2sQVbnVW6R9cd1cQWwx-Ym3c9XODRmfUdW9r7fiSHBGD-Jyg36OMfy-WPaS7Q4SxA',
    '__Secure-1PSIDTS': 'sidts-CjYBPWEu2dThSAaAGqsu-0l_QTj5AagYvSx38jNwGuV_TPBqLweusanxWt95kUIOFXXsATYzzNgQAA',
    '__Secure-1PSIDCC': 'AKEyXzWyQy8Z4FI_0rNI24I62xr1s73v_wLW3OFxp0y0reF2RB4ww2AwUKWruJLp8fkabtRavw',
    'OSID': 'g.a000AwkD0P-iBJihHdIFnB4HC2RCxi813ODq-pVnd0wRDQ8l_TAMMIyzX1XcRp6m_CQG3XHc1gACgYKARASARISFQHGX2MizxaeiiIYZRb3nP0PWxGJ_xoVAUF8yKrh1t4A4Y3bR02TxtrLKTz80076',
    '__Secure-OSID': 'g.a000AwkD0P-iBJihHdIFnB4HC2RCxi813ODq-pVnd0wRDQ8l_TAMBACkf7F-2zDaAEsseS0BMAACgYKAW8SARISFQHGX2Mi4kjEkoHg7WyRYPmSspNgdxoVAUF8yKpENbQ28nMFaX4e_-ln5z9i0076',
}

cookie_str = '; '.join([f'{k}={v}' for k, v in cookies.items()])

url = 'https://notebooklm.google.com/'
req = urllib.request.Request(url, headers={
    'Cookie': cookie_str,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
    'Referer': 'https://notebooklm.google.com/',
})

try:
    resp = urllib.request.urlopen(req, timeout=20)
    html = resp.read().decode('utf-8', errors='ignore')
    
    # Find CSRF token
    csrf_match = re.search(r'"SNlM0e":"([^"]+)"', html)
    csrf = csrf_match.group(1) if csrf_match else 'NOT_FOUND'
    
    # Find session ID (f.sid)
    sess_match = re.search(r'"FdrFJe":"([-\d]+)"', html)
    sess = sess_match.group(1) if sess_match else 'NOT_FOUND'
    
    print(f'CSRF: {csrf}')
    print(f'Session: {sess}')
    print(f'HTML length: {len(html)}')
    
    # Patch auth.json with extracted values
    if csrf != 'NOT_FOUND':
        auth_path = r'C:\Users\Antonio\.notebooklm-mcp\auth.json'
        with open(auth_path, 'r') as f:
            auth = json.load(f)
        auth['csrf_token'] = csrf
        auth['session_id'] = sess
        with open(auth_path, 'w') as f:
            json.dump(auth, f, indent=2)
        print('SUCCESS: auth.json updated with CSRF and session_id')
    else:
        print('WARNING: Could not extract CSRF from HTML. May need fresh cookies.')
        
except Exception as e:
    print(f'ERROR: {e}')
