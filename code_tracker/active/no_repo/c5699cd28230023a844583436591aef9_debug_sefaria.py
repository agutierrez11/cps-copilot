õimport requests

def debug_psalm(n):
    headers = {"User-Agent": "Mozilla/5.0"}
    url = f"https://www.sefaria.org/api/v2/texts/Psalms.{n}?context=0"
    print(f"Fetching: {url}")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        # print(f"Raw Text Preview: {response.text[:200]}")
        data = response.json()
        print(f"JSON Keys: {data.keys()}")
        
        versions = data.get('versions', [])
        es_v = next((v for v in versions if v.get('language') == 'es'), None)
        print(f"Spanish Version Found: {es_v is not None}")
        if es_v:
             print(f"Spanish Version Title: {es_v['versionTitle']}")
             
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_psalm(22)
    debug_psalm(52)
õ*cascade0821file:///C:/Users/Antonio/Desktop/debug_sefaria.py