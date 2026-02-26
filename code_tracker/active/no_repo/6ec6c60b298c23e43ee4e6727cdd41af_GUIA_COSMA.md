�	---
description: Metodología recomendada para la creación de grafos con Cosma
---

# Flujo de Trabajo Maestro - Cosma

Para mantener tus grafos actualizados y precisos, sigue este procedimiento estándar:

## 1. Configuración (`cosma.yml`)
Cada vault u carpeta de proyecto debe tener su propio archivo `cosma.yml` en la raíz. Esto le dice a Cosma qué incluir y qué ignorar.

```yaml
project:
  name: "Nombre del Proyecto"
entry: .
exclude:
  - .obsidian
  - .git
```

## 2. Modelado de Datos
Antes de visualizar, Cosma debe "entender" las conexiones. Ejecuta esto siempre que añadas notas nuevas o cambies enlaces `[[enlaces]]`:

```powershell
cosma modelize
```
*Tip: Ejecútalo desde la carpeta raíz del proyecto.*

## 3. Exportación Interactiva
Genera el archivo HTML que puedes abrir en cualquier navegador:

```powershell
cosma export --output nombre_del_grafo.html
```

## 4. Mejores Prácticas
- **Consistencia de Enlaces**: Usa siempre el formato `[[Nombre de la Nota]]`.
- **Limpieza**: Evita enlaces "fantasmas" (enlaces a notas que no existen) para un grafo más limpio.
- **Automatización**: Podemos crear un script `.ps1` que haga el modelado y la exportación en un solo clic.
�	*cascade082Tfile:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/GUIA_COSMA.md