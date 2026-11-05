import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globais.css";
import { classesFontes } from "../src/app/fontes";
import { IDS_TEMAS } from "../src/temas/temas";

const preview: Preview = {
  globalTypes: {
    tema: { description: "Tema", toolbar: { title: "Tema", items: IDS_TEMAS as unknown as string[], dynamicTitle: true } },
  },
  initialGlobals: { tema: "ouro" },
  decorators: [
    (Historia, ctx) => (
      <div className={classesFontes} data-tema={ctx.globals.tema} style={{ background: "var(--fundo)", color: "var(--tinta)", padding: "2rem", minHeight: "100vh", fontFamily: "var(--font-texto)" }}>
        <Historia />
      </div>
    ),
  ],
};
export default preview;
