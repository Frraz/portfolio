/**
 * Chunk carregado só ao clicar em "Mostrar WhatsApp".
 * O número chega embaralhado no build (next.config.ts) e nunca fica em texto puro no bundle.
 */
export function revelarNumero() {
  const CHAVE = "rendilhado";
  const bruto = atob(process.env.WHATSAPP_E ?? "");
  let numero = "";
  for (let i = 0; i < bruto.length; i++) numero += String.fromCharCode(bruto.charCodeAt(i) ^ CHAVE.charCodeAt(i % CHAVE.length));
  return numero;
}

export function formatarNumero(n: string) {
  const m = n.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
  return m ? `+${m[1]} (${m[2]}) ${m[3]}-${m[4]}` : `+${n}`;
}
