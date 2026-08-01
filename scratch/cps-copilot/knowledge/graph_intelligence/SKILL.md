---
name: graph-relationship-intelligence
description: Algoritmos de Teoría de Grafos (NetworkX y Graphology) para minería de relaciones B2B, detección de puentes cálidos de introducción, centralidad de intermediación y clústeres comunitarios (Louvain/Dijkstra).
---

# 🕸️ Graph Relationship Intelligence (Teoría de Grafos B2B)

Esta skill define la arquitectura matemática y algorítmica para transformar redes de contactos en **Grafos de Inteligencia Comercial** utilizando **NetworkX** (Python) y **Graphology** (JavaScript).

---

## 📐 Algoritmo 1: Puente Cálido (Shortest Path / Dijkstra)

Dado un comercial $S$ (Source) y un contacto objetivo $T$ (Target):
1. Representar la red como un grafo ponderado $G = (V, E, W)$.
2. Peso de arista $W(u, v) = \frac{1}{\text{Fuerza de relación (Mensajes, Recencia, Jerarquía)}}$.
3. Ejecutar Dijkstra para encontrar el camino de menor resistencia:
   ```python
   import networkx as nx

   def find_warm_bridge(G, source, target_company):
       paths = []
       for target in get_company_employees(G, target_company):
           if nx.has_path(G, source, target):
               path = nx.shortest_path(G, source=source, target=target, weight='weight')
               length = nx.shortest_path_length(G, source=source, target=target, weight='weight')
               paths.append((length, path))
       paths.sort(key=lambda x: x[0])
       return paths[0] if paths else None
   ```

---

## 👑 Algoritmo 2: Súper-Conectores (Betweenness & Degree Centrality)

Identifica a las personas en la red con el mayor número de conexiones intermedias hacia decisiones de compra:
```python
def compute_super_connectors(G):
    betweenness = nx.betweenness_centrality(G, normalized=True)
    degree = nx.degree_centrality(G)
    
    super_connectors = {}
    for node in G.nodes():
        score = (betweenness[node] * 0.6) + (degree[node] * 0.4)
        super_connectors[node] = score
    return sorted(super_connectors.items(), key=lambda x: x[1], reverse=True)
```

---

## 🏢 Algoritmo 3: Clústeres de Confianza (Louvain Community Detection)

Detecta comunidades naturales de ex-colegas (ej. "Ex-Clip", "Ex-Kavak", "Ex-Mercado Libre") para propagación de ventas:
```python
import networkx.algorithms.community as community

def detect_alumni_clusters(G):
    communities = community.louvain_communities(G, weight='weight')
    return communities
```

---

## 📊 Integración Frontend (Graphology JS)

Renderizado y filtrado dinámico en el navegador sin servidor:
```javascript
import graphology from 'graphology';
import { shortestPath } from 'graphology-shortest-path';

const graph = new graphology.Graph();
// Agregar nodos y aristas...
const path = shortestPath.bidirectional(graph, userNodeId, targetNodeId);
```
