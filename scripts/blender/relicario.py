"""Relicário: caixa de metal com telhado de duas águas, arcaria e pináculos, sem figuras. E o selo, instanciado na cena."""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import comum as c  # noqa: E402
import bmesh  # noqa: E402
from mathutils import Vector  # noqa: E402

c.limpar_cena()
LX, LY, AZ = 1.0, 0.56, 0.72

bm = bmesh.new()
# Base escalonada e corpo.
def caixa(x, y, z0, z1):
    return [(z0, [(-x, -y), (x, -y), (x, y), (-x, y)]), (z1, [(-x, -y), (x, -y), (x, y), (-x, y)])]

c.anel_extrudado(bm, 0, 0, caixa(LX + 0.14, LY + 0.14, 0.0, 0.08))
c.anel_extrudado(bm, 0, 0, caixa(LX + 0.07, LY + 0.07, 0.08, 0.14))
c.anel_extrudado(bm, 0, 0, caixa(LX, LY, 0.14, AZ))
c.anel_extrudado(bm, 0, 0, caixa(LX + 0.06, LY + 0.06, AZ, AZ + 0.05))

# Telhado de duas águas.
topo = AZ + 0.05
cume = topo + 0.5
v = [bm.verts.new(p) for p in ((-LX - 0.06, -LY - 0.06, topo), (LX + 0.06, -LY - 0.06, topo), (LX + 0.06, LY + 0.06, topo), (-LX - 0.06, LY + 0.06, topo), (-LX - 0.06, 0, cume), (LX + 0.06, 0, cume))]
for f in ((0, 1, 5, 4), (2, 3, 4, 5), (1, 2, 5), (3, 0, 4), (3, 2, 1, 0)):
    bm.faces.new([v[i] for i in f])

# Crista do telhado e pináculos.
for x, y in ((-LX - 0.06, 0), (LX + 0.06, 0)):
    c.anel_extrudado(bm, x, y, [(cume - 0.02, c.perfil_poligono(0.05, 6)), (cume + 0.2, c.perfil_poligono(0.012, 6))])
for t in range(1, 8):
    x = -LX + t * (2 * LX) / 8
    c.anel_extrudado(bm, x, 0, [(cume - 0.01, c.perfil_poligono(0.035, 6)), (cume + 0.09, c.perfil_poligono(0.008, 6))])

perfil = c.perfil_moldura(0.04, 0.05)
# Arcaria nas faces longas e nas curtas.
for lado in (-1, 1):
    y = lado * (LY + 0.012)
    n = 5
    for k in range(n):
        xa = -LX + 0.06 + k * (2 * LX - 0.12) / n
        xb = xa + (2 * LX - 0.12) / n
        arco = c.ogiva(Vector((xa + 0.02, y, 0.42)), Vector((xb - 0.02, y, 0.42)), 5, 1.0)
        c.varrer(bm, perfil, arco, normal=Vector((0, 1, 0)))
        for xc in (xa + 0.02, xb - 0.02):
            c.varrer(bm, perfil, [Vector((xc, y, 0.14)), Vector((xc, y, 0.42))], normal=Vector((0, 1, 0)))
    x = lado * (LX + 0.012)
    for k in range(3):
        ya = -LY + 0.04 + k * (2 * LY - 0.08) / 3
        yb = ya + (2 * LY - 0.08) / 3
        arco = c.ogiva(Vector((x, ya + 0.02, 0.42)), Vector((x, yb - 0.02, 0.42)), 5, 1.0)
        c.varrer(bm, perfil, arco, normal=Vector((1, 0, 0)))
        for yc in (ya + 0.02, yb - 0.02):
            c.varrer(bm, perfil, [Vector((x, yc, 0.14)), Vector((x, yc, 0.42))], normal=Vector((1, 0, 0)))

# Pilares de canto.
for sx in (-1, 1):
    for sy in (-1, 1):
        c.anel_extrudado(bm, sx * (LX + 0.03), sy * (LY + 0.03), [(z, c.perfil_poligono(r, 8)) for z, r in ((0.08, 0.06), (0.16, 0.045), (AZ, 0.045), (AZ + 0.2, 0.012))])

c.objeto("caixa", bm, suave=False)

# Selo: disco com aro e sete pétalas em relevo, sem texto, sem símbolo.
bm = bmesh.new()
perfil_disco = [(0.0, 0.0), (0.2, 0.0), (0.2, 0.012), (0.17, 0.018), (0.14, 0.012), (0.0, 0.012)]
LADOS = 28
aneis = [[bm.verts.new((r * math.cos(t * math.tau / LADOS), z, r * math.sin(t * math.tau / LADOS))) if r > 0 else None for t in range(LADOS)] for r, z in perfil_disco[1:-1]]
for a, b in zip(aneis, aneis[1:]):
    for t in range(LADOS):
        k = (t + 1) % LADOS
        bm.faces.new((a[t], a[k], b[k], b[t]))
frente = bm.verts.new((0, 0.012, 0))
tras = bm.verts.new((0, 0.0, 0))
for t in range(LADOS):
    k = (t + 1) % LADOS
    bm.faces.new((aneis[-1][t], aneis[-1][k], frente))
    bm.faces.new((aneis[0][k], aneis[0][t], tras))
c.objeto("selo", bm, suave=False)

c.exportar("relicario", com_cor=False)
