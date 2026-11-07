/**
 * Fonte única das cores. CSS (`gerado.css`) e shaders nascem daqui.
 * Mudou um valor? Atualize docs/05-design-system.md e rode `pnpm temas`.
 */
export type Papel =
  | "fundo"
  | "superficie"
  | "superficie2"
  | "tinta"
  | "tinta2"
  /** Dados e metadados (datas, horas, cargas, rótulos de ficha): um tom da rampa do tema, com a mesma luminância mínima de `tinta2`. */
  | "tintaDado"
  | "sinal"
  | "forma"
  | "formaFundo"
  | "alerta"
  | "chuva"
  | "chuvaCabeca";

export type Tema = {
  id: "rubro" | "claro" | "fosforo";
  /** Só aparece nos menus depois de liberado (comando `matrix` ou CTF completo). */
  oculto?: boolean;
  esquema: "dark" | "light";
  cores: Record<Papel, string>;
};

export const TEMAS: Tema[] = [
  {
    id: "rubro",
    esquema: "dark",
    cores: {
      fundo: "#050203",
      superficie: "#110608",
      superficie2: "#1C0A0E",
      tinta: "#F2E7E5",
      tinta2: "#B49896",
      tintaDado: "#DB8F8A",
      sinal: "#FF3646",
      forma: "#C40F2C",
      formaFundo: "#5E0712",
      alerta: "#FFB547",
      chuva: "#E01E30",
      chuvaCabeca: "#FFE2DC",
    },
  },
  {
    id: "claro",
    esquema: "light",
    cores: {
      fundo: "#F5F0EF",
      superficie: "#FFFFFF",
      superficie2: "#EDE3E2",
      tinta: "#14080A",
      tinta2: "#5A3F41",
      tintaDado: "#74252C",
      sinal: "#A0001A",
      forma: "#C40F2C",
      formaFundo: "#F2D4D6",
      alerta: "#8A4B00",
      // Na prática a chuva do tema claro usa a tinta a 8% e a cabeça em `sinal` a 25% (docs/06).
      chuva: "#14080A",
      chuvaCabeca: "#A0001A",
    },
  },
  {
    id: "fosforo",
    oculto: true,
    esquema: "dark",
    cores: {
      fundo: "#010401",
      superficie: "#04100A",
      superficie2: "#082016",
      tinta: "#D4F7DF",
      tinta2: "#86C99E",
      tintaDado: "#8FD3B6",
      sinal: "#3DFF7E",
      forma: "#1FB85A",
      formaFundo: "#0B3A1E",
      alerta: "#FFB547",
      chuva: "#2BFF6E",
      chuvaCabeca: "#E8FFF0",
    },
  },
];

export const TEMA_PADRAO: Tema["id"] = "rubro";
export const IDS_TEMAS = TEMAS.map((t) => t.id);
