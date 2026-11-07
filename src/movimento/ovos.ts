/** Easter eggs e recompensas. Nada aqui afirma competência do titular nem coleta dados do visitante. */
import { ctfCompleto } from "@/ctf/progresso";
import { estadoCena, reduzido } from "./estado";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function assinatura() {
  const c = getComputedStyle(document.documentElement);
  const cor = c.getPropertyValue("--acento") || "currentColor";
  console.log("%cWarley Ferraz Almeida", `font: 600 20px serif; color: ${cor}`);
  console.log("Site estático, sem servidor de aplicação. O currículo direto está em /cv.");
  console.log("Há nove selos escondidos à vista de todos. Você não precisa atacar nada: abra o terminal (Ctrl+K) e digite selos.");
  console.log("selo 1: CONSOLE-ABERTO");
}

export function montarOvos() {
  assinatura();
  let posicao = 0;
  let temporizador = 0;
  const tecla = (e: KeyboardEvent) => {
    posicao = e.key === KONAMI[posicao] ? posicao + 1 : e.key === KONAMI[0] ? 1 : 0;
    if (posicao < KONAMI.length) return;
    posicao = 0;
    estadoCena.aceso = 1;
    estadoCena.sujo = 90;
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(() => {
      estadoCena.aceso = 0;
      estadoCena.sujo = 90;
    }, 20_000);
  };
  addEventListener("keydown", tecla);

  const premio = async () => {
    if (!ctfCompleto()) return;
    estadoCena.coelho = true;
    estadoCena.sujo = 90;
    if (reduzido()) return;
    const { coelhoBranco } = await import("./coelho");
    coelhoBranco();
  };
  const aoSelo = (e: Event) => {
    if ((e as CustomEvent<{ total: number }>).detail?.total === 9) premio();
  };
  addEventListener("nave:selo", aoSelo);
  if (ctfCompleto()) estadoCena.coelho = true;

  return () => {
    removeEventListener("keydown", tecla);
    removeEventListener("nave:selo", aoSelo);
    window.clearTimeout(temporizador);
  };
}
