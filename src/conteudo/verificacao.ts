/** Regras de docs/01-veracidade-e-fontes.md. Funções puras, cobertas por testes. */

const PROIBIDOS = [
  /\bAWS\b/, /\bAzure\b/, /\bGCP\b/, /Kubernetes/, /Terraform/, /Ansible/, /Prometheus/, /\bELK\b/,
  /\bSIEM\b/, /Splunk/, /Wazuh/, /QRadar/, /\bBGP\b/, /\bOSPF\b/, /\bMPLS\b/, /Mikrotik/, /Cisco IOS/, /Spring Boot/,
  /SafraLog/, /Fundador/i, /\bCEO\b/, /Ferzion/i, /ProUni/i, /satisfação/i, /100%/,
  /\bespecialista\b/i, /\bs[êe]nior\b/i, /\bexpert\b/i, /\bpentester\b/i, /\bred teamer\b/i, /\bhacker\b/i,
];
const PROJETOS = [/Byakugan/i, /ConfTech/i, /Rebanho/i, /Romaneios/, /Bibliotheon/i, /Wallstreet/i, /projeto acadêmico/i];
const PII = [/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/, /\bRG\s*[:nº]/i, /data de nascimento/i, /R\$\s?\d/];
// A cidade do titular e as ferramentas usadas para escrever o código ficam fora do site (decisões 98 e 104).
const FORA_DO_SITE = [/Rondon/i, /\bClaude\b/, /Anthropic/i, /ChatGPT/i, /apoio d[ae] IA/i];

export function variantesTelefone(n: string): string[] {
  if (!n) return [];
  const sem55 = n.replace(/^55/, "");
  const ddd = sem55.slice(0, 2);
  const resto = sem55.slice(2);
  const a = resto.slice(0, 5);
  const b = resto.slice(5);
  return [n, `+${n}`, sem55, resto, `${a}-${b}`, `(${ddd}) ${a}-${b}`, `${ddd} ${a}-${b}`, `${ddd}${a}-${b}`];
}

type Opcoes = { numero: string; ativas: boolean; estrito?: boolean; ip?: string };

// "Ferzion" só existe no domínio do site: o endereço não conta como afirmação sobre a empresa.
const DOMINIO = /warley\.ferzion\.com\.br/gi;

export function buscarProblemas(bruto: string, origem: string, { numero, ativas, estrito = true, ip = "" }: Opcoes): string[] {
  const texto = bruto.replace(DOMINIO, "");
  const achados: string[] = [];
  // Em bundles, siglas curtas podem aparecer em código de terceiros: fora do modo estrito, só nomes longos e PII.
  const regras = estrito ? PROIBIDOS : PROIBIDOS.filter((r) => !/^\/\\b[A-Z]{3,4}\\b\/$/.test(String(r)) && !/100%/.test(String(r)));
  if (estrito || /\.html$|\.txt$|\.xml$/.test(origem)) {
    for (const r of regras) if (r.test(texto)) achados.push(`${origem}: termo proibido ${r}`);
  }
  if (!ativas && (estrito || /\.html$|\.txt$|\.xml$|chunks/.test(origem))) {
    for (const r of PROJETOS) if (r.test(texto)) achados.push(`${origem}: projeto citado ${r}`);
  }
  for (const r of PII) if (r.test(texto) && (estrito || /\.html$|\.txt$/.test(origem))) achados.push(`${origem}: dado pessoal ${r}`);
  for (const r of FORA_DO_SITE) if (r.test(texto)) achados.push(`${origem}: fora do site ${r}`);
  if (ip && texto.includes(ip)) achados.push(`${origem}: IP do servidor`);
  for (const v of variantesTelefone(numero)) if (texto.includes(v)) achados.push(`${origem}: telefone em texto puro`);
  return achados;
}
