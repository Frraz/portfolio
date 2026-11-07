"use client";

/* Alvo de renderização e objetos da cena são estado mutável a cada quadro, fora do ciclo de render do React. */
/* eslint-disable react-hooks/immutability */

/**
 * Cena A, "Tudo é código" (docs/06). A forma 3D de cada seção é renderizada em um alvo do tamanho exato da
 * grade de células da chuva. A chuva lê esse alvo como máscara: onde há superfície, as células travam e viram
 * contorno em traços de caixa com miolo em hex. A luz da superfície (0,5 a 1) vira profundidade no brilho.
 * Tudo em unidades de célula, com o eixo y para cima. A câmera em perspectiva enquadra a tela inteira.
 */
import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { partilha } from "./partilha";

const VERT = /* glsl */ `
  varying vec3 vN;
  void main() {
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
// Luz da superfície entre 0,55 e 1: tudo que é desenhado fica acima do limite de "dentro" da máscara.
const FRAG = /* glsl */ `
  varying vec3 vN;
  void main() {
    float l = 0.55 + 0.45 * max(dot(normalize(vN), normalize(vec3(-0.3, 0.6, 0.75))), 0.0);
    gl_FragColor = vec4(vec3(l), 1.0);
  }
`;

const CAMADAS_NOME = 22;
const FOV = 30;
const UP = new THREE.Vector3(0, 1, 0);

type Pulso = { malha: THREE.Mesh; caminho: THREE.Vector3[]; fase: number };

function regiao(c: number, f: number) {
  // Tela larga: forma nas colunas da direita. Tela estreita: faixa no topo, acima do texto.
  return c >= 61 ? { x0: c * 0.62, x1: c * 0.95, y0: f * 0.2, y1: f * 0.8 } : { x0: c * 0.14, x1: c * 0.86, y0: f * 0.1, y1: f * 0.4 };
}

export default function FormaA() {
  const { gl } = useThree();

  const o = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(64, 36, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false, depthBuffer: true });
    const cena = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 16 / 9, 0.1, 500);
    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG });
    const geoCaixa = new THREE.BoxGeometry(1, 1, 1);
    const geoTubo = new THREE.CylinderGeometry(1, 1, 1, 8, 1, false);
    const geoEsfera = new THREE.SphereGeometry(1, 14, 10);
    const geoCone = new THREE.ConeGeometry(1, 1, 10);
    const grupos = { inicio: new THREE.Group(), agora: new THREE.Group(), contato: new THREE.Group() };
    for (const g of Object.values(grupos)) cena.add(g);
    return { rt, cena, camera, material, geoCaixa, geoTubo, geoEsfera, geoCone, grupos, camadas: [] as THREE.Mesh[], nomeTex: null as THREE.CanvasTexture | null, dim: "", pulsos: [] as Pulso[], contato: null as null | { setas: THREE.Group[]; pulso: THREE.Mesh; esferas: THREE.Mesh[] }, centro: new THREE.Vector3() };
  }, []);

  useEffect(() => {
    partilha.mascaraA = o.rt.texture;
    return () => {
      partilha.mascaraA = null;
      o.rt.dispose();
      o.material.dispose();
      o.geoCaixa.dispose();
      o.geoTubo.dispose();
      o.geoEsfera.dispose();
      o.geoCone.dispose();
      o.nomeTex?.dispose();
    };
  }, [o]);

  /** Reconstrói as formas que dependem do tamanho da grade. Só roda quando a janela muda. */
  function montar(c: number, f: number) {
    const { grupos, material, geoCaixa, geoTubo, geoEsfera, geoCone } = o;
    for (const g of Object.values(grupos)) g.clear();
    o.pulsos = [];

    // Nome: pilha de camadas com a máscara do hero. A câmera gira um pouco e a pilha vira extrusão.
    o.camadas = [];
    if (partilha.nomeCanvas) {
      o.nomeTex?.dispose();
      o.nomeTex = new THREE.CanvasTexture(partilha.nomeCanvas);
      o.nomeTex.flipY = true;
      o.nomeTex.minFilter = o.nomeTex.magFilter = THREE.LinearFilter;
      o.nomeTex.generateMipmaps = false;
      const plano = new THREE.PlaneGeometry(1, 1);
      for (let k = 0; k < CAMADAS_NOME; k++) {
        const v = 1 - (k / CAMADAS_NOME) * 0.4;
        const m = new THREE.Mesh(plano, new THREE.MeshBasicMaterial({ map: o.nomeTex, alphaTest: 0.5, side: THREE.DoubleSide, color: new THREE.Color(v, v, v) }));
        m.scale.set(c, f, 1);
        m.position.set(c / 2, f / 2, -k * 0.5);
        grupos.inicio.add(m);
        o.camadas.push(m);
      }
    }

    const R = regiao(c, f);
    const cx = (R.x0 + R.x1) / 2;
    const cy = f - (R.y0 + R.y1) / 2;
    const largura = R.x1 - R.x0;
    const altura = R.y1 - R.y0;
    const escala = Math.max(0.55, Math.min(1.25, Math.min(largura / 34, altura / 26)));
    const tubo = (a: THREE.Vector3, b: THREE.Vector3, r: number) => {
      const m = new THREE.Mesh(geoTubo, material);
      const d = b.clone().sub(a);
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(UP, d.clone().normalize());
      m.scale.set(r, d.length(), r);
      return m;
    };

    // Agora: árvore de fibra 1:2:4:8 (OLT, dois divisores, quatro divisores, oito ONUs).
    const ga = grupos.agora;
    ga.position.set(cx, cy, 0);
    const pos = (n: number, i: number) => new THREE.Vector3(-largura / 2 + 3 * escala + ((largura - 6 * escala) * n) / 3, altura / 2 - (altura * (i + 0.5)) / 2 ** n, 0);
    for (let n = 0; n < 3; n++) {
      for (let i = 0; i < 2 ** n; i++) {
        for (const j of [2 * i, 2 * i + 1]) ga.add(tubo(pos(n, i), pos(n + 1, j), 0.85 * escala));
      }
    }
    for (let n = 0; n <= 3; n++) {
      for (let i = 0; i < 2 ** n; i++) {
        const m = new THREE.Mesh(geoCaixa, material);
        const tam = n === 0 ? [4.8, 4.2, 4.2] : n === 3 ? [3.4, 2.4, 2.4] : [2.6, 2.6, 2.6];
        m.scale.set(tam[0] * escala, tam[1] * escala, tam[2] * escala);
        m.position.copy(pos(n, i));
        ga.add(m);
      }
    }
    for (let k = 0; k < 3; k++) {
      const leaf = Math.floor((k * 8) / 3 + 0.5) % 8;
      const caminho = [pos(0, 0), pos(1, leaf >> 2), pos(2, leaf >> 1), pos(3, leaf)];
      const m = new THREE.Mesh(geoEsfera, material);
      m.scale.setScalar(1.7 * escala);
      ga.add(m);
      o.pulsos.push({ malha: m, caminho, fase: k / 3 });
    }

    // Contato: dois nós e três setas, o handshake SYN, SYN-ACK, ACK.
    const gc = grupos.contato;
    gc.position.set(cx, cy, 0);
    const raio = 4.2 * escala;
    const esferas = [-1, 1].map((lado) => {
      const m = new THREE.Mesh(geoEsfera, material);
      m.scale.setScalar(raio);
      m.position.set(lado * (largura / 2 - raio), 0, 0);
      gc.add(m);
      return m;
    });
    const setas: THREE.Group[] = [];
    [1, -1, 1].forEach((sentido, k) => {
      const g = new THREE.Group();
      const y = (1 - k) * 6.4 * escala;
      const x0 = (-largura / 2 + 2 * raio + 1) * sentido;
      const x1 = (largura / 2 - 2 * raio - 1) * sentido;
      g.add(tubo(new THREE.Vector3(x0, y, 0), new THREE.Vector3(x1 - sentido * 2.8 * escala, y, 0), 0.8 * escala));
      const ponta = new THREE.Mesh(geoCone, material);
      ponta.scale.set(2.1 * escala, 3.4 * escala, 2.1 * escala);
      ponta.position.set(x1 - sentido * 1.4 * escala, y, 0);
      ponta.rotation.z = -sentido * Math.PI * 0.5;
      g.add(ponta);
      g.userData = { x0, x1, y };
      gc.add(g);
      setas.push(g);
    });
    const pulso = new THREE.Mesh(geoEsfera, material);
    pulso.scale.setScalar(1.6 * escala);
    gc.add(pulso);
    o.contato = { setas, pulso, esferas };
  }

  useFrame(() => {
    const c = partilha.colunas;
    const f = partilha.fileiras;
    if (c < 2 || f < 2) return;
    const dim = `${c}x${f}|${partilha.nomeCanvas ? 1 : 0}`;
    if (dim !== o.dim) {
      o.dim = dim;
      o.rt.setSize(c, f);
      o.camera.aspect = c / f;
      o.camera.updateProjectionMatrix();
      montar(c, f);
    }
    if (partilha.nomeMudou && o.nomeTex) o.nomeTex.needsUpdate = true;

    const t = partilha.tempo;
    const sec = partilha.secao;
    o.grupos.inicio.visible = sec === "inicio";
    // Em tela estreita o texto ocupa a largura toda: a faixa fixa da forma passaria atrás da leitura (decisão 92).
    const largo = c >= 61;
    o.grupos.agora.visible = largo && sec === "agora";
    o.grupos.contato.visible = largo && sec === "contato";

    // Câmera em perspectiva que enquadra exatamente a grade; a leve rotação dá a profundidade da extrusão.
    const d = f / 2 / Math.tan((FOV * Math.PI) / 360);
    const giro = partilha.parada ? 0.17 : Math.sin(t * 0.45) * 0.17;
    o.centro.set(c / 2, f / 2, 0);
    o.camera.position.set(o.centro.x + Math.sin(giro) * d, o.centro.y, Math.cos(giro) * d);
    o.camera.lookAt(o.centro);

    // Árvore: a luz percorre a fibra, da OLT a uma ONU, em ciclos escalonados.
    const rodando = !partilha.parada;
    o.grupos.agora.rotation.y = rodando ? Math.sin(t * 0.5) * 0.35 : 0.2;
    for (const p of o.pulsos) {
      const u = rodando ? ((t * 0.28 + p.fase) % 1) * 3 : 3 * (0.5 + p.fase * 0.4);
      const s = Math.min(2, Math.floor(u));
      p.malha.position.lerpVectors(p.caminho[s], p.caminho[s + 1], u - s);
    }

    // Handshake: ciclo de 5 s. SYN (0 a 1,2 s), SYN-ACK (1,2 a 2,4), ACK (2,4 a 3,6) e uma pausa com tudo aceso.
    const hc = o.contato;
    if (hc) {
      o.grupos.contato.rotation.y = rodando ? Math.sin(t * 0.4) * 0.25 : 0.15;
      const ciclo = rodando ? t % 5 : 4;
      hc.setas.forEach((g, k) => {
        const visivel = ciclo >= k * 1.2;
        g.visible = visivel;
      });
      const k = Math.min(2, Math.floor(ciclo / 1.2));
      const u = Math.min(1, (ciclo - k * 1.2) / 1.2);
      const { x0, x1, y } = hc.setas[k].userData as { x0: number; x1: number; y: number };
      hc.pulso.visible = ciclo < 3.6;
      hc.pulso.position.set(x0 + (x1 - x0) * u, y, 0);
    }

    const anterior = gl.getRenderTarget();
    const cor = new THREE.Color();
    gl.getClearColor(cor);
    const alfa = gl.getClearAlpha();
    gl.setRenderTarget(o.rt);
    gl.setClearColor(0x000000, 0);
    gl.clear();
    gl.render(o.cena, o.camera);
    gl.setRenderTarget(anterior);
    gl.setClearColor(cor, alfa);
  });

  return null;
}
