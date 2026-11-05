import { rosaceaSvg } from "@/ornamentos";
import { CarregadorCena } from "./CarregadorCena";

/** Fundo fixo. O pôster em SVG é o que aparece sem WebGL ou sem JavaScript. */
/** `fracoes`: quanto cada lanceta acende, de acordo com a situação real de cada curso. */
export function Palco({ fracoes }: { fracoes: number[] }) {
  return (
    <div className="palco" aria-hidden="true">
      <div className="poster-rosacea" dangerouslySetInnerHTML={{ __html: rosaceaSvg() }} />
      <CarregadorCena fracoes={fracoes} />
    </div>
  );
}
