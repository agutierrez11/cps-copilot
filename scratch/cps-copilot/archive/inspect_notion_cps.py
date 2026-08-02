import httpx
import json

def extract_notion_cps():
    url = "https://www.notion.so/api/v3/loadPageChunk"
    payload = {
        "pageId": "81fe17dc-15d0-4e9d-b085-cf7f747d0c16",
        "limit": 100,
        "chunkNumber": 0,
        "verticalColumns": False
    }
    headers = {"User-Agent": "Mozilla/5.0"}
    r = httpx.post(url, json=payload, headers=headers)
    data = r.json()
    
    print("RECORD MAP KEYS:", data.get("recordMap", {}).keys())
    collections = data.get("recordMap", {}).get("collection", {})
    print("Collections found:", len(collections))
    for c_id, c_val in collections.items():
        val = c_val.get("value", {})
        title = val.get("name", [["Untitled"]])[0][0]
        print(f"Collection {c_id}: Title='{title}'")
        
    # queryCollection
    if collections:
        coll_id = list(collections.keys())[0]
        views = data.get("recordMap", {}).get("collection_view", {})
        view_id = list(views.keys())[0] if views else "db3da4d9-328d-40ce-b44d-a94bb753da"
        
        print(f"\nQuerying collection {coll_id} with view {view_id}...")
        q_url = "https://www.notion.so/api/v3/queryCollection"
        q_payload = {
            "collection": {"id": coll_id},
            "collectionView": {"id": view_id},
            "loader": {
                "type": "reducer",
                "reducers": {
                    "collection_group_results": {
                        "type": "results",
                        "limit": 1000
                    }
                },
                "searchQuery": "",
                "userTimeZone": "America/Mexico_City"
            }
        }
        r2 = httpx.post(q_url, json=q_payload, headers=headers)
        q_data = r2.json()
        
        blocks = q_data.get("recordMap", {}).get("block", {})
        print(f"Total blocks returned in database query: {len(blocks)}")
        
        entries = []
        for b_id, b_val in blocks.items():
            b_type = b_val.get("value", {}).get("type")
            if b_type == "page":
                props = b_val.get("value", {}).get("properties", {})
                title = props.get("title", [["No Title"]])[0][0] if "title" in props else "No Title"
                entries.append((b_id, title))
                
        print(f"\nFound {len(entries)} CPS Notebook Articles/Pages in Notion:")
        for idx, (b_id, t) in enumerate(entries[:25], 1):
            print(f"{idx}. [{t}] (ID: {b_id})")

if __name__ == "__main__":
    extract_notion_cps()
