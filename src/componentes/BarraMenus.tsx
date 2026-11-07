"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu } from "@base-ui/react/menu";
import { LazyMotion, domAnimation, m } from "motion/react";
import { Palette, SquareTerminal } from "lucide-react";
import { IconePausar, IconeTocar } from "./Icones";
import { ctfCompleto } from "@/ctf/progresso";
import { TEMAS, type Tema } from "@/temas/temas";
import { trocarTema } from "@/temas/trocar";

const NOME_TEMA: Record<Tema["id"], string> = { rubro: "temaRubro", claro: "temaClaro", fosforo: "temaFosforo" };
const MOLA = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 } as const;

type Props = {
  secoes: { id: string; rotulo: string; numero: number }[];
  ui: Record<string, string>;
  prefixo: string;
  naInicial: boolean;
  pausada: boolean;
  alternarChuva: () => void;
  abrirTerminal: () => void;
};

export default function BarraMenus({ secoes, ui, prefixo, naInicial, pausada, alternarChuva, abrirTerminal }: Props) {
  const [indice, setIndice] = useState(false);
  const [selado, setSelado] = useState(false);
  useEffect(() => {
    const ler = () => setSelado(ctfCompleto());
    ler();
    addEventListener("sinal:selo", ler);
    return () => removeEventListener("sinal:selo", ler);
  }, []);
  // O Fósforo é o prêmio do CTF (decisão 59): aparece sempre, mas só fica disponível com os nove selos.
  const bloqueado = (t: Tema) => Boolean(t.oculto) && !selado;
  const nomeTema = (t: Tema) => (bloqueado(t) ? ui.temaFosforoBloqueado : ui[NOME_TEMA[t.id]]);
  return (
    <LazyMotion features={domAnimation}>
        <button type="button" className="botao-quieto so-largo" aria-label={ui.terminal} title={ui.terminal} onClick={abrirTerminal}>
          <SquareTerminal size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <Menu.Root modal={false}>
          <Menu.Trigger className="botao-quieto sem-js-oculto so-largo" aria-label={ui.tema} title={ui.tema}>
            <Palette size={16} strokeWidth={1.5} aria-hidden="true" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={6} align="end" style={{ zIndex: 70 }}>
              <Menu.Popup className="menu-tema">
                {TEMAS.map((t) => (
                  <Menu.Item key={t.id} className="menu-item" disabled={bloqueado(t)} title={bloqueado(t) ? ui.temaFosforoDica : undefined} onClick={() => trocarTema(t.id)}>
                    <span className="amostra-tema" data-tema={t.id} aria-hidden="true" />
                    {nomeTema(t)}
                  </Menu.Item>
                ))}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
        <Dialog.Root open={indice} onOpenChange={setIndice}>
          <Dialog.Trigger className="botao-quieto so-compacto sem-js-oculto">{ui.indice}</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Popup className="indice-tela">
              <Dialog.Title style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>{ui.indice}</Dialog.Title>
              <Dialog.Close className="botao-quieto" style={{ position: "absolute", top: "0.75rem", right: "clamp(1rem, 3vw, 2.5rem)" }}>
                {ui.fechar}
              </Dialog.Close>
              <ul className="indice-lista">
                {secoes.map((s, i) => (
                  <m.li key={s.id} initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...MOLA, delay: i * 0.025 }}>
                    <a className="indice-link" href={`${prefixo}#${s.id}`} onClick={() => setIndice(false)}>
                      <small aria-hidden="true">{s.numero}</small>
                      {s.rotulo}
                    </a>
                  </m.li>
                ))}
              </ul>
              <div className="indice-rodape">
                <div className="indice-temas" role="group" aria-label={ui.tema}>
                  {TEMAS.map((t) => (
                    <button key={t.id} type="button" className="botao-quieto" disabled={bloqueado(t)} title={bloqueado(t) ? ui.temaFosforoDica : undefined} onClick={() => trocarTema(t.id)}>
                      <span className="amostra-tema" data-tema={t.id} aria-hidden="true" />
                      {nomeTema(t)}
                    </button>
                  ))}
                </div>
                {naInicial ? (
                  <button type="button" className="botao-quieto" aria-pressed={pausada} onClick={alternarChuva}>
                    {pausada ? <IconeTocar /> : <IconePausar />}
                    {pausada ? ui.ligarChuva : ui.pausarChuva}
                  </button>
                ) : null}
                <button
                  type="button"
                  className="botao-quieto"
                  onClick={() => {
                    setIndice(false);
                    abrirTerminal();
                  }}
                >
                  <SquareTerminal size={16} strokeWidth={1.5} aria-hidden="true" />
                  {ui.terminal}
                </button>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
    </LazyMotion>
  );
}
