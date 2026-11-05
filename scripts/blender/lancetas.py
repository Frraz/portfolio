"""Três lancetas da abside: pedra com rendilhado e vidro em grade, preenchido por altura no shader."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import comum as c  # noqa: E402
import bmesh  # noqa: E402
import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402

Y = 62.0
BASE = 1.2
LARGURA = 2.0
IMPOSTA = 7.0
POSICOES = (-2.8, 0.0, 2.8)

c.limpar_cena()
bm = bmesh.new()
for x in POSICOES:
    deslocado = [Vector((x, Y, BASE)) + p for p in c.lanceta_contorno(LARGURA + 0.26, IMPOSTA, 10, 1.15)]
    c.varrer(bm, c.perfil_moldura(0.26, 0.36), deslocado, normal=Vector((0, 1, 0)))
    # Mainel central e barras de chumbo.
    c.varrer(bm, c.perfil_moldura(0.07, 0.1), [Vector((x, Y, BASE)), Vector((x, Y, BASE + IMPOSTA + 1.6))], normal=Vector((0, 1, 0)))
    for z in range(1, 7):
        c.varrer(bm, c.perfil_moldura(0.05, 0.07), [Vector((x - LARGURA / 2, Y, BASE + z * 1.15)), Vector((x + LARGURA / 2, Y, BASE + z * 1.15))], normal=Vector((1, 0, 0)))
pedra = c.objeto("pedra", bm)
pedra.data.materials.append(c.material_difuso())

c.preparar_cycles(amostras=24)
bpy.context.scene.world.light_settings.distance = 2.0
oclusao = c.assar(pedra, "ao", "AO")
# A moldura recebe pouca luz: a janela é o que importa, e fica atrás do texto.
fraca = [v * 0.4 for v in oclusao]
c.gravar_canais(pedra, fraca, oclusao, fraca)
pedra.data.materials.clear()

for i, x in enumerate(POSICOES):
    bm = bmesh.new()
    c.grade_vidro(bm, LARGURA, IMPOSTA, x, Y + 0.05, BASE, linhas=20, colunas=3, agudo=1.15)
    c.objeto(f"vidro_{i}", bm, suave=False)

c.exportar("lancetas")
