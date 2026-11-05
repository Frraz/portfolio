/**
 * Storyboard da rolagem: um momento por seção. Especificação em docs/06-motion-e-webgl.md.
 * Regra: o HTML já é o estado final. Nada aqui é necessário para ler o site.
 * Só animamos transform, opacity, filter, clip-path e variáveis que alimentam esses valores.
 */
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, SplitText);

const q = <T extends Element = HTMLElement>(s: string, raiz: ParentNode = document) => [...raiz.querySelectorAll<T>(s)];
const ponteiroFino = () => matchMedia("(pointer: fine)").matches;

function travessia() {
  const trilho = document.querySelector<HTMLElement>(".hero-trilho");
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!trilho || !hero) return;
  // O título já está na tela: a luz o atravessa, sem esconder nada.
  const titulo = hero.querySelector("h1");
  if (titulo) {
    // Espera a cena subir: nenhuma animação roda enquanto o carregamento ocupa a thread principal.
    document.fonts.ready.then(() => new Promise((ok) => gsap.delayedCall(1.1, ok))).then(() => {
      if (scrollY > 40) return;
      const div = SplitText.create(titulo, { type: "chars", aria: "auto" });
      gsap.fromTo(
        div.chars,
        { filter: "brightness(1)" },
        { filter: "brightness(2.1)", duration: 0.32, stagger: 0.028, repeat: 1, yoyo: true, ease: "sine.inOut", onComplete: () => div.revert() },
      );
    });
  }
  // Ao rolar, o texto sai antes de a nave chegar.
  const linha = gsap.timeline({ scrollTrigger: { trigger: trilho, start: "top top", end: "bottom bottom", scrub: true } });
  linha.to(q(".hero-veu", hero), { opacity: 0, duration: 0.5, ease: "none" }, 0.1);
  linha.to(q(".hero > :not(.hero-veu)", hero), { autoAlpha: 0, y: -36, duration: 0.3, stagger: 0.015, ease: "power1.in" }, 0.14);
  linha.set({}, {}, 1);
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

/** Halo quente atrás do texto, em Sobre e Contato. O cursor nativo continua visível. */
function vela() {
  const palco = document.querySelector(".palco");
  if (!palco || !ponteiroFino()) return () => {};
  const halo = document.createElement("div");
  halo.className = "vela";
  palco.appendChild(halo);
  const x = gsap.quickTo(halo, "x", { duration: 0.55, ease: "power3" });
  const y = gsap.quickTo(halo, "y", { duration: 0.55, ease: "power3" });
  const inicial = document.querySelector<HTMLElement>(".sobre-lead");
  const mover = (e: PointerEvent) => {
    x(e.clientX);
    y(e.clientY);
    inicial?.style.setProperty("--folha", `${(e.clientX / innerWidth) * 140 + 20}deg`);
  };
  addEventListener("pointermove", mover, { passive: true });
  for (const id of ["#sobre", "#contato"]) {
    ScrollTrigger.create({
      trigger: id,
      start: "top 70%",
      end: "bottom 30%",
      onToggle: (st) => gsap.to(halo, { opacity: st.isActive ? 1 : 0, duration: 0.4, overwrite: "auto" }),
    });
  }
  return () => {
    removeEventListener("pointermove", mover);
    halo.remove();
  };
}

/** O momento em tela branca: um evento único, sem pisca-pisca. */
function telaBranca() {
  const el = document.querySelector<HTMLElement>(".inicial");
  const letra = el?.querySelector("span");
  if (!el || !letra) return;
  if (el.getBoundingClientRect().top < innerHeight * 0.65) return;
  gsap.set(el, { "--papel-luz": 0 });
  gsap.set(letra, { opacity: 0, scale: 0.96 });
  const linha = gsap.timeline({ paused: true });
  linha.to(el, { "--papel-luz": 1, duration: 0.9, ease: "power2.inOut" }, 0);
  linha.to(letra, { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }, 0.35);
  ScrollTrigger.create({ trigger: el, start: "top 62%", once: true, onEnter: () => linha.play() });
}

function arvore() {
  const svg = document.querySelector<SVGSVGElement>(".arvore");
  if (!svg) return;
  const ramos = q<SVGPathElement>(":scope > path", svg);
  const nos = q<SVGCircleElement>(":scope > circle", svg);
  gsap.set(nos, { transformOrigin: "50% 50%" });
  const linha = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 72%", end: "top 8%", scrub: true } });
  linha.fromTo(nos[0], { scale: 0.4 }, { scale: 1, duration: 0.1 }, 0);
  ramos.forEach((r, i) => {
    // Cada ramo tem seu nível: a luz se divide 1:2, 1:4 e 1:8 na ordem real.
    const nivel = Number(r.dataset.nivel ?? 1);
    linha.fromTo(r, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3, ease: "none" }, (nivel - 1) * 0.3 + i * 0.0005);
  });
  nos.slice(1).forEach((n) => {
    const nivel = Number(n.dataset.nivel ?? 1);
    linha.fromTo(n, { scale: 0, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 0.08 }, nivel * 0.3 - 0.04);
  });
}

function trajetoria() {
  for (const passo of q(".passo")) {
    const ano = passo.querySelector(".passo-ano");
    ScrollTrigger.create({
      trigger: passo,
      start: "top 78%",
      onEnter: () => {
        passo.dataset.aceso = "sim";
        if (ano?.textContent) gsap.fromTo(ano, { opacity: 0.2, filter: "blur(3px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out", clearProps: "filter" });
      },
      onLeaveBack: () => {
        passo.dataset.aceso = "nao";
      },
    });
  }
}

function lancetas() {
  const janelas = q(".lanceta-janela");
  if (!janelas.length) return;
  const linha = gsap.timeline({ scrollTrigger: { trigger: ".lancetas", start: "top 78%", end: "top 22%", scrub: true } });
  janelas.forEach((j, i) => {
    const fim = Number(getComputedStyle(j).getPropertyValue("--luz")) || 0;
    linha.fromTo(j, { "--luz": 0 }, { "--luz": fim, duration: 1, ease: "none" }, i * 0.08);
  });
}

/** Fileiras entram pelo mesmo arco: nunca começam de todo escondidas. */
function fileiras() {
  for (const f of q(".fileira")) {
    gsap.fromTo(
      f,
      { clipPath: "inset(0% 34% 0% 34% round 40% 40% 0 0)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 0% 0% 0 0)",
        duration: 0.7,
        ease: "power2.out",
        clearProps: "clipPath",
        scrollTrigger: { trigger: f, start: "top 88%", once: true },
      },
    );
  }
}

/** Portas reais: ao escolher um filtro, duas folhas de ouro se abrem sobre as fileiras. */
function portas() {
  const alvo = document.querySelector<HTMLElement>('[data-grupo-filtro="area"]');
  if (!alvo) return () => {};
  const criar = (lado: string) => {
    const d = document.createElement("div");
    d.className = `porta porta-${lado}`;
    d.setAttribute("aria-hidden", "true");
    alvo.appendChild(d);
    return d;
  };
  const esq = criar("esq");
  const dir = criar("dir");
  gsap.set([esq, dir], { scaleX: 0 });
  const abrir = (e: Event) => {
    if ((e as CustomEvent<{ grupo: string }>).detail?.grupo !== "area") return;
    gsap.killTweensOf([esq, dir]);
    gsap.fromTo([esq, dir], { scaleX: 1, opacity: 0.9 }, { scaleX: 0, opacity: 0.5, duration: 0.5, ease: "power3.inOut" });
  };
  addEventListener("nave:filtro", abrir);
  return () => {
    removeEventListener("nave:filtro", abrir);
    esq.remove();
    dir.remove();
  };
}

/** Selo: inclinação leve com o cursor, e a folha de ouro responde ao ângulo. */
function selos() {
  const lista = document.querySelector<HTMLElement>(".relicario");
  if (!lista || !ponteiroFino()) return () => {};
  // Um único tween por selo, reaproveitado: pointermove dispara muito.
  const movers = new WeakMap<HTMLElement, { rx: gsap.QuickToFunc; ry: gsap.QuickToFunc }>();
  const pegar = (el: HTMLElement) => {
    let m = movers.get(el);
    if (!m) {
      gsap.set(el, { transformPerspective: 900 });
      m = { rx: gsap.quickTo(el, "rotateX", { duration: 0.25, ease: "power2.out" }), ry: gsap.quickTo(el, "rotateY", { duration: 0.25, ease: "power2.out" }) };
      movers.set(el, m);
    }
    return m;
  };
  let atual: HTMLElement | null = null;
  const soltar = (el: HTMLElement) => {
    const m = pegar(el);
    m.rx(0);
    m.ry(0);
    el.dataset.brilho = "nao";
  };
  const mover = (e: PointerEvent) => {
    const el = (e.target as Element).closest<HTMLElement>(".selo");
    if (atual && el !== atual) soltar(atual);
    atual = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const m = pegar(el);
    m.ry(px * 2.4);
    m.rx(-py * 5);
    el.dataset.brilho = "sim";
    el.style.setProperty("--angulo", `${px * 120 + 90}deg`);
  };
  const sair = () => {
    if (atual) soltar(atual);
    atual = null;
  };
  lista.addEventListener("pointermove", mover);
  lista.addEventListener("pointerleave", sair);
  return () => {
    lista.removeEventListener("pointermove", mover);
    lista.removeEventListener("pointerleave", sair);
  };
}

/** Fio de luz na lateral: acompanha a página inteira. É um elemento do DOM, sem relação com a cena. */
function fibra() {
  const fio = document.querySelector(".fibra-luz");
  if (!fio) return;
  gsap.fromTo(fio, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
}

export function montarStoryboard() {
  const contexto = gsap.context(() => {
    travessia();
    telaBranca();
    arvore();
    trajetoria();
    lancetas();
    fileiras();
    fibra();
  });
  const limpezas = [magnetico(), vela(), portas(), selos()];
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  return () => {
    limpezas.forEach((f) => f());
    contexto.revert();
  };
}
