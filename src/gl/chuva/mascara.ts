/**
 * Máscara de travamento (docs/06): uma textura com um texel por célula da chuva.
 * Onde ela vale 1, os glifos param de cair e formam a figura. Aqui a figura é o nome do hero, desenhado em um
 * canvas 2D com a fonte real da página. As cenas A e B (R3) trocam a fonte da máscara e mantêm o resto.
 */
import * as THREE from "three";

export const CELULA = 18;

type Linha = { texto: string; x: number; y: number; largura: number; altura: number };

export function criarMascara() {
  const canvas = document.createElement("canvas");
  const g = canvas.getContext("2d", { willReadFrequently: false })!;
  const textura = new THREE.CanvasTexture(canvas);
  textura.flipY = false;
  textura.generateMipmaps = false;
  textura.minFilter = textura.magFilter = THREE.LinearFilter;
  textura.colorSpace = THREE.NoColorSpace;

  let assinatura = "";
  let ativa = false;

  /** Redesenha só se o nome mudou de lugar ou a tela mudou de tamanho. Retorna se algo mudou. */
  function atualizar(larguraTela: number, alturaTela: number): boolean {
    // A grade tem o tamanho da tela em células, com ou sem hero: a cena A grava no mesmo formato.
    const colunas = Math.ceil(larguraTela / CELULA);
    const fileiras = Math.ceil(alturaTela / CELULA);
    if (canvas.width !== colunas || canvas.height !== fileiras) {
      canvas.width = colunas;
      canvas.height = fileiras;
      assinatura = "";
    }
    const h1 = document.querySelector<HTMLElement>("#inicio-titulo");
    const alvo = h1?.getBoundingClientRect();
    const visivel = !!alvo && alvo.bottom > 0 && alvo.top < alturaTela;
    if (!h1 || !alvo || !visivel) {
      if (!ativa) return false;
      ativa = false;
      assinatura = "";
      g.clearRect(0, 0, canvas.width, canvas.height);
      textura.needsUpdate = true;
      return true;
    }
    // Cada linha é um bloco que ocupa a largura toda: o que importa é a caixa do texto, medida com um Range.
    const linhas: Linha[] = Array.from(h1.children).map((el) => {
      const faixa = document.createRange();
      faixa.selectNodeContents(el);
      const r = faixa.getBoundingClientRect();
      return { texto: (el.textContent ?? "").trim(), x: r.left, y: r.top, largura: r.width, altura: r.height };
    });
    const nova = `${colunas}x${fileiras}|` + linhas.map((l) => `${l.texto}:${Math.round(l.x)},${Math.round(l.y)},${Math.round(l.largura)}`).join("|");
    if (nova === assinatura) return false;
    assinatura = nova;
    ativa = true;
    const estilo = getComputedStyle(h1);
    g.clearRect(0, 0, colunas, fileiras);
    g.fillStyle = "#fff";
    g.textBaseline = "middle";
    g.textAlign = "left";
    for (const l of linhas) {
      if (!l.texto || l.largura < 1) continue;
      g.save();
      g.font = `${estilo.fontWeight} ${parseFloat(estilo.fontSize) / CELULA}px ${estilo.fontFamily}`;
      // A largura do nome já foi dada pelo layout (com eixo de largura e espaçamento): a máscara se ajusta a ela.
      const medida = g.measureText(l.texto).width || 1;
      g.translate(l.x / CELULA, (l.y + l.altura * 0.52) / CELULA);
      g.scale(l.largura / CELULA / medida, 1);
      g.fillText(l.texto, 0, 0);
      g.restore();
    }
    textura.needsUpdate = true;
    return true;
  }

  return { textura, canvas, atualizar, dimensoes: () => [canvas.width, canvas.height] as const, liberar: () => textura.dispose() };
}
