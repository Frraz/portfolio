import { existsSync } from "node:fs";
import { join } from "node:path";

export { PDF_PUBLICO } from "./arquivos-nomes";

/** Só no servidor de build: evita link para arquivo que ainda não foi gerado. */
export const existeArquivoPublico = (nome: string) => existsSync(join(process.cwd(), "public", nome));
