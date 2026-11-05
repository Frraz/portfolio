"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type Divisor from "./Divisor";

const Interativo = dynamic(() => import("./Divisor"), { ssr: false });

/** Sem JavaScript fica o diagrama estático. Com ele, a camada interativa entra por cima, em chunk próprio. */
export function DivisorCarregador(props: ComponentProps<typeof Divisor>) {
  return <Interativo {...props} />;
}
