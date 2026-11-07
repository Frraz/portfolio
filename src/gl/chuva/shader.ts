/**
 * A chuva do conceito Sinal, em um único shader de fragmento.
 * Glifos do atlas com SDF, três camadas, travamento por máscara e sonda do cursor.
 * Especificação: docs/06-motion-e-webgl.md
 */
import { ATLAS } from "./atlas-info";

export const vertice = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const f = (n: number) => n.toFixed(1);

export const fragmento = /* glsl */ `
  precision highp float;

  uniform float uTempo;
  uniform float uQueda;
  uniform vec2  uRes;
  uniform float uEscala;
  uniform sampler2D uAtlas;
  uniform sampler2D uMascara;
  uniform vec3  uChuva;
  uniform vec3  uCabeca;
  uniform vec3  uFundo;
  uniform vec3  uTinta;
  uniform vec3  uForma;
  uniform float uTrava;
  uniform float uMascaraInv;
  uniform float uLivreX;
  uniform float uGanho;
  uniform float uTeto;
  uniform float uClaro;
  uniform float uPalavra;
  uniform vec2  uPalavraPos;
  uniform float uLetras[20];
  uniform float uNLetras;
  uniform float uAceso;
  uniform float uSelo;
  uniform vec2  uSeloPos;

  const float GLIFOS = ${f(ATLAS.total)};
  const vec2  GRADE = vec2(${f(ATLAS.colunas)}, ${f(ATLAS.linhas)});
  const float DIGITOS = ${f(ATLAS.digitos)};
  const float KATAKANA = ${f(ATLAS.katakana)};
  const float KATAKANA_N = ${f(ATLAS.katakanaN)};
  const float SIMBOLOS = ${f(ATLAS.simbolos)};
  const float SIMBOLOS_N = ${f(ATLAS.simbolosN)};
  const float CAIXA = ${f(ATLAS.caixa)};
  const float CELULA = 18.0;

  float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float h21(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  float ruido(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++) { s += a * ruido(p); p = p * 2.03 + 11.7; a *= 0.5; } return s; }

  // Flag 8 do CTF: só aparece com a chuva parada. LUMEN, por índice no atlas (A = 0).
  const float SELO[5] = float[5](11.0, 20.0, 12.0, 4.0, 13.0);

  // Contorno em traços de caixa: código dos vizinhos (n=1, s=2, e=4, w=8) para o índice no grupo de caixa.
  // -1 é miolo: o preenchimento usa hexadecimal.
  const float CAIXA_TAB[16] = float[16](-1.0, 1.0, 1.0, 1.0, 0.0, 4.0, 2.0, 6.0, 0.0, 5.0, 3.0, 7.0, 0.0, 9.0, 8.0, -1.0);

  float mascara(vec2 id) {
    vec2 dim = vec2(textureSize(uMascara, 0));
    if (id.x < 0.0 || id.y < 0.0 || id.x >= dim.x || id.y >= dim.y) return 0.0;
    vec2 uv = (id + 0.5) / dim;
    // A textura da cena A vem de um alvo de renderização, com a origem embaixo.
    if (uMascaraInv > 0.5) uv.y = 1.0 - uv.y;
    return texture2D(uMascara, uv).r;
  }

  // Sorteio do glifo da chuva: hexadecimal domina, depois binário, katakana e símbolos de código.
  float sorteio(vec2 id, float passo) {
    float r = h21(id + passo * 0.37);
    float k = h21(id * 1.7 + passo);
    if (r < 0.52) { float j = floor(k * 16.0); return j < 10.0 ? DIGITOS + j : j - 10.0; }
    if (r < 0.66) return DIGITOS + (k < 0.5 ? 0.0 : 1.0);
    if (r < 0.86) return KATAKANA + floor(k * KATAKANA_N);
    return SIMBOLOS + floor(k * SIMBOLOS_N);
  }

  float glifo(float indice, vec2 q, float celula) {
    vec2 uv = (vec2(mod(indice, GRADE.x), floor(indice / GRADE.x)) + fract(q / celula)) / GRADE;
    float sdf = texture2D(uAtlas, uv).r;
    float w = clamp(3.0 / (celula * uEscala), 0.02, 0.2);
    return smoothstep(0.5 - w, 0.5 + w, sdf);
  }

  // Retorna (cauda, cabeça, cobertura do glifo).
  vec3 chuva(vec2 q, float celula, float semente, float ritmo) {
    vec2 id = floor(q / celula);
    float col = id.x + semente;
    float vel = mix(4.0, 18.0, h11(col * 1.73)) * ritmo;
    float comp = mix(12.0, 40.0, h11(col * 2.31));
    float periodo = comp + mix(10.0, 56.0, h11(col * 3.17));
    float d = mod(uQueda * vel + h11(col) * 997.0 - id.y, periodo);
    float cauda = d < comp ? exp(-3.4 * d / comp) : 0.0;
    float cabeca = 1.0 - smoothstep(0.0, 1.4, d);
    if (cauda <= 0.002 && cabeca <= 0.002 && uPalavra <= 0.0 && uSelo <= 0.5) return vec3(0.0);

    float taxa = mix(1.4, 11.0, h21(id + semente));
    float passo = floor(uTempo * taxa + h21(id) * 50.0);
    float indice = sorteio(id, passo);

    // Em quietude, uma coluna soletra o nome. Com o CTF completo, a frase do coelho.
    if (uPalavra > 0.001 && celula == CELULA) {
      float base = floor(uPalavraPos.x / celula);
      float linha = floor(uPalavraPos.y / celula);
      float i = id.y - linha;
      if (id.x == base && i >= 0.0 && i < uNLetras) {
        float letra = uLetras[int(i)];
        if (letra >= 0.0) {
          indice = letra;
          cauda = max(cauda, uPalavra * 0.95);
          cabeca = max(cabeca, uPalavra * 0.5);
        }
      }
    }
    if (uSelo > 0.5 && celula == CELULA) {
      float baseS = floor(uSeloPos.x / celula);
      float linhaS = floor(uSeloPos.y / celula);
      float j = id.y - linhaS;
      if (id.x == baseS && j >= 0.0 && j < 5.0) {
        indice = SELO[int(j)];
        cauda = 0.95;
      }
    }
    return vec3(cauda, cabeca, glifo(indice, q, celula));
  }

  void main() {
    vec2 q = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uEscala;

    // Travamento: onde a forma existe, as células param de cair. Contorno em traços de caixa, miolo em hex.
    vec2 idM = floor(q / CELULA);
    float m = uTrava > 0.001 ? mascara(idM) : 0.0;
    float dentro = step(0.5, m);
    float travada = 0.0;
    float travadaCor = 0.0;
    float borda = 0.0;
    if (dentro > 0.5) {
      float cod = step(0.5, mascara(idM + vec2(0.0, -1.0))) * 1.0
                + step(0.5, mascara(idM + vec2(0.0, 1.0))) * 2.0
                + step(0.5, mascara(idM + vec2(1.0, 0.0))) * 4.0
                + step(0.5, mascara(idM + vec2(-1.0, 0.0))) * 8.0;
      float ci = CAIXA_TAB[int(cod)];
      float h = h21(idM);
      float lento = floor(uTempo * mix(0.3, 1.2, h) + h * 40.0);
      float indice;
      if (ci >= 0.0) { indice = CAIXA + ci; borda = 1.0; }
      else { float j = floor(h21(idM + lento * 0.41) * 16.0); indice = j < 10.0 ? DIGITOS + j : j - 10.0; }
      travada = glifo(indice, q, CELULA);
      // Profundidade: a máscara da cena A guarda a luz da superfície (0,5 a 1). Na máscara 2D vale sempre 1.
      float fundo3d = mix(0.55, 1.0, clamp((m - 0.5) * 2.0, 0.0, 1.0));
      travadaCor = (borda > 0.5 ? 1.0 : 0.38 + 0.3 * h21(idM + lento)) * fundo3d;
    }
    float trava = dentro * uTrava;

    // Camadas: longe, meio e perto.
    vec3 meio = chuva(q, CELULA, 0.0, 1.0);
    float rainM = meio.z * (meio.x + meio.y * 2.4);
    float cabecaM = meio.z * meio.y;
    float rainL = 0.0, rainP = 0.0;
    #if CAMADAS >= 2
      vec3 longe = chuva(q, 11.0, 91.0, 0.62);
      rainL = longe.z * (longe.x + longe.y * 1.4);
    #endif
    #if CAMADAS >= 3
      vec3 perto = chuva(q, 34.0, 37.0, 1.45);
      rainP = perto.z * (perto.x + perto.y * 1.6);
    #endif
    float livre = 1.0 - 0.85 * trava;

    if (uClaro > 0.5) {
      // Claro: tinta sobre papel em vez de luz.
      vec3 c = uFundo;
      float tinta = clamp(rainM * 0.07 + rainL * 0.04 + rainP * 0.05, 0.0, 0.12) * livre;
      c = mix(c, uChuva, tinta);
      c = mix(c, uCabeca, cabecaM * 0.2 * livre);
      c = mix(c, uForma, travada * travadaCor * trava * 0.4);
      gl_FragColor = vec4(c, 1.0);
      #include <colorspace_fragment>
      return;
    }

    float ambiente = 0.85 + 0.3 * fbm(q * 0.004 + uTempo * 0.015);
    vec3 cor = uFundo;
    cor += uChuva * (rainM * 0.32 + rainL * 0.14 + rainP * 0.16) * ambiente * uGanho * livre;
    cor += uCabeca * cabecaM * (0.18 + 0.5 * uAceso) * uGanho * livre;
    cor += uCabeca * (rainL + rainP) * 0.25 * uAceso * uGanho;

    // Forma travada: contorno quase na cor da cabeça, miolo mais apagado.
    vec3 corTrava = mix(uForma, mix(uChuva, uCabeca, 0.45), borda);
    cor += corTrava * travada * travadaCor * trava * (0.55 + 0.4 * borda);

    // Teto de luminância: garante a leitura do texto fora do hero. A faixa livre de texto, em tela larga, fica de fora.
    float tetoLocal = q.x > uLivreX ? 10.0 : uTeto;
    float lum = dot(cor, vec3(0.2126, 0.7152, 0.0722));
    if (lum > tetoLocal) cor *= tetoLocal / lum;

    gl_FragColor = vec4(cor, 1.0);
    #include <colorspace_fragment>
  }
`;
