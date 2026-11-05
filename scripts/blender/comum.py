"""Ferramentas de geometria gótica para os modelos da Nave. Roda dentro do Blender, sem interface."""
import math
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector

RAIZ = Path(__file__).resolve().parents[2]
BRUTOS = RAIZ / "assets-3d" / "brutos"
BRUTOS.mkdir(parents=True, exist_ok=True)


def limpar_cena():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def ogiva(a, b, n=14, agudo=1.0):
    """Arco ogival entre as impostas `a` e `b`. `agudo` = 1 é o arco equilátero."""
    a, b = Vector(a), Vector(b)
    vao = b - a
    largura = vao.length
    raio = largura * agudo
    # Os centros ficam sobre a linha das impostas, cada um servindo o lado oposto.
    d = vao.normalized()
    c_esq = a + d * raio
    c_dir = b - d * raio
    ang_max = math.acos((raio - largura / 2) / raio)
    pontos = []
    for i in range(n + 1):
        t = ang_max * i / n
        pontos.append(c_esq - d * raio * math.cos(t) + Vector((0, 0, raio * math.sin(t))))
    for i in range(n - 1, -1, -1):
        t = ang_max * i / n
        pontos.append(c_dir + d * raio * math.cos(t) + Vector((0, 0, raio * math.sin(t))))
    return pontos


def varrer(bm, perfil, caminho, normal=None, tampar=True):
    """Varre um perfil fechado (u, v) ao longo de um caminho aberto. Retorna os vértices."""
    if normal is None:
        delta = caminho[-1] - caminho[0]
        normal = delta.cross(Vector((0, 0, 1)))
        if normal.length < 1e-5:
            normal = Vector((1, 0, 0))
    normal = normal.normalized()
    aneis = []
    for i, p in enumerate(caminho):
        ant = caminho[max(i - 1, 0)]
        seg = caminho[min(i + 1, len(caminho) - 1)]
        t = (seg - ant).normalized()
        v_eixo = normal.cross(t).normalized()
        aneis.append([bm.verts.new(p + normal * u + v_eixo * v) for u, v in perfil])
    n = len(perfil)
    for a, b in zip(aneis, aneis[1:]):
        for j in range(n):
            k = (j + 1) % n
            bm.faces.new((a[j], a[k], b[k], b[j]))
    if tampar:
        bm.faces.new(list(reversed(aneis[0])))
        bm.faces.new(aneis[-1])
    return aneis


def anel_extrudado(bm, cx, cy, aneis):
    """Empilha anéis horizontais. `aneis` = lista de (z, [(x, y) relativos])."""
    verts = [[bm.verts.new((cx + x, cy + y, z)) for x, y in pts] for z, pts in aneis]
    n = len(aneis[0][1])
    for a, b in zip(verts, verts[1:]):
        for j in range(n):
            k = (j + 1) % n
            bm.faces.new((a[j], a[k], b[k], b[j]))
    bm.faces.new(list(reversed(verts[0])))
    bm.faces.new(verts[-1])


def perfil_poligono(raio, lados, fase=0.0):
    return [(raio * math.cos(fase + i * math.tau / lados), raio * math.sin(fase + i * math.tau / lados)) for i in range(lados)]


def perfil_pilar(raio, lobulos=8, por_lobulo=4, saliencia=0.26):
    """Pilar composto: núcleo com colunelos, como nos pilares feixe do gótico."""
    n = lobulos * por_lobulo
    pts = []
    for i in range(n):
        a = i * math.tau / n
        r = raio * (1 + saliencia * max(0.0, math.cos(a * lobulos)) ** 2)
        pts.append((r * math.cos(a), r * math.sin(a)))
    return pts


def escalar(pts, f):
    return [(x * f, y * f) for x, y in pts]


def perfil_moldura(largura, altura):
    """Seção chanfrada de uma nervura."""
    l, h = largura / 2, altura / 2
    c = min(l, h) * 0.45
    return [(-l, h - c), (-l + c, h), (l - c, h), (l, h - c), (l, -h + c), (l - c, -h), (-l + c, -h), (-l, -h + c)]


def pilar(bm, x, y, altura, raio=0.46, lobulos=8):
    corpo = perfil_pilar(raio, lobulos)
    # Chanfros de base e capitel: o perfil varia, a topologia não.
    aneis = [
        (0.0, escalar(corpo, 1.7)),
        (0.35, escalar(corpo, 1.7)),
        (0.45, escalar(corpo, 1.4)),
        (0.75, escalar(corpo, 1.08)),
    ]
    trecho = altura - 1.75
    for i in range(1, 6):
        aneis.append((0.75 + trecho * i / 5, corpo))
    aneis += [
        (altura - 0.8, escalar(corpo, 1.1)),
        (altura - 0.45, escalar(corpo, 1.42)),
        (altura - 0.2, escalar(corpo, 1.62)),
        (altura, escalar(corpo, 1.62)),
    ]
    anel_extrudado(bm, x, y, aneis)


def lanceta_contorno(largura, altura_imposta, n=10, agudo=1.15):
    """Contorno de lanceta no plano XZ, de baixo para cima, centrado em x = 0."""
    a = Vector((-largura / 2, 0, altura_imposta))
    b = Vector((largura / 2, 0, altura_imposta))
    arco = ogiva(a, b, n, agudo)
    return [Vector((-largura / 2, 0, 0))] + arco + [Vector((largura / 2, 0, 0))]


def grade_vidro(bm, largura, altura_imposta, x, y, z, linhas=16, colunas=4, agudo=1.15):
    """Vidro em grade fina, recortado pelo contorno ogival, para o preenchimento por altura."""
    def meia_largura(h):
        if h <= altura_imposta:
            return largura / 2
        raio = largura * agudo
        centro = raio - largura / 2
        dy = h - altura_imposta
        if dy >= math.sqrt(max(raio * raio - centro * centro, 0)):
            return 0.0005
        return max(math.sqrt(raio * raio - dy * dy) - centro, 0.0005)

    topo = altura_imposta + math.sqrt(max((largura * agudo) ** 2 - (largura * agudo - largura / 2) ** 2, 0))
    aneis = []
    for i in range(linhas + 1):
        h = topo * i / linhas
        m = meia_largura(h)
        aneis.append([bm.verts.new((x - m + 2 * m * j / colunas, y, z + h)) for j in range(colunas + 1)])
    for a, b in zip(aneis, aneis[1:]):
        for j in range(colunas):
            bm.faces.new((a[j], a[j + 1], b[j + 1], b[j]))


def objeto(nome, bm, suave=True):
    bm.normal_update()
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.0005)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    malha = bpy.data.meshes.new(nome)
    bm.to_mesh(malha)
    bm.free()
    if suave:
        malha.shade_smooth()
    ob = bpy.data.objects.new(nome, malha)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def material_difuso(nome="difuso"):
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (0.8, 0.8, 0.8, 1)
    b.inputs["Roughness"].default_value = 1.0
    return m


def material_emissor(nome):
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    n = m.node_tree.nodes
    n.clear()
    saida = n.new("ShaderNodeOutputMaterial")
    em = n.new("ShaderNodeEmission")
    em.inputs["Strength"].default_value = 0.0
    m.node_tree.links.new(em.outputs[0], saida.inputs[0])
    return m, em


def preparar_cycles(amostras=24):
    cena = bpy.context.scene
    cena.render.engine = "CYCLES"
    cena.cycles.device = "CPU"
    cena.cycles.samples = amostras
    cena.cycles.use_denoising = False
    cena.render.bake.target = "VERTEX_COLORS"
    cena.render.bake.use_clear = True
    if cena.world is None:
        cena.world = bpy.data.worlds.new("mundo")
    cena.world.use_nodes = True
    fundo = cena.world.node_tree.nodes.get("Background") or cena.world.node_tree.nodes.new("ShaderNodeBackground")
    fundo.inputs["Color"].default_value = (0, 0, 0, 1)
    fundo.inputs["Strength"].default_value = 0.0
    return cena


def assar(ob, nome, tipo, passes=None):
    """Assa um atributo por vértice e o devolve como lista normalizada de luminâncias."""
    malha = ob.data
    attr = malha.color_attributes.new(nome, "FLOAT_COLOR", "POINT")
    malha.color_attributes.active_color = attr
    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    if passes:
        bpy.ops.object.bake(type=tipo, pass_filter=passes)
    else:
        bpy.ops.object.bake(type=tipo)
    valores = [sum(d.color[:3]) / 3 for d in malha.color_attributes[nome].data]
    ordenados = sorted(valores)
    teto = max(ordenados[int(len(ordenados) * 0.995)], 1e-5)
    return [min(v / teto, 1.0) for v in valores]


def gravar_canais(ob, r, g, b):
    """Grava luz em R, oclusão em G e a segunda luz em B, sempre em cinza: o shader tinge pelo tema."""
    malha = ob.data
    for a in list(malha.color_attributes):
        malha.color_attributes.remove(a)
    attr = malha.color_attributes.new("Col", "BYTE_COLOR", "CORNER")
    for poly in malha.polygons:
        for li in poly.loop_indices:
            v = malha.loops[li].vertex_index
            attr.data[li].color = (r[v], g[v], b[v], 1.0)
    malha.color_attributes.active_color = attr
    malha.color_attributes.render_color_index = 0


def exportar(nome, com_cor=True):
    destino = BRUTOS / f"{nome}.glb"
    opcoes = dict(
        filepath=str(destino),
        export_format="GLB",
        export_yup=True,
        export_apply=True,
        export_materials="NONE",
        export_animations=False,
        export_cameras=False,
        export_lights=False,
        export_tangents=False,
        export_texcoords=False,
    )
    props = bpy.ops.export_scene.gltf.get_rna_type().properties
    if com_cor and "export_vertex_color" in props:
        opcoes["export_vertex_color"] = "ACTIVE"
    elif com_cor and "export_colors" in props:
        opcoes["export_colors"] = True
    bpy.ops.export_scene.gltf(**opcoes)
    tris = sum(len(p.vertices) - 2 for o in bpy.data.objects if o.type == "MESH" for p in o.data.polygons)
    print(f"[modelo] {nome}: {tris} triângulos, {destino.stat().st_size / 1024:.0f} KB brutos")
