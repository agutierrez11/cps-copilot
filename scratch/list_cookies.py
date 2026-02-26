import sqlite3
import os
import shutil

def extract_from_sqlite():
    db_path = r"C:\Users\Antonio\.notebooklm-mcp\chrome-profile\Default\Network\Cookies"
    temp_db = "temp_cookies.db"
    
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found")
        return

    # Check for wal file which might imply it's locked
    shutil.copy2(db_path, temp_db)
    
    try:
        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()
        # On newer Windows, cookies are encrypted, but we can at least see the names
        cursor.execute("SELECT name, value, host_key FROM cookies WHERE host_key LIKE '%google.com%'")
        rows = cursor.fetchall()
        print(f"Found {len(rows)} cookies:")
        for name, value, host in rows:
            # Note: value will likely be empty if encrypted (encrypted_value is in another column)
            print(f"  {name} ({host})")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if os.path.exists(temp_db):
            os.remove(temp_db)

if __name__ == "__main__":
    extract_from_sqlite()
