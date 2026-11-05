"use client";

/* Cena 3D: uniforms e transformações mudam a cada quadro, fora do ciclo de render do React. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei/core/Gltf";
import * as THREE from "three";
import { TEMAS, TEMA_PADRAO } from "@/temas/temas";
import { paraLinear } from "@/temas/cor";
import { estadoCena, reduzido } from "@/movimento/estado";
import { amostrar } from "./caminho";
import { fragmentoLuz, fragmentoPedra, verticeLuz, verticePedra } from "./shader";
import { lerTrilha } from "../trilha";

const temaAtual = () => TEMAS.find((t) => t.id === document.documentElement.dataset.tema) ?? TEMAS.find((t) => t.id === TEMA_PADRAO)!;
const v3 = (hex: string) => new THREE.Vector3(...paraLinear(hex));

/** A quantização guarda escala e translação no nó: a geometria sozinha fica em coordenadas normalizadas. */
function peca(cena: THREE.Object3D, nome: string) {
  const no = cena.getObjectByName(nome) as THREE.Mesh;
  return { geometry: no.geometry, position: no.position.clone(), quaternion: no.quaternion.clone(), scale: no.scale.clone() };
}

type Compartilhado = {
  uFundo: { value: THREE.Vector3 };
  uTinta: { value: THREE.Vector3 };
  uTeto: { value: number };
  uClaro: { value: number };
  uNave: { value: number };
  uLivreX: { value: number };
};

function aplicarTema(c: Compartilhado, leste: THREE.Vector3, oeste: THREE.Vector3, cores: THREE.Vector3[]) {
  const t = temaAtual();
  c.uFundo.value.copy(v3(t.cores.fundo));
  c.uTinta.value.copy(v3(t.cores.tinta));
  c.uClaro.value = t.esquema === "light" ? 1 : 0;
  leste.copy(v3(t.vitral[0]));
  oeste.copy(v3(t.cores.acento));
  cores[0].copy(v3(t.vitral[1]));
  cores[1].copy(v3(t.vitral[3]));
}

function materialLuz(c: Compartilhado, cor: THREE.Vector3, cor2: THREE.Vector3, forca: number, faixa: [number, number]) {
  return new THREE.ShaderMaterial({
    vertexShader: verticeLuz,
    fragmentShader: fragmentoLuz,
    toneMapped: false,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      ...c,
      uCor: { value: cor },
      uCor2: { value: cor2 },
      uForca: { value: forca },
      uAte: { value: 1 },
      uFaixa: { value: new THREE.Vector2(faixa[0], faixa[1]) },
    },
  });
}

/** Ambiente de metal criado no próprio navegador: janelas altas sobre a escuridão, sem arquivo externo. */
function ambienteRelicario(gl: THREE.WebGLRenderer) {
  const cena = new THREE.Scene();
  cena.background = new THREE.Color(0x050403);
  const janela = (x: number, y: number, z: number, w: number, h: number, i: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(i, i * 0.88, i * 0.68), side: THREE.DoubleSide }));
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    cena.add(m);
  };
  janela(-4, 3, 3, 1.2, 5, 16);
  janela(4, 2, 2, 0.8, 4, 8);
  janela(0, 5, -4, 3, 1, 12);
  janela(-1, -4, 2, 3, 1, 1.2);
  const pm = new THREE.PMREMGenerator(gl);
  const rt = pm.fromScene(cena, 0.02);
  pm.dispose();
  cena.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return rt.texture;
}

function Relicario({ comp }: { comp: Compartilhado }) {
  const { scene } = useGLTF("/gl/relicario.glb", false, false);
  const grupo = useRef<THREE.Group>(null);
  const instancias = useRef<THREE.InstancedMesh>(null);
  const { camera, gl, size } = useThree();
  const [env] = useState(() => ambienteRelicario(gl));
  const ouro = useMemo(() => new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.42, envMap: env, envMapIntensity: 0.72, transparent: true }), [env]);
  const caixa = useMemo(() => peca(scene, "caixa"), [scene]);
  const selo = useMemo(() => peca(scene, "selo"), [scene]);
  const auxiliar = useMemo(() => new THREE.Object3D(), []);
  const posCam = useMemo(() => new THREE.Vector3(), []);
  const estado = useRef({ subidos: 0, visivel: 0 });
  useEffect(() => () => void (env.dispose(), ouro.dispose()), [env, ouro]);

  useFrame((_, delta) => {
    const g = grupo.current;
    const inst = instancias.current;
    if (!g || !inst) return;
    const { t } = lerTrilha();
    const claro = comp.uClaro.value > 0.5;
    const largura = size.width >= 1200;
    // Só em Certificados, à direita, onde a lista não chega.
    const alvo = largura && !claro && t > 5.05 && t < 5.97 ? 1 : 0;
    const e = estado.current;
    const dt = Math.min(delta, 0.5);
    e.visivel += (alvo - e.visivel) * (reduzido() ? 1 : Math.min(1, dt * 4));
    g.visible = e.visivel > 0.01;
    if (!g.visible) return;
    ouro.opacity = e.visivel;
    const [cr, cg, cb] = paraLinear(temaAtual().cores.acento);
    ouro.color.setRGB(cr * 1.1, cg * 1.1, cb * 1.1);
    // Preso à câmera, no terço direito da tela.
    const persp = camera as THREE.PerspectiveCamera;
    // Perto da câmera: nenhum pilar passa na frente. A escala compensa a distância.
    const dist = 2.4;
    const metade = Math.tan((persp.fov * Math.PI) / 360) * dist;
    g.position.set(metade * persp.aspect * 0.64, -metade * 0.12, -dist).applyMatrix4(camera.matrixWorld);
    g.quaternion.copy(camera.quaternion);
    const giro = (t - 5) * Math.PI * 1.4;
    g.rotateY(giro - 0.5);
    g.rotateX(0.14);
    g.getWorldPosition(posCam);
    // Selos: os do filtro atual sobem à frente; os outros ficam em órbita baixa.
    e.subidos += (estadoCena.selosAtivos - e.subidos) * (reduzido() ? 1 : Math.min(1, dt * 5));
    const total = inst.count;
    for (let i = 0; i < total; i++) {
      const a = (i / total) * Math.PI * 2;
      const ativo = THREE.MathUtils.clamp(e.subidos - i, 0, 1);
      const raio = 1.5 - ativo * 0.1;
      auxiliar.position.set(Math.cos(a) * raio, -0.12 + ativo * (0.5 + 0.55 * Math.sin(a * 3 + giro)), Math.sin(a) * raio);
      auxiliar.rotation.set(0, -a + Math.PI / 2, 0);
      const s = 0.3 + ativo * 0.22;
      auxiliar.scale.copy(selo.scale).multiplyScalar(s);
      auxiliar.updateMatrix();
      inst.setMatrixAt(i, auxiliar.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={grupo} visible={false} scale={0.34}>
      <group position={[0, -0.5, 0]}>
        <mesh {...caixa} material={ouro} />
      </group>
      <instancedMesh ref={instancias} args={[selo.geometry, ouro, 36]} frustumCulled={false} />
    </group>
  );
}

function Lancetas({ comp, cor, cor2, fracoes }: { comp: Compartilhado; cor: THREE.Vector3; cor2: THREE.Vector3; fracoes: number[] }) {
  const { scene } = useGLTF("/gl/lancetas.glb", false, false);
  const { pedra, vidros } = useMemo(() => {
    const pedraPeca = peca(scene, "pedra");
    const pedraMat = new THREE.ShaderMaterial({
      vertexShader: verticePedra,
      fragmentShader: fragmentoPedra,
      toneMapped: false,
      transparent: true,
      uniforms: { ...comp, uLeste: { value: cor }, uOeste: { value: cor } },
    });
    const vidros = [0, 1, 2].map((i) => ({
      ...peca(scene, `vidro_${i}`),
      material: materialLuz(comp, cor, cor2, 0.09, [1.2, 10.2]),
    }));
    return { pedra: { ...pedraPeca, material: pedraMat }, vidros };
  }, [scene, comp, cor, cor2]);
  useFrame(() => {
    const { t } = lerTrilha();
    // A janela acende junto com a seção; a da FIAP para na proporção real do curso.
    const f = reduzido() ? 1 : THREE.MathUtils.clamp((t - 3.02) / 0.7, 0, 1);
    vidros.forEach((v, i) => (v.material.uniforms.uAte.value = (fracoes[i] ?? 1) * f));
  });
  return (
    <group>
      <mesh {...pedra} />
      {vidros.map((v, i) => (
        <mesh key={i} {...v} />
      ))}
    </group>
  );
}

/** Pontos de brasa e poeira subindo devagar. Um único draw call. */
function Atmosfera({ comp, cor }: { comp: Compartilhado; cor: THREE.Vector3 }) {
  const N = 260;
  const geometria = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(N * 3);
    const s = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      p[i * 3] = (i * 37 % 100) / 100 * 20 - 10;
      p[i * 3 + 1] = (i * 71 % 100) / 100 * 16;
      p[i * 3 + 2] = (i * 113 % 100) / 100 * 40 - 20;
      s[i] = ((i * 53) % 100) / 100;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("semente", new THREE.BufferAttribute(s, 1));
    return g;
  }, []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        uniforms: { ...comp, uTempo: { value: 0 }, uCor: { value: cor }, uZ: { value: 0 } },
        vertexShader: /* glsl */ `
          attribute float semente;
          uniform float uTempo;
          uniform float uZ;
          varying float vA;
          void main() {
            vec3 p = position;
            p.y = mod(p.y + uTempo * (0.12 + semente * 0.3), 16.0);
            p.x += sin(uTempo * 0.3 + semente * 40.0) * 0.5;
            p.z = uZ + mod(p.z - uZ + 20.0, 40.0) - 20.0;
            vec4 mv = viewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp((1.2 + semente * 3.0) * 26.0 / -mv.z, 1.0, 5.0);
            vA = (0.35 + 0.65 * sin(uTempo * (0.4 + semente) + semente * 90.0) * 0.5 + 0.3) * smoothstep(0.0, 2.0, p.y);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          uniform vec3 uCor;
          uniform float uTeto;
          uniform float uClaro;
          uniform float uNave;
          varying float vA;
          void main() {
            if (uClaro > 0.5) discard;
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.05, d) * vA * uNave;
            gl_FragColor = vec4(uCor * min(uTeto * 3.0, 1.0), a);
            #include <colorspace_fragment>
          }
        `,
      }),
    [comp, cor],
  );
  useFrame(({ camera }, delta) => {
    material.uniforms.uTempo.value += Math.min(delta, 0.1);
    material.uniforms.uZ.value = camera.position.z;
  });
  return <points geometry={geometria} material={material} frustumCulled={false} />;
}

export default function Nave({ relicario, atmosfera, fracoes }: { relicario: boolean; atmosfera: boolean; fracoes: number[] }) {
  const { scene } = useGLTF("/gl/nave.glb", false, false);
  const { camera, size, viewport } = useThree();

  const [comp] = useState<Compartilhado>(() => ({
    uFundo: { value: new THREE.Vector3() },
    uTinta: { value: new THREE.Vector3() },
    uTeto: { value: 0.05 },
    uClaro: { value: 0 },
    uNave: { value: 0 },
    uLivreX: { value: 1e5 },
  }));
  const [leste] = useState(() => new THREE.Vector3());
  const [oeste] = useState(() => new THREE.Vector3());
  const [cores] = useState(() => [new THREE.Vector3(), new THREE.Vector3()]);

  const pedra = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: verticePedra,
        fragmentShader: fragmentoPedra,
        toneMapped: false,
        transparent: true,
        uniforms: { ...comp, uLeste: { value: leste }, uOeste: { value: oeste } },
      }),
    [comp, leste, oeste],
  );
  const luzPorta = useMemo(() => materialLuz(comp, oeste, cores[0], 1.5, [0, 10]), [comp, oeste, cores]);
  const luzRosa = useMemo(() => materialLuz(comp, leste, cores[1], 0.5, [0, 30]), [comp, leste, cores]);

  const pecas = useMemo(() => ({ pedra: peca(scene, "pedra"), porta: peca(scene, "luz_porta"), rosa: peca(scene, "luz_rosa") }), [scene]);

  useEffect(() => {
    const aplicar = () => {
      aplicarTema(comp, leste, oeste, cores);
      estadoCena.sujo = 60;
    };
    aplicar();
    const obs = new MutationObserver(aplicar);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
    return () => obs.disconnect();
  }, [comp, leste, oeste, cores]);

  const grupo = useRef<THREE.Group>(null);
  const atual = useRef<{ pos: THREE.Vector3; alvo: THREE.Vector3; pronto: boolean }>({ pos: new THREE.Vector3(), alvo: new THREE.Vector3(), pronto: false });
  const a = useMemo(() => [0, 0, 0], []);
  const b = useMemo(() => [0, 0, 0], []);
  const cursor = useRef({ x: 0, y: 0, sx: 0, sy: 0 });

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || reduzido()) return;
    const mover = (e: PointerEvent) => {
      cursor.current.x = (e.clientX / innerWidth - 0.5) * 2;
      cursor.current.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    addEventListener("pointermove", mover, { passive: true });
    return () => removeEventListener("pointermove", mover);
  }, []);

  useFrame((_, delta) => {
    const { p, t } = lerTrilha();
    const dt = Math.min(delta, 0.1);
    // Na travessia do vitral, a nave surge por trás da luz.
    const fade = THREE.MathUtils.clamp((p - 0.68) / 0.28, 0, 1);
    comp.uNave.value = fade;
    if (grupo.current) grupo.current.visible = fade > 0.001;
    comp.uTeto.value = 0.05;
    comp.uLivreX.value = size.width >= 1200 ? size.width * 0.58 * viewport.dpr : 1e5;

    const tEf = p < 1 ? -1 + p : t;
    amostrar(tEf, a, b);
    const c = cursor.current;
    c.sx += (c.x - c.sx) * Math.min(1, dt * 2);
    c.sy += (c.y - c.sy) * Math.min(1, dt * 2);
    const u = atual.current;
    const k = reduzido() || !u.pronto ? 1 : 1 - Math.exp(-dt * 5);
    // Sem alocar por quadro: lerp escrito à mão sobre os vetores já existentes.
    u.pos.x += (a[0] + c.sx * 0.18 - u.pos.x) * k;
    u.pos.y += (a[1] - c.sy * 0.1 - u.pos.y) * k;
    u.pos.z += (a[2] - u.pos.z) * k;
    u.alvo.x += (b[0] - u.alvo.x) * k;
    u.alvo.y += (b[1] - u.alvo.y) * k;
    u.alvo.z += (b[2] - u.alvo.z) * k;
    u.pronto = true;
    camera.position.copy(u.pos);
    camera.lookAt(u.alvo);
    camera.updateMatrixWorld();
  });

  return (
    <group ref={grupo} visible={false}>
      <mesh {...pecas.pedra} material={pedra} />
      <mesh {...pecas.porta} material={luzPorta} />
      <mesh {...pecas.rosa} material={luzRosa} />
      <Lancetas comp={comp} cor={leste} cor2={cores[0]} fracoes={fracoes} />
      {relicario ? <Relicario comp={comp} /> : null}
      {atmosfera ? <Atmosfera comp={comp} cor={oeste} /> : null}
    </group>
  );
}
