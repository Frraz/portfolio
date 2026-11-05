import type { Metadata } from "next";
import Link from "next/link";
import { conteudo } from "@/conteudo";

const c = conteudo("pt-BR");
export const metadata: Metadata = { title: c.estados.offlineTitulo, robots: { index: false } };

export default function Offline() {
  return (
    <div className="leitura">
      <h1>{c.estados.offlineTitulo}</h1>
      <p style={{ marginTop: "1rem" }}>{c.estados.offline}</p>
      <p style={{ marginTop: "1.5rem" }}>
        <Link transitionTypes={["rota"]} className="botao" href="/cv">
          {c.ui.curriculo}
        </Link>
      </p>
    </div>
  );
}
