/**
 * Fonte única das cores. CSS (`gerado.css`) e shaders nascem daqui.
 * Mudou um valor? Atualize docs/05-design-system.md e rode `pnpm temas`.
 */
export type Papel =
  | "fundo"
  | "superficie"
  | "tinta"
  | "tinta2"
  | "acento"
  | "acento2"
  | "alerta"
  | "chuva"
  | "chuvaCabeca";

export type Tema = {
  id: "ouro" | "fosforo" | "rubro" | "purpura" | "pergaminho" | "selado";
  /** Só aparece nos menus depois dos nove selos do CTF. */
  oculto?: boolean;
  esquema: "dark" | "light";
  cores: Record<Papel, string>;
  /** Cores dos painéis do vitral, em ordem de anel. */
  vitral: [string, string, string, string];
};

export const TEMAS: Tema[] = [
  {
    id: "ouro",
    esquema: "dark",
    cores: {
      fundo: "#030304",
      superficie: "#14110C",
      tinta: "#EFE8D6",
      tinta2: "#B9AE94",
      acento: "#D2A94E",
      acento2: "#52F59A",
      alerta: "#F0566A",
      chuva: "#52F59A",
      chuvaCabeca: "#EFFFF5",
    },
    vitral: ["#D2A94E", "#52F59A", "#2B6CFF", "#B3122A"],
  },
  {
    id: "fosforo",
    esquema: "dark",
    cores: {
      fundo: "#000300",
      superficie: "#07140C",
      tinta: "#C9F7DA",
      tinta2: "#7FC79B",
      acento: "#3DF58A",
      acento2: "#D2A94E",
      alerta: "#FF6B6B",
      chuva: "#2FE87F",
      chuvaCabeca: "#E6FFF0",
    },
    vitral: ["#2FE87F", "#0E7A44", "#7CFFB6", "#D2A94E"],
  },
  {
    id: "rubro",
    esquema: "dark",
    cores: {
      fundo: "#070203",
      superficie: "#1A0A0C",
      tinta: "#EEE3D8",
      tinta2: "#BFA9A0",
      acento: "#F0465A",
      acento2: "#EFE3C8",
      alerta: "#FF8A7A",
      chuva: "#E8314A",
      chuvaCabeca: "#FFE9E4",
    },
    vitral: ["#E8314A", "#7A0F20", "#EFE3C8", "#F0465A"],
  },
  {
    id: "purpura",
    esquema: "dark",
    cores: {
      fundo: "#07040D",
      superficie: "#170F26",
      tinta: "#EEE6F5",
      tinta2: "#B7A8CC",
      acento: "#D9B65A",
      acento2: "#B58CFF",
      alerta: "#FF7A8A",
      chuva: "#9F7BFF",
      chuvaCabeca: "#F3ECFF",
    },
    vitral: ["#9F7BFF", "#D9B65A", "#4A2C8F", "#B58CFF"],
  },
  {
    id: "pergaminho",
    esquema: "light",
    cores: {
      fundo: "#F3ECDD",
      superficie: "#FFFAF0",
      tinta: "#16120C",
      tinta2: "#5A4F3F",
      acento: "#7A1420",
      acento2: "#6E5310",
      alerta: "#8E1122",
      chuva: "#16120C",
      chuvaCabeca: "#7A1420",
    },
    vitral: ["#16120C", "#7A1420", "#6E5310", "#5A4F3F"],
  },
];

// Selado: variante do Ouro em que a rosácea fica acesa por inteiro. Recompensa do CTF.
TEMAS.push({ ...TEMAS[0], id: "selado", oculto: true });

export const TEMA_PADRAO: Tema["id"] = "ouro";
export const IDS_TEMAS = TEMAS.map((t) => t.id);
