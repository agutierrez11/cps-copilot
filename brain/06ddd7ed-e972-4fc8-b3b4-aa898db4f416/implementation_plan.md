# Mejorando el `config.yml` del Ecosistema Fintech Global

Basado en la lectura del manual de Cosma y el análisis de los archivos reales, propongo actualizar `config.yml` para aprovechar las nuevas capacidades de Cosma.

## Contexto

Los archivos `.md` usan estos metadatos YAML reales:
- `title`, `Company`, `Country`, `Vertical`, `Status`
- **Sin campo `types`** — la categoría está implícita en el subdirectorio donde vive el archivo

Las categorías reales en `Empresas/` son:
`Paytech` (332), `Crédito Digital` (249), `Neobancos` (77), `Insurtech` (77), `Wealth Management` (52), `Open Finance` (26), `Crowdfunding` (25), `Regtech` (24), `PFM` (24), `Activos Digitales` (85), `BFM` (110)

> [!NOTE]
> Como las fichas no tienen campo `types`, Cosma las asignará todas a `undefined` (gris). Para tener colores por categoría, habría que agregar `type` al YAML de cada ficha — lo cual es un trabajo masivo. **Por ahora solo mejoraremos lo que funciona sin tocar los .md.**

## Cambios Propuestos

### [MODIFY] [config.yml](file:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/config.yml)

Los cambios al `config.yml` son todos seguros — solo afectan la presentación del cosmoscope, no los datos.

**Cambios a aplicar:**

| Parámetro | Valor actual | Valor nuevo | Motivo |
|-----------|-------------|-------------|--------|
| `record_metas` | (ausente) | `[Company, Country, Vertical, Status]` | Hace visibles los campos YAML existentes en cada ficha |
| `hide_id_from_record_header` | (ausente) | `true` | Oculta IDs numéricos del encabezado de fichas |
| `link_context` | (ausente) | `inline` | Backlinks siempre visibles (no solo en hover) |
| `attraction_vertical` | (ausente) | `0.1` | Acerca nodos sueltos al centro |
| `attraction_horizontal` | (ausente) | `0.05` | Suaviza la distribución horizontal |
| `node_size` | (ausente) | `8` | Nodos más pequeños para grafo denso de >3000 empresas |
| `graph_text_size` | `10` | `7` | Etiquetas más pequeñas para no saturar el grafo |
| `lang` | `en` | `en` | Sin cambio (no hay `es` disponible en Cosma) |
| `link_symbol` | (ausente) | `→` | Reemplaza IDs numéricos en texto por símbolo visual |

**Tipo de nodo `undefined` mejorado** — aunque no podemos asignar tipos automáticamente sin tocar los .md, sí podemos mejorar el color del tipo `undefined`:

```yaml
record_types:
  undefined:
    fill: "#4A90D9"    # azul fintech (en lugar del gris #858585)
    stroke: "#2E6DA4"
```

**Tipos de enlace con labels (nueva feature v2.6)**:
```yaml
link_types:
  undefined:
    stroke: simple
    color: "#6c9cbd"
    label: "relacionado con"
```

## Verificación

### Automática
```bash
# Desde c:\Users\Antonio\OneDrive\Escritorio\Ecosistema_Fintech_Global
cosma modelize
```
Cosma debe reportar el número de registros procesados sin errores.

### Manual
1. Abrir el `grafo_ecosistema.html` generado en el navegador
2. Verificar que los nodos son **azules** (no grises)
3. Click en cualquier empresa → verificar que aparecen `Company`, `Country`, `Vertical`, `Status` en el panel derecho
4. Verificar que el ID numérico **no aparece** en el encabezado de la ficha
5. Ver sección "Backlinks" → debe mostrar contexto inline (no solo en hover)
6. Comparar densidad visual con el cosmoscope anterior
