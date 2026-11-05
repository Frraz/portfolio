import Link from "next/link";
import type { ConteudoSite } from "@/conteudo/esquema";

export function Rodape({ c }: { c: ConteudoSite }) {
  return (
    <footer className="rodape">
      <div>
        <p>{c.rodape.assinatura}</p>
        <p className="medida">{c.rodape.creditos}</p>
      </div>
      <ul className="rodape-links">
        <li>
          <Link transitionTypes={["rota"]} className="link-ouro" href="/cv">
            {c.ui.curriculo}
          </Link>
        </li>
        <li>
          <Link transitionTypes={["rota"]} className="link-ouro" href="/seguranca">
            {c.ui.seguranca}
          </Link>
        </li>
        <li>
          <Link transitionTypes={["rota"]} className="link-ouro" href="/sistema">
            {c.ui.sistema}
          </Link>
        </li>
        <li>
          <Link transitionTypes={["rota"]} className="link-ouro" href="/seguranca#privacidade">
            {c.ui.privacidade}
          </Link>
        </li>
      </ul>
    </footer>
  );
}
