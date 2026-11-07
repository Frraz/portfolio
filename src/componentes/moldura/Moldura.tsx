import { CarregadorMoldura } from "./CarregadorMoldura";

type Props = { secoes: { id: string; rotulo: string }[]; ui: Record<string, string> };

/**
 * Moldura de instrumento (docs/05): marcas em L nos quatro cantos, em CSS, e dados reais nos cantos de baixo
 * (seção, rolagem, FPS, nível e tema). Os dados chegam depois da primeira pintura: são decoração e não pesam no
 * JavaScript inicial.
 */
export function Moldura({ secoes, ui }: Props) {
  return (
    <div className="moldura" aria-hidden="true">
      <CarregadorMoldura secoes={secoes} ui={ui} />
    </div>
  );
}
