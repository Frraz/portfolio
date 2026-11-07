"use client";

/* Cena WebGL: uniforms são estado mutável a cada quadro, fora do ciclo de render do React. */
/* eslint-disable react-hooks/refs */

import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, advance, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { TEMAS, TEMA_PADRAO } from "@/temas/temas";
import { luminancia, paraLinear, tetoDeLuz } from "@/temas/cor";
import { fragmento, vertice } from "./chuva/shader";
import { CELULA, criarMascara } from "./chuva/mascara";
import { partilha } from "./forma/partilha";
import { CONFIG, Controlador, nivelAbaixo, nivelInicial, type Nivel } from "./qualidade";
import { lerTrilha, medirTrilha } from "./trilha";
import { registrar } from "@/movimento/registro";
import { estadoCena, hud, reduzido as movimentoReduzido } from "@/movimento/estado";

// As formas das seções são um chunk próprio: só baixa depois da pintura.
const Forma = lazy(() => import("./forma/Forma"));

/** A queda das colunas anda a 60% da velocidade original: de 2,4 a 10,8 células por segundo. */
const RITMO_BASE = 0.6;

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

function criarUniforms(atlas: THREE.Texture, mascara: THREE.Texture) {
  const t = temaAtual();
  return {
    uTempo: { value: 0 },
    uQueda: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uEscala: { value: 1 },
    uAtlas: { value: atlas },
    uMascara: { value: mascara },
    uChuva: { value: v3(t.cores.chuva) },
    uCabeca: { value: v3(t.cores.chuvaCabeca) },
    uFundo: { value: v3(t.cores.fundo) },
    uTinta: { value: v3(t.cores.tinta) },
    uForma: { value: v3(t.cores.forma) },
    uTrava: { value: 0 },
    uMascaraInv: { value: 0 },
    uLivreX: { value: 1e5 },
    uGanho: { value: 0.9 },
    uTeto: { value: 10 },
    uClaro: { value: t.esquema === "light" ? 1 : 0 },
    uPalavra: { value: 0 },
    uPalavraPos: { value: new THREE.Vector2(0, 0) },
    uLetras: { value: [...PALAVRAS.nome, ...new Array(14).fill(0)] as number[] },
    uNLetras: { value: 6 },
    uAceso: { value: 0 },
    uSelo: { value: 0 },
    uSeloPos: { value: new THREE.Vector2(0, 0) },
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
  const estado = useRef({ carregado: false, quadros: 0, queda: 0, tempo: 0, palavra: 0, trava: 0 });
  const mascara = useMemo(() => criarMascara(), []);
  useEffect(() => () => mascara.liberar(), [mascara]);

  const uniformsRef = useRef<ReturnType<typeof criarUniforms> | null>(null);
  const [uniforms] = useState(() => (uniformsRef.current = criarUniforms(atlas, mascara.textura)));

  // Cor do tema: aplica ao montar e faz a transição de 800 ms ao trocar.
  useEffect(() => {
    const aplicar = (imediato: boolean) => {
      const t = temaAtual();
      const pares: [THREE.Vector3, string][] = [
        [uniforms.uChuva.value, t.cores.chuva],
        [uniforms.uCabeca.value, t.cores.chuvaCabeca],
        [uniforms.uFundo.value, t.cores.fundo],
        [uniforms.uTinta.value, t.cores.tinta],
        [uniforms.uForma.value, t.cores.forma],
      ];
      uniformsRef.current!.uClaro.value = t.esquema === "light" ? 1 : 0;
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

  const rolagem = useRef({ velocidade: 0, ultimoY: 0 });

  useFrame((_, delta) => {
    const u = uniformsRef.current!;
    const s = estado.current;
    const dt = Math.min(delta, 0.1);
    const parado = parada.current;
    const reduzido = movimentoReduzido();
    const { t, y, secao, p } = lerTrilha();
    if (!parado) {
      s.tempo += dt;
      // Em Contato a chuva quase para.
      const contato = gsap.utils.clamp(0, 1, (t - 6.1) / 0.5);
      const ritmo = RITMO_BASE * (1 + rolagem.current.velocidade * 1.5) * (1 - 0.85 * contato);
      s.queda += dt * ritmo;
      rolagem.current.velocidade *= 0.94;
    }
    const dpr = viewport.dpr;
    u.uTempo.value = s.tempo;
    u.uQueda.value = s.queda;
    u.uRes.value.set(size.width * dpr, size.height * dpr);
    u.uEscala.value = dpr;
    rolagem.current.velocidade = Math.max(rolagem.current.velocidade, Math.min(1, Math.abs(y - rolagem.current.ultimoY) / 60));
    rolagem.current.ultimoY = y;

    // Travamento: depois que a cena chega, os glifos param no desenho do nome. Some conforme a página rola.
    const nomeMudou = mascara.atualizar(size.width, size.height);
    if (s.carregado) s.trava = reduzido ? 1 : Math.min(1, s.trava + dt / 1.4);
    const sai = gsap.utils.clamp(0, 1, (y - size.height * 0.1) / (size.height * 0.55));
    // A máscara vem do alvo 3D da cena, que já esvazia fora das seções com forma. Até ele existir, vale a máscara 2D do nome.
    const alvo3d = !!partilha.mascaraA;
    u.uMascara.value = alvo3d ? partilha.mascaraA! : mascara.textura;
    u.uMascaraInv.value = alvo3d ? 1 : 0;
    u.uTrava.value = s.trava * (alvo3d ? 1 : 1 - sai);
    // Fora do hero a chuva é tênue e o teto de luz protege o texto.
    const tema = temaAtual();
    // O vermelho tem muito menos luminância que o verde: o ganho do hero compensa, para a chuva ter o mesmo peso em cada tema.
    const ganhoHero = 0.9 * Math.sqrt(0.5 / Math.max(luminancia(tema.cores.chuva), 0.05));
    u.uGanho.value = gsap.utils.interpolate(Math.min(ganhoHero, 1.8), 0.2, sai);
    u.uTeto.value = gsap.utils.interpolate(10, tetoDeLuz(tema.cores.tinta2, tema.esquema === "dark"), sai);
    // Em tela larga, a faixa da direita não tem texto: as formas podem passar do teto ali.
    u.uLivreX.value = size.width >= 1200 ? size.width * 0.58 : 1e5;
    Object.assign(partilha, { secao, p, largura: size.width, altura: size.height, colunas: Math.ceil(size.width / CELULA), fileiras: Math.ceil(size.height / CELULA), teto: u.uTeto.value, livreX: u.uLivreX.value, tempo: s.tempo, nomeCanvas: mascara.canvas, nomeMudou, parada: parado });

    // Em quietude, uma coluna soletra o nome por um instante.
    if (!parado) {
      const fase = (s.tempo % 26) / 26;
      s.palavra = fase > 0.42 && fase < 0.55 ? Math.min(1, s.palavra + dt * 1.5) : Math.max(0, s.palavra - dt * 1.2);
    }
    u.uPalavra.value = s.palavra * (1 - sai);
    u.uPalavraPos.value.set(size.width * 0.82, size.height * 0.22);
    // Flag 8 do CTF: só com a chuva parada.
    u.uSelo.value = parado ? 1 : 0;
    u.uSeloPos.value.set(size.width * 0.92, size.height * 0.22);
    u.uAceso.value += (estadoCena.aceso - u.uAceso.value) * (reduzido ? 1 : Math.min(1, dt * 2));
    if (estadoCena.coelho && u.uNLetras.value !== PALAVRAS.coelho.length) {
      u.uLetras.value = PALAVRAS.coelho;
      u.uNLetras.value = PALAVRAS.coelho.length;
    }
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

export default function Experiencia() {
  const [nivel, setNivel] = useState<Nivel>(() => (typeof window === "undefined" ? "medio" : nivelInicial()));
  const [dpr, setDpr] = useState(() => (typeof window === "undefined" ? 1 : Math.min(devicePixelRatio, CONFIG[nivelInicial()].dprMax)));
  const parada = useRef(false);
  const sujo = useRef(4);
  useEffect(() => {
    hud.cena = "ativa";
    hud.nivel = nivel;
    registrar("info", `cena: ${nivel}`);
  }, [nivel]);

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
      // Com movimento reduzido nada suaviza: poucos quadros bastam.
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
    // As fontes mudam a largura do nome: a máscara precisa redesenhar.
    document.fonts.ready.then(marcar);

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
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false, depth: false }}
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
        <Suspense fallback={null}>
          <Forma />
        </Suspense>
        {CONFIG[nivel].pos ? <Pos /> : null}
      </Canvas>
    </Barreira>
  );
}
