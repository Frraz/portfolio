/** Anotação de manuscrito. Decorativa: o título da seção é o nome real para leitores de tela. */
export function Margem({ numero, nome }: { numero: number; nome: string }) {
  return (
    <div className="margem" aria-hidden="true">
      <div className="margem-interna">
        <span className="margem-numero">{numero}</span>
        <span className="margem-nome">{nome}</span>
      </div>
    </div>
  );
}
