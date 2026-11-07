import Link from "next/link";
import { createHash } from "node:crypto";
import type { ConteudoSite } from "@/conteudo/esquema";
import { bitsDoHash } from "@/conteudo/derivados";

export function Rodape({ c }: { c: ConteudoSite }) {
  const versao = process.env.BUILD_HASH ?? "";
  const bits = bitsDoHash(createHash("sha256").update(versao).digest("hex"), 64);
  const links = [
    { href: "/cv", texto: c.ui.curriculo },
    { href: "/seguranca", texto: c.ui.seguranca },
    { href: "/sistema", texto: c.ui.sistema },
    { href: "/seguranca#privacidade", texto: c.ui.privacidade },
  ];
  return (
    <footer className="rodape">
      {/* Os bits e o hash são do build desta versão: o mesmo commit gera sempre a mesma faixa. */}
      <p className="faixa-bits dado" aria-hidden="true">
        {bits}
      </p>
      <div className="rodape-grade">
        <div className="rodape-assinatura">
          <p className="rodape-nome">{c.rodape.assinatura}</p>
          <p className="rodape-creditos">{c.rodape.creditos}</p>
          <p className="rodape-build dado" translate="no">
            {c.rodape.build} {versao} {process.env.BUILD_DATA}
          </p>
        </div>
        <nav aria-label={c.rodape.paginas}>
          <ul className="rodape-links">
            {links.map((l) => (
              <li key={l.href}>
                <Link transitionTypes={["rota"]} href={l.href}>
                  {l.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
