# ==============================================================================
# CPS Sales Copilot — PERSISTENCIA LOCAL DE SESIONES Y MÉTRICAS (SQLITE)
# ==============================================================================
import sqlite3
import os
import json
import time

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "cps_copilot.db")

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Tabla de Prospectos / Sesiones
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        institution_name TEXT,
        role TEXT,
        cdi_daily_mxn REAL,
        status TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Tabla de Log de Eventos (Sin guardar audio crudo por LFPDPPP)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS event_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        rule_triggered TEXT,
        attractor TEXT,
        question_suggested TEXT,
        user_feedback INTEGER DEFAULT 0, -- +1 Acierto / -1 Fricción
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(session_id) REFERENCES sessions(session_id)
    )
    """)
    
    conn.commit()
    conn.close()

def save_session(session_id, institution_name, role, cdi_daily_mxn=15000.0, status="ACTIVE"):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO sessions (session_id, institution_name, role, cdi_daily_mxn, status, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(session_id) DO UPDATE SET
        institution_name=excluded.institution_name,
        role=excluded.role,
        cdi_daily_mxn=excluded.cdi_daily_mxn,
        status=excluded.status,
        updated_at=CURRENT_TIMESTAMP
    """, (session_id, institution_name, role, cdi_daily_mxn, status))
    conn.commit()
    conn.close()

def log_cps_event(session_id, rule_triggered, attractor, question_suggested, feedback=0):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO event_logs (session_id, rule_triggered, attractor, question_suggested, user_feedback)
    VALUES (?, ?, ?, ?, ?)
    """, (session_id, rule_triggered, attractor, question_suggested, feedback))
    conn.commit()
    conn.close()

def get_session_history(session_id):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM event_logs WHERE session_id = ? ORDER BY timestamp DESC", (session_id,))
    rows = cursor.fetchall()
    conn.close()
    return rows

if __name__ == "__main__":
    init_db()
    print("[OK] Base de datos SQLite inicializada correctamente en:", DB_PATH)
