/**
 * Os nove selos do CTF, em texto simples. Só o build e os locais públicos usam este arquivo.
 * O navegador confere pelo hash: `hashes.gerado.json`, feito por `pnpm selos`. Especificação em docs/07.
 */
export const SELOS = [
  "FONTE-VISTA", // 0: comentário no HTML da página inicial
  "CONSOLE-ABERTO", // 1: console do navegador
  "ROBOS-LEEM", // 2: robots.txt
  "CABECALHO-HTTP", // 3: cabeçalho X-Selo
  "SECURITY-TXT", // 4: comentário em security.txt
  "BASE64-NAO-CIFRA", // 5: variável CSS, em Base64
  "METADADO-SVG", // 6: metadados do SVG das trilhas de placa
  "LUMEN", // 7: letras da chuva, com ela pausada
  "LS-MENOS-A", // 8: `ls -a` no terminal
] as const;

export const ARTE_FONTE = String.raw`
   o-------+          +-----o
           |          |
       o---+---o      +--o
               |
   o-----------+------o       Trilhas de placa feitas de texto.
                              Quem lê o código-fonte encontra o selo 0.
`;
