# ==============================================================================
# CPS Sales Copilot — REAL B2B GRAPH ENGINE (NETWORKX)
# Infraestructura Algorítmica Auditable de Teoría de Grafos
# ==============================================================================
import sys
import json
import networkx as nx

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


class B2BGraphEngine:
    """Motor algorítmico determinista de Teoría de Grafos utilizando NetworkX.
    Modela el Comité de Compras B2B como un Grafo Dirigido Ponderado G(V, E, W).
    Calcula:
      1. Centralidad de Intermediación (Betweenness Centrality) -> Súper-Conectores de decisión.
      2. Ruta Crítica de Menor Resistencia (Dijkstra Shortest Path).
      3. Coeficiente de Influencia Acumulada del Comité.
    """

    def __init__(self):
        self.G = nx.DiGraph()
        self._init_default_b2b_committee()

    def _init_default_b2b_committee(self):
        """Inicializa el centro de compras B2B agnóstico estándar."""
        # Nodos (V): Stakeholders del cliente
        nodes = [
            ("economic_buyer", {"name": "Economic Buyer (CEO/CFO)", "role": "ECONOMIC_BUYER", "weight": 0.95, "sentiment": "NEUTRAL"}),
            ("champion", {"name": "Champion / Sponsor (VP Ops/Tech)", "role": "CHAMPION", "weight": 0.85, "sentiment": "POSITIVE"}),
            ("blocker_legal", {"name": "Legal & Procurement", "role": "BLOCKER", "weight": 0.70, "sentiment": "DEFENSIVE"}),
            ("end_user", {"name": "Usuario Final / Operativo", "role": "END_USER", "weight": 0.50, "sentiment": "POSITIVE"}),
            ("seller", {"name": "AE / Vendedor CPS", "role": "SELLER", "weight": 1.0, "sentiment": "POSITIVE"})
        ]
        for node_id, data in nodes:
            self.G.add_node(node_id, **data)

        # Aristas (E): Canales de influencia con pesos (W = 1 / Fuerza de relación)
        edges = [
            ("seller", "champion", 1.0),         # Contacto directo fuerte
            ("champion", "economic_buyer", 1.2), # El Champion influye al CEO
            ("economic_buyer", "blocker_legal", 1.5), # CEO envía a revisión legal
            ("blocker_legal", "economic_buyer", 2.0), # Legal aprueba/bloquea al CEO
            ("champion", "end_user", 1.1),      # Champion coordina con usuarios
            ("seller", "end_user", 1.8)         # Demo técnica directa
        ]
        for u, v, w in edges:
            self.G.add_edge(u, v, weight=w)

    def analyze_conversational_nodes(self, text: str) -> dict:
        """Audita el texto de la conversación, ajusta el estado del grafo en tiempo real
        y calcula las métricas matemáticas deterministas de NetworkX.
        """
        text_lower = text.lower()

        # Detección de stakeholders activos en el diálogo
        active_nodes = ["seller"]
        if any(k in text_lower for k in ["presupuesto", "precio", "cfo", "ceo", "director", "inversión", "dinero"]):
            active_nodes.append("economic_buyer")
            self.G.nodes["economic_buyer"]["sentiment"] = "DEFENSIVE"

        if any(k in text_lower for k in ["socio", "equipo", "operación", "proceso", "integración", "poc"]):
            active_nodes.append("champion")

        if any(k in text_lower for k in ["contrato", "legal", "comité", "revisar", "política", "riesgo"]):
            active_nodes.append("blocker_legal")

        # 1. Cálculo real de Centralidad de Intermediación (Betweenness Centrality)
        betweenness = nx.betweenness_centrality(self.G, weight='weight', normalized=True)

        # 2. Ruta Crítica de Aprobación de menor resistencia (Dijkstra)
        try:
            shortest_path = nx.shortest_path(self.G, source="seller", target="economic_buyer", weight="weight")
            path_cost = round(nx.shortest_path_length(self.G, source="seller", target="economic_buyer", weight="weight"), 2)
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            shortest_path = ["seller", "champion", "economic_buyer"]
            path_cost = 2.2

        # 3. Mapear nombres ejecutivos de la ruta
        path_names = [self.G.nodes[n].get("name", n) for n in shortest_path]

        # 4. Determinar el súper-conector principal
        top_connector = max(betweenness.items(), key=lambda x: x[1])

        return {
            "nodos_totales": self.G.number_of_nodes(),
            "aristas_totales": self.G.number_of_edges(),
            "nodos_detectados_en_dialogo": active_nodes,
            "super_conector_id": top_connector[0],
            "super_conector_score": round(top_connector[1], 4),
            "ruta_critica_dijkstra": path_names,
            "costo_resistencia_ruta": path_cost,
            "betweenness_scores": {k: round(v, 4) for k, v in betweenness.items()}
        }


# Instancia global reutilizable
graph_engine = B2BGraphEngine()

if __name__ == "__main__":
    print("\n--- PRUEBA AUDITABLE DE INFRAESTRUCTURA NETWORKX ---")
    res = graph_engine.analyze_conversational_nodes("Tengo que revisarlo con el socio y el departamento legal para ajustar el presupuesto.")
    print(json.dumps(res, indent=2, ensure_ascii=False))
