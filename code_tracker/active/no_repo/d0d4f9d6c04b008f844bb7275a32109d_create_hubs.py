�
import os

dir_path = 'Empresas_cosma'
hubs = {
    'México': 'Hub geográfico de México',
    'Brasil': 'Hub geográfico de Brasil',
    'Colombia': 'Hub geográfico de Colombia',
    'Argentina': 'Hub geográfico de Argentina',
    'Chile': 'Hub geográfico de Chile',
    'Peru': 'Hub geográfico de Perú',
    'Fintech': 'Concepto general del ecosistema Fintech',
    'Paytech': 'Vertical de Tecnología de Pagos',
    'Wealthtech': 'Vertical de Tecnología para Inversiones',
    'Insurtech': 'Vertical de Tecnología de Seguros',
    'Crédito Digital': 'Vertical de Préstamos y Crédito Online',
    'Activos Digitales': 'Vertical de Criptomonedas y Blockchain'
}

for name, desc in hubs.items():
    filename = name.lower().replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('á', 'a').replace(' ', '-') + '.md'
    path = os.path.join(dir_path, filename)
    content = f"""---
title: {name}
types: ["Hub"]
---
# {name}

{desc}
"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created Hub: {filename}")
�*cascade082efile:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/cosma_workspace/create_hubs.py