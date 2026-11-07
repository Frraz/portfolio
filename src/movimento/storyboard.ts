/**
 * Storyboard da rolagem: um momento por seção. Especificação em docs/06-motion-e-webgl.md.
 * Regra: o HTML já é o estado final. Nada aqui é necessário para ler o site.
 * Só animamos transform, opacity, filter, clip-path e variáveis que alimentam esses valores.
 */
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fracaoDecorrida } from "@/formatos";

gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

const q = <T extends Element = HTMLElement>(s: string, raiz: ParentNode = document) => [...raiz.querySelectorAll<T>(s)];
const ponteiroFino = () => matchMedia("(pointer: fine)").matches;

/** Início: o nome nasce condensado e se expande uma vez, quando a cena chega. A máscara da chuva acompanha a largura. */
function nome() {
  const h1 = document.querySelector<HTMLElement>(".hero h1");
  if (!h1) return;
  // A largura final vem do token: a mesma do CSS sem JavaScript.
  const largura = getComputedStyle(document.documentElement).getPropertyValue("--larg-nome").trim() || "112%";
  const final = () => h1.style.setProperty("font-stretch", largura);
  if (scrollY > 40) return final();
  // Espera a cena subir: nenhuma animação roda enquanto o carregamento ocupa a thread principal.
  document.fonts.ready
    .then(() => new Promise((ok) => gsap.delayedCall(1.0, ok)))
    .then(() => {
      if (scrollY > 40) return final();
      gsap.fromTo(h1, { fontStretch: "75%" }, { fontStretch: largura, duration: 1.1, ease: "power3.out" });
    });
}

/** Títulos de seção decodificam uma vez, ao entrar. O nome acessível é fixado antes: o embaralhamento nunca é lido. */
function titulos() {
  for (const el of q(".titulo-secao")) {
    const texto = el.textContent ?? "";
    el.setAttribute("aria-label", texto);
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => gsap.to(el, { duration: 0.6, ease: "none", scrambleText: { text: texto, chars: "0123456789ABCDEF", speed: 0.9 } }),
    });
  }
}

function magnetico() {
  if (!ponteiroFino()) return () => {};
  const limpar: (() => void)[] = [];
  for (const el of q("[data-magnetico]")) {
    const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.22);
      y((e.clientY - r.top - r.height / 2) * 0.3);
    };
    const sair = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", sair);
    limpar.push(() => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", sair);
    });
  }
  return () => limpar.forEach((f) => f());
}

/** Trajetória: um pacote percorre o traceroute com a rolagem, e cada salto acende quando o pacote chega. */
function traceroute() {
  const lista = document.querySelector<HTMLElement>(".traceroute");
  if (!lista) return;
  ScrollTrigger.create({
    trigger: lista,
    start: "top 65%",
    end: "bottom 45%",
    scrub: true,
    onUpdate: (st) => lista.style.setProperty("--pacote", st.progress.toFixed(4)),
  });
  for (const salto of q(".salto", lista)) {
    ScrollTrigger.create({
      trigger: salto,
      start: "top 70%",
      onEnter: () => (salto.dataset.aceso = "sim"),
      onLeaveBack: () => (salto.dataset.aceso = "nao"),
    });
  }
}

/** Formação: os blocos se enchem em degraus. O curso em andamento usa a data de hoje, e não a do build. */
function blocos() {
  for (const bloco of q(".bloco")) {
    let alvo = Number(getComputedStyle(bloco).getPropertyValue("--preenche")) || 1;
    if (bloco.dataset.andamento === "sim" && bloco.dataset.inicio && bloco.dataset.fim) {
      alvo = fracaoDecorrida(bloco.dataset.inicio, bloco.dataset.fim);
      const pct = bloco.querySelector(".bloco-pct");
      if (pct) pct.textContent = `${Math.round(alvo * 100)}%`;
    }
    gsap.fromTo(
      bloco,
      { "--preenche": 0 },
      { "--preenche": alvo, duration: 0.9, ease: "steps(14)", scrollTrigger: { trigger: bloco, start: "top 85%", once: true } },
    );
  }
}

export function montarStoryboard() {
  const contexto = gsap.context(() => {
    nome();
    titulos();
    traceroute();
    blocos();
  });
  const limpezas = [magnetico()];
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  return () => {
    limpezas.forEach((f) => f());
    contexto.revert();
  };
}
