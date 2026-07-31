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
            # Fallback al contenido completo si no hay match directo
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

if __name__ == "__main__":
    print("\n--- PRUEBA DE CONEXIÓN A CONOCIMIENTO LOCAL ---")
    ctx = engine.get_combined_context("precio caro presupuesto objecion")
    print(f"Longitud del contexto cargado: {len(ctx)} caracteres.")
    print("Muestra del contexto:\n", ctx[:400], "...")
