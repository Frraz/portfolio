"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu } from "@base-ui/react/menu";
import { LazyMotion, domAnimation, m } from "motion/react";
import { Palette, Pause, Play, SquareTerminal, Volume2, VolumeX } from "lucide-react";
import { ctfCompleto } from "@/ctf/progresso";
import { TEMAS, type Tema } from "@/temas/temas";
import { trocarTema } from "@/temas/trocar";

const NOME_TEMA: Record<Tema["id"], string> = { ouro: "temaOuro", fosforo: "temaFosforo", rubro: "temaRubro", purpura: "temaPurpura", pergaminho: "temaPergaminho", selado: "temaSelado" };
const MOLA = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 } as const;

type Props = {
  secoes: { id: string; rotulo: string; numero: number }[];
  ui: Record<string, string>;
  prefixo: string;
  naInicial: boolean;
  pausada: boolean;
  alternarChuva: () => void;
  somLigado: boolean;
  alternarSomBarra: () => void;
  abrirTerminal: () => void;
};

export default function BarraMenus({ secoes, ui, prefixo, naInicial, pausada, alternarChuva, somLigado, alternarSomBarra, abrirTerminal }: Props) {
  const [indice, setIndice] = useState(false);
  const [selado, setSelado] = useState(false);
  useEffect(() => {
    const ler = () => setSelado(ctfCompleto());
    ler();
    addEventListener("nave:selo", ler);
    return () => removeEventListener("nave:selo", ler);
  }, []);
  const temas = TEMAS.filter((t) => !t.oculto || selado);
  return (
    <LazyMotion features={domAnimation}>
        <button type="button" className="botao-quieto so-largo" aria-pressed={somLigado} aria-label={somLigado ? ui.desligarSom : ui.ligarSom} title={somLigado ? ui.desligarSom : ui.ligarSom} onClick={alternarSomBarra}>
          {somLigado ? <Volume2 size={16} strokeWidth={1.5} aria-hidden="true" /> : <VolumeX size={16} strokeWidth={1.5} aria-hidden="true" />}
        </button>
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
                {temas.map((t) => (
                  <Menu.Item key={t.id} className="menu-item" onClick={() => trocarTema(t.id)}>
                    <span className="amostra" data-tema={t.id} style={{ background: "var(--acento)" }} aria-hidden="true" />
                    {ui[NOME_TEMA[t.id]]}
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
                  {temas.map((t) => (
                    <button key={t.id} type="button" className="botao-quieto" onClick={() => trocarTema(t.id)}>
                      <span className="amostra" data-tema={t.id} style={{ background: "var(--acento)" }} aria-hidden="true" />
                      {ui[NOME_TEMA[t.id]]}
                    </button>
                  ))}
                </div>
                {naInicial ? (
                  <button type="button" className="botao-quieto" aria-pressed={pausada} onClick={alternarChuva}>
                    {pausada ? <Play size={16} strokeWidth={1.5} aria-hidden="true" /> : <Pause size={16} strokeWidth={1.5} aria-hidden="true" />}
                    {pausada ? ui.ligarChuva : ui.pausarChuva}
                  </button>
                ) : null}
                <button type="button" className="botao-quieto" aria-pressed={somLigado} onClick={alternarSomBarra}>
                  {somLigado ? <Volume2 size={16} strokeWidth={1.5} aria-hidden="true" /> : <VolumeX size={16} strokeWidth={1.5} aria-hidden="true" />}
                  {somLigado ? ui.desligarSom : ui.ligarSom}
                </button>
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
