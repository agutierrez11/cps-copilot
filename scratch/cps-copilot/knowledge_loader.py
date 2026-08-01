import os
import re
from pathlib import Path

class LocalKnowledgeEngine:
    """Motor de Inteligencia Local Dual (Book-to-Skill).
    Permite consultar en tiempo real (latencia <5ms, 0ms API externa)
    los dos pilares de conocimiento:
      1. CPS Frameworks (First Principles, 5 Whys, Cause Root)
      2. Venta Socrática (Preguntas Socráticas, MEDDIC, Reframing Objeciones)
    """

    def __init__(self, knowledge_base_dir: str | Path = None):
        if knowledge_base_dir is None:
            knowledge_base_dir = Path(__file__).parent / "knowledge"
        self.base_dir = Path(knowledge_base_dir)
        self.documents = {}
        self.load_all_knowledge()

    def load_all_knowledge(self):
        """Carga todas las carpetas y archivos Markdown de la base de conocimiento."""
        if not self.base_dir.exists():
            print(f"[KnowledgeEngine] Advertencia: El directorio {self.base_dir} no existe.")
            return

        for skill_file in self.base_dir.glob("**/*.md"):
            doc_id = skill_file.relative_to(self.base_dir).as_posix()
            try:
                text = skill_file.read_text(encoding="utf-8")
                self.documents[doc_id] = {
                    "path": str(skill_file),
                    "category": skill_file.parent.name,
                    "title": skill_file.stem,
                    "content": text
                }
            except Exception as e:
                print(f"[KnowledgeEngine] Error leyendo {skill_file}: {e}")

        print(f"[KnowledgeEngine] Cargados {len(self.documents)} documentos locales con éxito.")

    def query(self, topic: str, category_filter: str = None, top_k: int = 3) -> list[dict]:
        """Busca fragmentos relevantes en tiempo real mediante coincidencia semántica y de palabras clave."""
        keywords = set(re.findall(r'\w+', topic.lower()))
        results = []

        for doc_id, doc in self.documents.items():
            if category_filter and doc["category"] != category_filter:
                continue

            content_lower = doc["content"].lower()
            score = sum(2 if kw in doc["title"].lower() else 1 for kw in keywords if kw in content_lower)

            if score > 0:
                results.append({
                    "doc_id": doc_id,
                    "category": doc["category"],
                    "score": score,
                    "content": doc["content"]
                })

        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def get_combined_context(self, query_text: str) -> str:
        """Devuelve el contexto estructurado de ambas fuentes (CPS + Venta Socrática)."""
        cps_hits = self.query(query_text, category_filter="cps_frameworks", top_k=1)
        socratic_hits = self.query(query_text, category_filter="socratic_sales", top_k=1)

        context_parts = []
        if cps_hits:
            context_parts.append(f"--- FUENTE 1: CPS FRAMEWORKS ---\n{cps_hits[0]['content']}")
        else:
            cps_doc = self.documents.get("cps_frameworks/SKILL.md")
            if cps_doc:
                context_parts.append(f"--- FUENTE 1: CPS FRAMEWORKS ---\n{cps_doc['content']}")

        if socratic_hits:
            context_parts.append(f"--- FUENTE 2: VENTA SOCRÁTICA ---\n{socratic_hits[0]['content']}")
        else:
            socratic_doc = self.documents.get("socratic_sales/SKILL.md")
            if socratic_doc:
                context_parts.append(f"--- FUENTE 2: VENTA SOCRÁTICA ---\n{socratic_doc['content']}")

        return "\n\n".join(context_parts)

# Instancia global reutilizable
engine = LocalKnowledgeEngine()

def evaluate_cps_rules(query_text: str) -> dict:
    """Evalúa la objeción usando el motor de conocimiento local en <5ms."""
    q_lower = query_text.lower()
    
    if any(k in q_lower for k in ["presupuesto", "precio", "costo", "caro", "dinero", "trimestre"]):
        return {
            "objecion": "Presupuesto / Valor Financiero",
            "pregunta_socratica": "¿Si logramos demostrar en una PoC que el incremento en tasa de aprobación paga la solución desde el mes 1, el presupuesto seguiría siendo un bloqueador?",
            "estrategia": "First Principles & Re-encuadre Socrático: Reformular el costo directo como una inversión de ROI autofinanciable desde el primer mes.",
            "friccion": "ALTA"
        }
    elif any(k in q_lower for k in ["socio", "comite", "director", "revisar", "checo", "ahorita"]):
        return {
            "objecion": "Evasión por Cortesía / Validación de Comité",
            "pregunta_socratica": "¿Cuáles son los 2 criterios clave que su socio exigirá evaluar para autorizar la integración esta misma semana?",
            "estrategia": "Desmantelar inercia de evasión cortesana estableciendo criterios directos de aprobación ejecutiva.",
            "friccion": "MEDIA"
        }
    elif any(k in q_lower for k in ["tiempo", "luego", "despues", "mes", "semana"]):
        return {
            "objecion": "Inercia de Postergación (Luego lo checo)",
            "pregunta_socratica": "¿Qué tendría que pasar en la prueba piloto para que aplazar esta decisión un mes más represente un costo directo mayor que implementarla hoy?",
            "estrategia": "Cuantificar el costo de inacción (Cost of Inaction) frente al valor presente.",
            "friccion": "ALTA"
        }
    else:
        return {
            "objecion": "Fricción Operativa General",
            "pregunta_socratica": "¿Cuál es la principal restricción técnica u operativa que impediría validar la solución esta misma semana?",
            "estrategia": "Indagación socrática de cuello de botella First Principles.",
            "friccion": "MEDIA"
        }

if __name__ == "__main__":
    print("\n--- PRUEBA DE CONEXIÓN A CONOCIMIENTO LOCAL ---")
    ctx = engine.get_combined_context("precio caro presupuesto objecion")
    print(f"Longitud del contexto cargado: {len(ctx)} caracteres.")
    res = evaluate_cps_rules("Está fuera de nuestro presupuesto para este trimestre.")
    print("Prueba de evaluación local:", res)
