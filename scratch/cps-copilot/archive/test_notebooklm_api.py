import urllib.request
import urllib.parse
import json
import re
import time
import hashlib

cookies = {
    'SID': 'g.a000AwkD0LX49VtOXdDV2pSvqyiAhmBzcRRVyXmzKKESUOTwUoxMZ4ySxj0koYzMXilfkvi2YwACgYKATASARISFQHGX2MiW60YlZ8gDugAvkMiQ5jUiBoVAUF8yKoLmQX9Bfh93LoP5EKVJZJS0076',
    '__Secure-1PSID': 'g.a000AwkD0LX49VtOXdDV2pSvqyiAhmBzcRRVyXmzKKESUOTwUoxMPqLkTKMZCAgXk6YPc5Y17wACgYKAXMSARISFQHGX2MibOU2Qz2HUGXFcqrWQp5nbRoVAUF8yKq1EiRQDabkW7dA7VvtygIZ0076',
    '__Secure-3PSID': 'g.a000AwkD0LX49VtOXdDV2pSvqyiAhmBzcRRVyXmzKKESUOTwUoxMfN3vG7roFIeeLtC5Lfe9hQACgYKAQASARISFQHGX2Mi-u_GYEn0qnAso3VnoG6kARoVAUF8yKpMfv5ZS7jOtxKsDP801-wD0076',
    'HSID': 'AgDCYStV4Ap1NyRNr',
    'SSID': 'A3L6mszuJKbt2UAEb',
    'APISID': 'n6hFy2DFa_VCo92I/AQsHIyH97V3yPPW_P',
    'SAPISID': 'BT75RtU7V6TeBgj0/AvkUufePhmnOhKINX',
    '__Secure-1PAPISID': 'BT75RtU7V6TeBgj0/AvkUufePhmnOhKINX',
    '__Secure-3PAPISID': 'BT75RtU7V6TeBgj0/AvkUufePhmnOhKINX',
    'SIDCC': 'AKEyXzXqy2sQVbnVW6R9cd1cQWwx-Ym3c9XODRmfUdW9r7fiSHBGD-Jyg36OMfy-WPaS7Q4SxA',
    '__Secure-1PSIDTS': 'sidts-CjYBPWEu2dThSAaAGqsu-0l_QTj5AagYvSx38jNwGuV_TPBqLweusanxWt95kUIOFXXsATYzzNgQAA',
    '__Secure-3PSIDTS': 'sidts-CjYBPWEu2dThSAaAGqsu-0l_QTj5AagYvSx38jNwGuV_TPBqLweusanxWt95kUIOFXXsATYzzNgQAA',
    '__Secure-1PSIDCC': 'AKEyXzWyQy8Z4FI_0rNI24I62xr1s73v_wLW3OFxp0y0reF2RB4ww2AwUKWruJLp8fkabtRavw',
    '__Secure-3PSIDCC': 'AKEyXzX0o79ZAbYB1P_oO86R8NIOZvFcDgJ_orm-RkjhaHIXpJAfbXyHfw3jnG9meuicTYvLsms',
    'OSID': 'g.a000AwkD0P-iBJihHdIFnB4HC2RCxi813ODq-pVnd0wRDQ8l_TAMMIyzX1XcRp6m_CQG3XHc1gACgYKARASARISFQHGX2MizxaeiiIYZRb3nP0PWxGJ_xoVAUF8yKrh1t4A4Y3bR02TxtrLKTz80076',
    '__Secure-OSID': 'g.a000AwkD0P-iBJihHdIFnB4HC2RCxi813ODq-pVnd0wRDQ8l_TAMBACkf7F-2zDaAEsseS0BMAACgYKAW8SARISFQHGX2Mi4kjEkoHg7WyRYPmSspNgdxoVAUF8yKpENbQ28nMFaX4e_-ln5z9i0076',
}

cookie_str = '; '.join([f'{k}={v}' for k, v in cookies.items()])
csrf_token = 'ALX_P8v-oKSA22mGZqbsjmsPGrGf:1785455531005'
session_id = '-1558010427500811771'

# Build SAPISIDHASH for Authorization header
sapisid = cookies['SAPISID']
timestamp = str(int(time.time()))
sha_input = f'{timestamp} {sapisid} https://notebooklm.google.com'
sha256 = hashlib.sha256(sha_input.encode()).hexdigest()
auth_header = f'SAPISIDHASH {timestamp}_{sha256}'

# Notebook ID to query
notebook_id = 'df63bfca-471b-4a83-a78a-66e7f615c589'
source_path = f'/notebook/{notebook_id}'

# Build RPC payload - trying JFMDGd (list notebooks) first
rpc_data = json.dumps([[['JFMDGd', json.dumps([[1, 100]]), None, 'generic']]])
body = urllib.parse.urlencode({
    'f.req': rpc_data,
    'at': csrf_token,
})

url = f'https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute?rpcids=JFMDGd&source-path=%2F&bl=boq_labs-tailwind-frontend_20260728.14_p0&f.sid={session_id}&hl=es-419&_reqid=100000&rt=c'

req = urllib.request.Request(
    url,
    data=body.encode(),
    method='POST',
    headers={
        'Cookie': cookie_str,
        'Authorization': auth_header,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
        'Referer': 'https://notebooklm.google.com/',
        'Origin': 'https://notebooklm.google.com',
        'X-Same-Domain': '1',
    }
)

try:
    resp = urllib.request.urlopen(req, timeout=30)
    raw = resp.read().decode('utf-8', errors='ignore')
    print(f'Status: {resp.status}')
    print(f'Response length: {len(raw)}')
    print(f'First 500 chars: {raw[:500]}')
except Exception as e:
    print(f'ERROR: {e}')
