import time
import json
from pathlib import Path

def update_auth():
    cache_path = Path(r"C:\Users\Antonio\.notebooklm-mcp\auth.json")
    
    # Using the FULL list from the user's copy-paste in Step 1243/1250
    cookies = {
        "__Secure-1PSID": "g.a0007AgD0JZISnP4H1bKPmz5B2RJpUMPQNMp4qDBhHabc230txefWXfiiR8Ok6bSp2c1XLQsyAACgYKAW8SARISFQHGX2Mi3G78Cxs8t4G9NtOvhevyzBoVAUF8yKphhx1E-ZmqQ_vBbBY94Wsb0076",
        "__Secure-3PSID": "g.a0007AgD0JZISnP4H1bKPmz5B2RJpUMPQNMp4qDBhHabc230txefNJhnD4T6YQF6bxpdcON9NAACgYKAXgSARISFQHGX2MiSa8C_cKHVpps-C5_vMxKKBoVAUF8yKpW0H-FlYE1uR0Ty1Nmpu7Z0076",
        "SID": "g.a0007AgD0JZISnP4H1bKPmz5B2RJpUMPQNMp4qDBhHabc230txefOAc9VnC7kZUtuChDoEDl5gACgYKAUMSARISFQHGX2Mi7xIEYZX9xfeixlQotvOW4BoVAUF8yKp7Mc3RQlfs7W-0AdvieEsJ0076",
        "HSID": "A2ObU1dhOxsfOiNjM",
        "SSID": "AtZUDRgajHZxyxBwh",
        "APISID": "Wr3SiBktYfWrSzJj/A4Yrhse2waLI8ynW9",
        "SAPISID": "_QiUmwcthrVapdAN/ASZLxibtRugCNiWnG",
        "__Secure-1PSIDTS": "sidts-CjcBBj1CYrH0snu3G2cOZr0bUee1BeGBlI52ip8nh_b4saH9Ukik7rG7ChDO__EYwA_Y8ZdyOYsiEAA",
        "__Secure-3PSIDTS": "sidts-CjcBBj1CYrH0snu3G2cOZr0bUee1BeGBlI52ip8nh_b4saH9Ukik7rG7ChDO__EYwA_Y8ZdyOYsiEAA",
        "SIDCC": "AKEyXzUyofLo9ABBetWSoup-miB8GHTlQaHxHT19kYnzYOt5X2oSiM3UqpIY8rHwrZPv5EPM",
        "__Secure-1PSIDCC": "AKEyXzVnGhQJF0v951_T2Z_OEYoYfXrdIZDS4rwNDi20vwNrl3iLaXLpwM5PVDGkrfiXtCfz",
        "__Secure-3PSIDCC": "AKEyXzWFFS06C4_c0OJGREeo-PAvNjDov_ijIlzbnv-tn9kkYaH4mUPTGiCn79D1nLKRcXBZ",
        "__Secure-1PSIDRTS": "sidts-CjcBBj1CYrH0snu3G2cOZr0bUee1BeGBlI52ip8nh_b4saH9Ukik7rG7ChDO__EYwA_Y8ZdyOYsiEAA",
        "__Secure-3PSIDRTS": "sidts-CjcBBj1CYrH0snu3G2cOZr0bUee1BeGBlI52ip8nh_b4saH9Ukik7rG7ChDO__EYwA_Y8ZdyOYsiEAA",
        "NID": "529=xOvy6olHHhhogrmYtyVb_RlQ_hd9m8prPGmxZEQBqebgA6TOsYA0wdroEphd4NBkDMsAtVTUDd8ZC2TTnLMlF6-uVje0ZS8SdHyItxQSOGiU5Ry-xBZlQ-r4auifC6pONkzzeLfC58YQQW0tMnr50BcciBpAvx6OQkrBtdtQP3yAJ_z-hOAZo0qc-uv0KnjxxKaqEXEH7Rwpo2N5upafrat829FpcY7xRKZ6tlkj-rByyTg0U2HjkvtJ4Xy6ejN7kBKoS1osLfrjFDxYMt_7BuxNeh_mInyObes24IWt1arOvM2xF-b7xzsdlvEzKYapWC3fgw5JirwTqxHzEBI9bdftOBNvVou2pqlcrZTcSuAp7_zZvDtP1WcLrB2KYZsBgKjxd-6prLJtnC_IVHu24jEVcpQyOa69jskT0_xP0qO6j_0hTytYcuzxC-0mkEjH0VYVcI70Lt6Gq6ptrRbxUtF-sbI3vusjKLzQNxfe9LINNL1Bw-sDJlF5Rzs5CJbY8OkBt65-8qUq9c9_aohrrOipL69AvO9Va77YrY7YfQViRI_VEwwwf1hBgvGvTTidjJNpO6cYztI12YCOQihxZdC4O4LzPpl_rHsKHnOkl-e54Rth2-0QtQuYJaIfeVP4I77_98jmR-g2CBiu5GlDZaVp-N9UeoBeQsNP3LW7thXnp9T0QCNjXlp-svkt",
        "OSID": "g.a0007AgD0E7ISCH7hNKX7q_8EE6q-ye0JxIcJmKm2hRfDW2xj8oG5chlOcqxjGzi_449lIrvAgACgYKAVwSARISFQHGX2MioMz1wM8ywC3pMR-hAaAcQRoVAUF8yKpQPeNbs0lxiSzk0RqIzt2U0076",
        "__Secure-OSID": "g.a0007AgD0E7ISCH7hNKX7q_8EE6q-ye0JxIcJmKm2hRfDW2xj8oG3k2kgB337ut-8bOwpErVlAACgYKAbASARISFQHGX2Mi1lbjZsz95JcHZLdDKZI3hxoVAUF8yKoKfrdnHpXxUchUpfu9KefM0076",
    }
    
    data = {
        "cookies": cookies,
        "csrf_token": "AIXQIkYmtGhozHDyFGAD5Lrn8FPL:1771835356317",
        "session_id": "3263897056082837503",
        "extracted_at": time.time()
    }
    
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    with open(cache_path, "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"Updated {cache_path} with FULL RECONSTRUCTED set of cookies.")

if __name__ == "__main__":
    update_auth()
