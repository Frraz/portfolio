"""Nave gótica: pilares, arcadas, trifório e nervuras, aberta para a chuva. Sem paredes nem abóbada cheia.

Eixo: o portal fica em y < 0 e a abside em y > 0. O glTF converte y do Blender em -z do three.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import comum as c  # noqa: E402
import bmesh  # noqa: E402
import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402

VAOS = 12
VAO = 5.0
MEIA_NAVE = 4.2
ALTURA_PILAR = 8.0
ALTURA_TRIFORIO = 12.2
ALTURA_ABOBADA = 15.6

c.limpar_cena()
bm = bmesh.new()

perfil_arco = c.perfil_moldura(0.5, 0.55)
perfil_arco_int = c.perfil_moldura(0.26, 0.3)
perfil_nervura = c.perfil_moldura(0.22, 0.3)

for i in range(VAOS + 1):
    y = i * VAO
    for lado in (-1, 1):
        x = lado * MEIA_NAVE
        c.pilar(bm, x, y, ALTURA_PILAR)
        # Colunelo que sobe do capitel até a abóbada.
        c.anel_extrudado(bm, x, y, [(z, c.perfil_poligono(0.2, 8)) for z in (ALTURA_PILAR, ALTURA_TRIFORIO, ALTURA_TRIFORIO + 1.7)])

for i in range(VAOS):
    y0, y1 = i * VAO, (i + 1) * VAO
    for lado in (-1, 1):
        x = lado * MEIA_NAVE
        a, b = Vector((x, y0, ALTURA_PILAR)), Vector((x, y1, ALTURA_PILAR))
        arco = c.ogiva(a, b, 8, 0.86)
        c.varrer(bm, perfil_arco, arco, normal=Vector((1, 0, 0)))
        # Segunda ordem da moldura, recuada para o lado de fora.
        recuo = Vector((lado * 0.42, 0, 0))
        c.varrer(bm, perfil_arco_int, c.ogiva(a + recuo + Vector((0, 0.4, 0)), b + recuo - Vector((0, 0.4, 0)), 7, 0.86), normal=Vector((1, 0, 0)))
        # Trifório: três arcos pequenos em cada vão.
        for k in range(3):
            ya = y0 + 0.6 + k * (VAO - 1.2) / 3
            yb = ya + (VAO - 1.2) / 3
            c.varrer(bm, perfil_nervura, c.ogiva(Vector((x, ya, ALTURA_TRIFORIO - 0.9)), Vector((x, yb, ALTURA_TRIFORIO - 0.9)), 5, 1.0), normal=Vector((1, 0, 0)))
            c.anel_extrudado(bm, x, ya, [(z, c.perfil_poligono(0.07, 6)) for z in (ALTURA_TRIFORIO - 2.3, ALTURA_TRIFORIO - 0.9)])
        c.varrer(bm, c.perfil_moldura(0.34, 0.22), [Vector((x, y0, ALTURA_TRIFORIO - 2.3)), Vector((x, y1, ALTURA_TRIFORIO - 2.3))], normal=Vector((1, 0, 0)))
        c.varrer(bm, c.perfil_moldura(0.3, 0.2), [Vector((x, y0, ALTURA_TRIFORIO + 0.6)), Vector((x, y1, ALTURA_TRIFORIO + 0.6))], normal=Vector((1, 0, 0)))
    # Nervuras diagonais até a chave, no alto do vão.
    chave = Vector((0, (y0 + y1) / 2, ALTURA_ABOBADA))
    for xi, yi in ((-MEIA_NAVE, y0), (MEIA_NAVE, y0), (-MEIA_NAVE, y1), (MEIA_NAVE, y1)):
        ini = Vector((xi, yi, ALTURA_TRIFORIO + 1.7))
        pts = []
        for t in range(11):
            f = t / 10
            p = ini.lerp(chave, f)
            p.z = ini.z + (chave.z - ini.z) * (1 - (1 - f) ** 2.2)
            pts.append(p)
        c.varrer(bm, perfil_nervura, pts, normal=(chave - ini).cross(Vector((0, 0, 1))))
    c.anel_extrudado(bm, 0, (y0 + y1) / 2, [(ALTURA_ABOBADA - 0.2, c.perfil_poligono(0.3, 8)), (ALTURA_ABOBADA + 0.12, c.perfil_poligono(0.34, 8))])

# Arcos transversais
for i in range(VAOS + 1):
    y = i * VAO
    arco = c.ogiva(Vector((-MEIA_NAVE, y, ALTURA_TRIFORIO + 1.7)), Vector((MEIA_NAVE, y, ALTURA_TRIFORIO + 1.7)), 9, 0.82)
    c.varrer(bm, c.perfil_moldura(0.3, 0.4), arco, normal=Vector((0, 1, 0)))

# Piso: malha regular, para assar a luz por vértice.
nx, ny = 22, 104
x0, y0 = -11.0, -8.0
largura_piso, comprimento = 22.0, 76.0
grade = [[bm.verts.new((x0 + largura_piso * j / nx, y0 + comprimento * i / ny, 0.0)) for j in range(nx + 1)] for i in range(ny + 1)]
for a, b in zip(grade, grade[1:]):
    for j in range(nx):
        bm.faces.new((a[j], a[j + 1], b[j + 1], b[j]))

# Portal oeste: ordens de arcos recuadas.
YP = -7.0
for k in range(4):
    m = 1.5 + k * 0.42
    arco = c.ogiva(Vector((-m, YP - k * 0.3, 3.2)), Vector((m, YP - k * 0.3, 3.2)), 8, 0.9)
    c.varrer(bm, c.perfil_moldura(0.34, 0.34), arco, normal=Vector((0, 1, 0)))
    for lado in (-1, 1):
        c.anel_extrudado(bm, lado * m, YP - k * 0.3, [(z, c.perfil_poligono(0.17, 8)) for z in (0.0, 1.6, 3.2)])

# Moldura da rosácea, acima do portal: anel e raios.
ZR, RR, YR = 11.2, 3.7, YP - 0.4
circulo = [Vector((RR * __import__("math").cos(t * __import__("math").tau / 40), YR, ZR + RR * __import__("math").sin(t * __import__("math").tau / 40))) for t in range(41)]
c.varrer(bm, c.perfil_moldura(0.34, 0.4), circulo, normal=Vector((0, 1, 0)), tampar=False)
circulo_int = [Vector((0.9 * __import__("math").cos(t * __import__("math").tau / 20), YR, ZR + 0.9 * __import__("math").sin(t * __import__("math").tau / 20))) for t in range(21)]
c.varrer(bm, perfil_nervura, circulo_int, normal=Vector((0, 1, 0)), tampar=False)
for t in range(12):
    a = t * 3.141592653 * 2 / 12
    dirv = Vector((__import__("math").cos(a), 0, __import__("math").sin(a)))
    c.varrer(bm, c.perfil_moldura(0.11, 0.2), [Vector((0, YR, ZR)) + dirv * 0.9, Vector((0, YR, ZR)) + dirv * RR], normal=Vector((0, 1, 0)))

pedra = c.objeto("pedra", bm)
pedra.data.materials.append(c.material_difuso())

# Emissores: entram na bake e no modelo final, como peças separadas.
m_leste, em_leste = c.material_emissor("luz_leste")
m_oeste, em_oeste = c.material_emissor("luz_oeste")

bm = bmesh.new()
c.grade_vidro(bm, 2.72, 3.2, 0, YP - 0.1, 0, linhas=10, colunas=3, agudo=0.9)
porta = c.objeto("luz_porta", bm, suave=False)
porta.data.materials.append(m_oeste)

import math  # noqa: E402

bm = bmesh.new()
centro = bm.verts.new((0, YR - 0.2, ZR))
borda = [bm.verts.new((RR * math.cos(t * math.tau / 32), YR - 0.2, ZR + RR * math.sin(t * math.tau / 32))) for t in range(32)]
for t in range(32):
    bm.faces.new((centro, borda[t], borda[(t + 1) % 32]))
rosa = c.objeto("luz_rosa", bm, suave=False)
rosa.data.materials.append(m_oeste)

# Luz da abside, só para a bake: três janelas altas no fim da nave.
bm = bmesh.new()
YA = VAOS * VAO + 2.0
for x in (-2.8, 0.0, 2.8):
    c.grade_vidro(bm, 2.0, 7.0, x, YA, 1.2, linhas=6, colunas=2)
abside = c.objeto("bake_abside", bm, suave=False)
abside.data.materials.append(m_leste)

cena = c.preparar_cycles(amostras=32)
cena.world.light_settings.distance = 5.0

# Canal G: oclusão.
oclusao = c.assar(pedra, "ao", "AO")

# Canal R: luz vinda da abside.
em_leste.inputs["Strength"].default_value = 60.0
em_oeste.inputs["Strength"].default_value = 0.0
leste = c.assar(pedra, "leste", "DIFFUSE", {"DIRECT", "INDIRECT"})

# Canal B: luz do portal e da rosácea, para quando a câmera olha de volta.
em_leste.inputs["Strength"].default_value = 0.0
em_oeste.inputs["Strength"].default_value = 60.0
oeste = c.assar(pedra, "oeste", "DIFFUSE", {"DIRECT", "INDIRECT"})

c.gravar_canais(pedra, leste, oclusao, oeste)

bpy.data.objects.remove(abside, do_unlink=True)
for m in (porta, rosa, pedra):
    m.data.materials.clear()

bpy.ops.object.select_all(action="DESELECT")
c.exportar("nave")
