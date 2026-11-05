#!/usr/bin/env python3
"""Gera src/conteudo/gerado/certificados.json a partir do catálogo em ../curriculo.
Nunca copia os PDFs: eles têm dados pessoais. Só nome, emissor, data, carga e validação."""
import json, re, sys, unicodedata
from pathlib import Path

ORIGEM = Path("../curriculo/certificados/catalogo.md")
DESTINO = Path("src/conteudo/gerado/certificados.json")
AREAS = {
    "Redes": "redes",
    "Linux e sistemas operacionais": "linux",
    "DevOps, cloud e versionamento": "devops",
    "Segurança da informação": "seguranca",
    "Programação": "programacao",
    "Suporte e informática": "outros",
    "Outros": "outros",
}

def iso(data: str):
    achado = re.findall(r"(\d{2})/(\d{2})/(\d{4})", data)
    if not achado:
        return None
    d, m, a = achado[-1] if "a " in data and "emitido" not in data else achado[0]
    return f"{a}-{m}-{d}"

def carga(texto: str):
    return None if "Não informada" in texto else texto.strip()

area = None
linhas = []
for linha in ORIGEM.read_text(encoding="utf-8").splitlines():
    m = re.match(r"^## (.+)$", linha)
    if m:
        area = m.group(1)
    if not (linha.startswith("| [") and "cursos/" in linha):
        continue
    c = [x.strip() for x in linha.strip("|").split("|")]
    nome = re.match(r"\[(.+?)\]\(", c[0]).group(1)
    credencial = c[4]
    link = re.match(r"\[(.+?)\]\((https?://[^)]+)\)", credencial)
    url, codigo = None, None
    if link:
        codigo, url = link.group(1), link.group(2)
    else:
        chave = re.match(r"Chave (\w+) em (\S+)", credencial)
        if chave:
            codigo, url = chave.group(1), "https://" + chave.group(2)
        elif not credencial.startswith("Sem código"):
            codigo = credencial
    linhas.append({
        "nome": nome,
        "emissor": c[1],
        "conclusao": iso(c[2]),
        "periodo": c[2],
        "carga": carga(c[3]),
        "validacaoUrl": url,
        "codigo": codigo,
        "area": AREAS[area],
        "prioridade": c[5],
    })

if len(linhas) != 36:
    sys.exit(f"Esperava 36 cursos, encontrei {len(linhas)}")
linhas.sort(key=lambda x: (x["prioridade"], x["conclusao"] or ""), reverse=False)
ordenado = []
for p in "ABC":
    grupo = [x for x in linhas if x["prioridade"] == p]
    ordenado += sorted(grupo, key=lambda x: x["conclusao"] or "", reverse=True)
DESTINO.parent.mkdir(parents=True, exist_ok=True)
DESTINO.write_text(json.dumps(ordenado, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Certificados: {len(ordenado)}")
