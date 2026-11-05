"use client";

/* Cena WebGL: uniforms são estado mutável a cada quadro, fora do ciclo de render do React. */
/* eslint-disable react-hooks/immutability, react-hooks/refs */

import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, advance, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { TEMAS, TEMA_PADRAO } from "@/temas/temas";
import { paraLinear } from "@/temas/cor";
import { fragmento, vertice } from "./chuva/shader";
import { CONFIG, Controlador, nivelAbaixo, nivelInicial, type Nivel } from "./qualidade";
import { lerTrilha, medidaRosacea, medirTrilha } from "./trilha";
import { estadoCena, reduzido as movimentoReduzido } from "@/movimento/estado";

// A nave é um chunk próprio: pesa e só importa depois de atravessar o vitral.
const Nave = lazy(() => import("./nave/Nave"));

const PALAVRAS = {
  nome: [22, 0, 17, 11, 4, 24], // WARLEY
  coelho: [18, 8, 6, 0, -1, 14, -1, 2, 14, 4, 11, 7, 14, -1, 1, 17, 0, 13, 2, 14], // SIGA O COELHO BRANCO
};

const temaAtual = () => TEMAS.find((t) => t.id === document.documentElement.dataset.tema) ?? TEMAS.find((t) => t.id === TEMA_PADRAO)!;
const v3 = (hex: string) => new THREE.Vector3(...paraLinear(hex));

export const chuvaPausada = () => {
  try {
    return localStorage.getItem("chuva") === "pausada";
  } catch {
    return false;
  }
};

function criarUniforms(atlas: THREE.Texture) {
  const t = TEMAS[0];
  return {
    uTempo: { value: 0 },
    uQueda: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uEscala: { value: 1 },
    uAtlas: { value: atlas },
    uChuva: { value: v3(t.cores.chuva) },
    uCabeca: { value: v3(t.cores.chuvaCabeca) },
    uFundo: { value: v3(t.cores.fundo) },
    uTinta: { value: v3(t.cores.tinta) },
    uVit0: { value: v3(t.vitral[0]) },
    uVit1: { value: v3(t.vitral[1]) },
    uVit2: { value: v3(t.vitral[2]) },
    uVit3: { value: v3(t.vitral[3]) },
    uCursor: { value: new THREE.Vector2(-999, -999) },
    uForca: { value: 0 },
    uCentro: { value: new THREE.Vector2(0, 0) },
    uRaio: { value: 300 },
    uRosa: { value: 1 },
    uTeto: { value: 10 },
    uClaro: { value: 0 },
    uPalavra: { value: 0 },
    uLetras: { value: [...PALAVRAS.nome, ...new Array(14).fill(0)] as number[] },
    uNLetras: { value: 6 },
    uAceso: { value: 0 },
    uSelo: { value: 0 },
    uCorDivisor: { value: 0 },
    uClarao: { value: 0 },
  };
}

function Chuva({ nivel, parada, aoPronto }: { nivel: Nivel; parada: React.RefObject<boolean>; aoPronto: () => void }) {
  const { size, viewport } = useThree();
  const atlas = useMemo(() => {
    const t = new THREE.TextureLoader().load("/gl/atlas.png", () => (estado.current.carregado = true));
    t.flipY = false;
    t.generateMipmaps = false;
    t.minFilter = t.magFilter = THREE.LinearFilter;
    t.colorSpace = THREE.NoColorSpace;
    return t;
    }, []);
  const estado = useRef({ carregado: false, quadros: 0, queda: 0, tempo: 0, x: -999, y: -999, forca: 0, alvoForca: 0, ultimoX: 0, ultimoY: 0, palavra: 0 });

  const uniformsRef = useRef<ReturnType<typeof criarUniforms> | null>(null);
  const [uniforms] = useState(() => (uniformsRef.current = criarUniforms(atlas)));

  // Cor do tema: aplica ao montar e faz a transição de 800 ms ao trocar.
  useEffect(() => {
    const aplicar = (imediato: boolean) => {
      const t = temaAtual();
      const pares: [THREE.Vector3, string][] = [
        [uniforms.uChuva.value, t.cores.chuva],
        [uniforms.uCabeca.value, t.cores.chuvaCabeca],
        [uniforms.uFundo.value, t.cores.fundo],
        [uniforms.uTinta.value, t.cores.tinta],
        [uniforms.uVit0.value, t.vitral[0]],
        [uniforms.uVit1.value, t.vitral[1]],
        [uniforms.uVit2.value, t.vitral[2]],
        [uniforms.uVit3.value, t.vitral[3]],
      ];
      const uni = uniformsRef.current!;
      uni.uClaro.value = t.esquema === "light" ? 1 : 0;
      for (const [alvo, hex] of pares) {
        const [x, y, z] = paraLinear(hex);
        if (imediato) alvo.set(x, y, z);
        else gsap.to(alvo, { x, y, z, duration: 0.8, ease: "power2.inOut" });
      }
    };
    aplicar(true);
    const obs = new MutationObserver(() => aplicar(movimentoReduzido()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
    return () => obs.disconnect();
  }, [uniforms]);

  // Cursor
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || movimentoReduzido()) return;
    const mover = (e: PointerEvent) => {
      const s = estado.current;
      const v = Math.hypot(e.clientX - s.ultimoX, e.clientY - s.ultimoY);
      s.ultimoX = s.x = e.clientX;
      s.ultimoY = s.y = e.clientY;
      s.alvoForca = Math.min(1, s.alvoForca + v * 0.03);
    };
    addEventListener("pointermove", mover, { passive: true });
    return () => removeEventListener("pointermove", mover);
  }, []);

  const rolagem = useRef({ velocidade: 0, ultimoY: 0 });

  useFrame((_, delta) => {
    const u = uniformsRef.current!;
    const s = estado.current;
    const dt = Math.min(delta, 0.1);
    const parado = parada.current;
    const { p, t, y } = lerTrilha();
    if (!parado) {
      s.tempo += dt;
      // Em Contato a chuva quase para: resta a porta.
      const contato = gsap.utils.clamp(0, 1, (t - 6.1) / 0.5);
      const ritmo = (1 + rolagem.current.velocidade * 1.5) * (1 - 0.85 * contato);
      s.queda += dt * ritmo;
      rolagem.current.velocidade *= 0.94;
    }
    s.alvoForca *= 0.94;
    s.forca += (s.alvoForca - s.forca) * 0.08;
    const dpr = viewport.dpr;
    u.uTempo.value = s.tempo;
    u.uQueda.value = s.queda;
    u.uRes.value.set(size.width * dpr, size.height * dpr);
    u.uEscala.value = dpr;
    u.uCursor.value.set(s.x, s.y);
    u.uForca.value = s.forca;
    rolagem.current.velocidade = Math.max(rolagem.current.velocidade, Math.min(1, Math.abs(y - rolagem.current.ultimoY) / 60));
    rolagem.current.ultimoY = y;
    // A rosácea cresce e some ao atravessar o vidro; depois resta só a chuva tênue.
    const zoom = 1 + 6 * p * p * p;
    const fim = gsap.utils.clamp(0, 1, (p - 0.55) / 0.4);
    u.uRosa.value = 1 - fim;
    const r = medidaRosacea();
    u.uRaio.value = (r.largura / 2) * (100 / 104) * zoom;
    u.uCentro.value.set(gsap.utils.interpolate(r.cx, size.width / 2, p), gsap.utils.interpolate(r.cy, size.height / 2, p));
    u.uTeto.value = gsap.utils.interpolate(10, 0.05, fim);
    // Em quietude, a coluna soletra o nome por um instante.
    if (!parado) {
      const fase = (s.tempo % 26) / 26;
      s.palavra = fase > 0.42 && fase < 0.55 ? Math.min(1, s.palavra + dt * 1.5) : Math.max(0, s.palavra - dt * 1.2);
    }
    u.uPalavra.value = s.palavra * u.uRosa.value;
    // Selo 7 do CTF e recompensas: lidos do estado compartilhado.
    u.uSelo.value = parado ? 1 : 0;
    const seladoAtivo = document.documentElement.dataset.tema === "selado" ? 1 : 0;
    const alvoAceso = Math.max(estadoCena.aceso, seladoAtivo);
    u.uAceso.value += (alvoAceso - u.uAceso.value) * (movimentoReduzido() ? 1 : Math.min(1, dt * 2));
    const dentroAgora = t >= 1 && t < 2 ? 1 : 0;
    u.uCorDivisor.value += (estadoCena.corDivisor * dentroAgora - u.uCorDivisor.value) * (movimentoReduzido() ? 1 : Math.min(1, dt * 1.5));
    if (estadoCena.coelho && u.uNLetras.value !== PALAVRAS.coelho.length) {
      u.uLetras.value = PALAVRAS.coelho;
      u.uNLetras.value = PALAVRAS.coelho.length;
    }
    // Clarão: um pulso só, centrado no instante em que a câmera atravessa o vidro. Nunca pisca.
    const distancia = Math.abs(p - 0.82);
    u.uClarao.value = movimentoReduzido() ? 0 : Math.max(0, 1 - distancia / 0.14) ** 2 * 0.09;
    if (s.carregado && s.quadros < 3 && ++s.quadros === 3) aoPronto();
  });

  // Material criado à mão: como prop JSX, os invólucros dos uniforms são copiados e valores numéricos não chegam ao shader.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertice,
        fragmentShader: fragmento,
        uniforms,
        defines: { CAMADAS: CONFIG[nivel].camadas },
        toneMapped: false,
        depthTest: false,
        depthWrite: false,
      }),
    [nivel, uniforms],
  );
  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh frustumCulled={false} material={material} renderOrder={-1000}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

function Pos() {
  // No tema claro não há luz: bloom estouraria o papel para branco, e a vinheta o escureceria além do limite de leitura.
  const [claro, setClaro] = useState(() => temaAtual().esquema === "light");
  useEffect(() => {
    const obs = new MutationObserver(() => setClaro(temaAtual().esquema === "light"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
    return () => obs.disconnect();
  }, []);
  return (
    <EffectComposer multisampling={0} enableNormalPass={false} depthBuffer>
      <Bloom mipmapBlur intensity={claro ? 0 : 0.85} luminanceThreshold={0.42} luminanceSmoothing={0.3} radius={0.72} />
      <Noise opacity={0.045} premultiply />
      <Vignette eskil={false} offset={0.3} darkness={claro ? 0 : 0.55} />
    </EffectComposer>
  );
}

class Barreira extends Component<{ children: ReactNode }, { erro: boolean }> {
  state = { erro: false };
  static getDerivedStateFromError() {
    return { erro: true };
  }
  render() {
    return this.state.erro ? null : this.props.children;
  }
}

export default function Experiencia({ fracoes }: { fracoes: number[] }) {
  const [nivel, setNivel] = useState<Nivel>(() => (typeof window === "undefined" ? "medio" : nivelInicial()));
  const [dpr, setDpr] = useState(() => (typeof window === "undefined" ? 1 : Math.min(devicePixelRatio, CONFIG[nivelInicial()].dprMax)));
  const parada = useRef(false);
  const sujo = useRef(4);

  // Relógio único: a cena avança no mesmo ticker que conduz Lenis e ScrollTrigger (src/movimento/relogio.ts).
  useEffect(() => {
    const reduzido = movimentoReduzido();
    parada.current = reduzido || chuvaPausada();

    let anterior = performance.now();
    const controlador = new Controlador(
      () => {
        setDpr((d) => {
          if (d > 1) return Math.max(1, d - 0.25);
          setNivel((n) => nivelAbaixo(n) ?? n);
          return d;
        });
      },
      () => setDpr((d) => Math.min(CONFIG[nivel].dprMax, Math.min(devicePixelRatio, d + 0.25))),
    );

    const pulso = () => {
      const agora = performance.now();
      if (estadoCena.sujo > 0) {
        // Com movimento reduzido nada suaviza: poucos quadros bastam, e o grão não fica cintilando.
        sujo.current = Math.max(sujo.current, reduzido ? 4 : estadoCena.sujo);
        estadoCena.sujo = 0;
      }
      if (document.hidden) return;
      if (parada.current && sujo.current <= 0) return;
      if (sujo.current > 0) sujo.current--;
      controlador.medir(agora - anterior);
      anterior = agora;
      advance(agora);
    };
    gsap.ticker.add(pulso);

    const marcar = () => {
      // Com movimento reduzido a câmera não suaviza: poucos quadros bastam.
      sujo.current = Math.max(sujo.current, reduzido ? 4 : 40);
    };
    medirTrilha();
    const remedir = () => {
      medirTrilha();
      marcar();
    };
    const tamanho = new ResizeObserver(remedir);
    tamanho.observe(document.body);
    addEventListener("scroll", marcar, { passive: true });
    addEventListener("resize", remedir);
    const aoPausar = (e: Event) => {
      parada.current = (e as CustomEvent<boolean>).detail || reduzido;
      marcar();
    };
    addEventListener("nave:chuva", aoPausar);
    const obs = new MutationObserver(() => {
      sujo.current = reduzido ? 4 : 60;
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });

    return () => {
      gsap.ticker.remove(pulso);
      tamanho.disconnect();
      removeEventListener("scroll", marcar);
      removeEventListener("resize", remedir);
      removeEventListener("nave:chuva", aoPausar);
      obs.disconnect();
    };
  }, [nivel]);

  const aoPronto = () => document.querySelector(".palco")?.setAttribute("data-pronta", "sim");

  return (
    <Barreira>
      <Canvas
        frameloop="never"
        dpr={dpr}
        flat
        linear={false}
        camera={{ position: [0, 4.5, 6], fov: 56, near: 0.1, far: 140 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false, depth: true }}
        aria-hidden="true"
        tabIndex={-1}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", () => {
            document.querySelector(".palco")?.setAttribute("data-pronta", "nao");
          });
          sujo.current = 8;
        }}
      >
        <Chuva nivel={nivel} parada={parada} aoPronto={aoPronto} />
        {CONFIG[nivel].nave ? (
          <Suspense fallback={null}>
            <Nave relicario={CONFIG[nivel].relicario} atmosfera={CONFIG[nivel].atmosfera} fracoes={fracoes} />
          </Suspense>
        ) : null}
        {CONFIG[nivel].pos ? <Pos /> : null}
      </Canvas>
    </Barreira>
  );
}
