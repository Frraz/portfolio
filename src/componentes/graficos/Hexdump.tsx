import { hexdump } from "@/conteudo/derivados";

/** Hexdump real (UTF-8) do texto ao lado, no formato do `xxd`. Decorativo: o texto já está na página. */
export function Hexdump({ texto, linhas = 12, porLinha = 8 }: { texto: string; linhas?: number; porLinha?: number }) {
  const l = hexdump(texto, porLinha).slice(0, linhas);
  return (
    <pre className="hexdump" aria-hidden="true">
      {l.map((x) => (
        <span key={x.offset} className="hexdump-linha">
          <span className="hexdump-offset">{x.offset}</span> {x.bytes.join(" ").padEnd(porLinha * 3 - 1, " ")} <span className="hexdump-ascii">{x.ascii}</span>
          {"\n"}
        </span>
      ))}
    </pre>
  );
}
