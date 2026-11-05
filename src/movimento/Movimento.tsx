"use client";

import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ligarRelogio } from "./relogio";
import { montarStoryboard } from "./storyboard";
import { montarOvos } from "./ovos";
import { reduzido } from "./estado";

gsap.registerPlugin(useGSAP);

/** Dono do storyboard da rolagem. Um único componente, sem interface: só liga o movimento ao HTML que já existe. */
export default function Movimento() {
  useEffect(() => {
    document.documentElement.dataset.movimento = "pronto";
    return montarOvos();
  }, []);

  useGSAP(() => {
    const desligar = ligarRelogio();
    let desmontar: undefined | (() => void);
    if (!reduzido()) desmontar = montarStoryboard();
    return () => {
      desmontar?.();
      desligar();
    };
  }, []);
  return null;
}
