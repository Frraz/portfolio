import { Trilhas } from "@/componentes/graficos/Trilhas";
import { CarregadorCena } from "./CarregadorCena";

/** Fundo fixo. O pôster (trilhas de placa em SVG) é o que aparece sem WebGL ou sem JavaScript. */
export function Palco() {
  return (
    <div className="palco" aria-hidden="true">
      <div className="poster-sinal">
        <Trilhas secao="inicio" />
      </div>
      <CarregadorCena />
    </div>
  );
}
