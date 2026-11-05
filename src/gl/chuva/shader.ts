/**
 * Chuva, rosácea e luz em um único shader de fragmento.
 * Tudo é procedural: geometria analítica e glifos do atlas com SDF.
 * Especificação: docs/06-motion-e-webgl.md
 */
export const vertice = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const fragmento = /* glsl */ `
  precision highp float;

  uniform float uTempo;
  uniform float uQueda;
  uniform vec2  uRes;
  uniform float uEscala;
  uniform sampler2D uAtlas;
  uniform vec3  uChuva;
  uniform vec3  uCabeca;
  uniform vec3  uFundo;
  uniform vec3  uTinta;
  uniform vec3  uVit0;
  uniform vec3  uVit1;
  uniform vec3  uVit2;
  uniform vec3  uVit3;
  uniform vec2  uCursor;
  uniform float uForca;
  uniform vec2  uCentro;
  uniform float uRaio;
  uniform float uRosa;
  uniform float uTeto;
  uniform float uClaro;
  uniform float uPalavra;
  uniform float uLetras[20];
  uniform float uNLetras;
  uniform float uAceso;
  uniform float uSelo;
  uniform float uCorDivisor;
  uniform float uClarao;

  const float TAU = 6.28318530718;
  const float GLIFOS = ${"160.0"};
  const vec2  GRADE = vec2(16.0, 10.0);

  float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float h21(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  vec2  h22(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
  float ruido(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * ruido(p); p = p * 2.03 + 11.7; a *= 0.5; } return s; }

  // Selo 7 do CTF: só aparece com a chuva parada. LUMEN, por índice no atlas.
  const float SELO[5] = float[5](11.0, 20.0, 12.0, 4.0, 13.0);

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
    float indice = floor(h21(id + passo * 0.37) * GLIFOS);

    if (uPalavra > 0.001) {
      float base = floor((uCentro.x + uRaio * 0.2) / celula);
      float linha = floor((uCentro.y - uRaio * 0.32) / celula);
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
    if (uSelo > 0.5 && celula == 18.0) {
      float baseS = max(floor((uCentro.x - uRaio * 1.05) / celula), 1.0);
      float linhaS = floor((uCentro.y - uRaio * 0.6) / celula);
      float j = id.y - linhaS;
      if (id.x == baseS && j >= 0.0 && j < 5.0) {
        indice = SELO[int(j)];
        cauda = 0.95;
      }
    }
    vec2 uv = (vec2(mod(indice, GRADE.x), floor(indice / GRADE.x)) + fract(q / celula)) / GRADE;
    float sdf = texture2D(uAtlas, uv).r;
    float w = clamp(3.0 / (celula * uEscala), 0.02, 0.2);
    float g = smoothstep(0.5 - w, 0.5 + w, sdf);
    return vec3(cauda, cabeca, g);
  }

  float segmento(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
  }

  // Retorna vidro (0 a 1) em .x, pedra em .y e o índice do painel em .z. Mesma geometria de src/ornamentos.ts.
  vec3 rosacea(vec2 p, float aa, out vec3 cor, out vec2 semente) {
    float r = length(p);
    float seg = TAU / 12.0;
    float a = atan(p.y, p.x) + TAU * 0.25;
    float pet = floor((a + seg * 0.5) / seg);
    float fa = mod(a + seg * 0.5, seg) - seg * 0.5;
    vec2 fp = r * vec2(cos(fa), sin(fa));
    semente = vec2(pet, 0.0);

    float dMeia = length(fp - vec2(0.56, 0.0)) - 0.145;
    float dExt  = length(fp - vec2(0.82, 0.0)) - 0.10;
    float dInt  = length(fp - vec2(0.36, 0.0)) - 0.08;

    float d = abs(r - 0.955);
    d = min(d, abs(r - 1.0));
    d = min(d, abs(r - 0.19));
    d = min(d, abs(r - 0.68));
    d = min(d, abs(dMeia));
    d = min(d, abs(dExt));
    d = min(d, abs(dInt));
    if (r > 0.19 && r < 0.955) d = min(d, r * abs(abs(fa) - seg * 0.5));

    if (r < 0.19)        { cor = uVit0 * 1.2; semente.y = 0.0; }
    else if (dExt < 0.0) { cor = uVit0;       semente.y = 1.0; }
    else if (dMeia < 0.0){ cor = uVit1;       semente.y = 2.0; }
    else if (dInt < 0.0) { cor = uVit3;       semente.y = 3.0; }
    else if (r < 0.68)   { cor = uVit2;       semente.y = 4.0; }
    else                 { cor = mix(uVit2, uVit3, 0.45) * 0.8; semente.y = 5.0; }

    float pedra = 1.0 - smoothstep(0.0065, 0.0065 + aa, d);
    pedra = max(pedra, smoothstep(0.955, 0.955 + aa, r) * (1.0 - smoothstep(1.0, 1.0 + aa, r)));

    // Cruz de três barras, parte fixa da pedra, no miolo.
    if (r < 0.19) {
      float c = segmento(p, vec2(0.0, -0.145), vec2(0.0, 0.145));
      c = min(c, segmento(p, vec2(-0.036, -0.1), vec2(0.036, -0.1)));
      c = min(c, segmento(p, vec2(-0.075, -0.04), vec2(0.075, -0.04)));
      c = min(c, segmento(p, vec2(-0.042, 0.052), vec2(0.042, 0.084)));
      pedra = max(pedra, 1.0 - smoothstep(0.0085, 0.0085 + aa, c));
    }
    float dentro = 1.0 - smoothstep(1.0, 1.0 + aa, r);
    return vec3((1.0 - pedra) * (1.0 - smoothstep(0.955 - aa, 0.955, r)), pedra * dentro, dentro);
  }

  // Vidro quebrado em peças, com chumbo fino entre elas.
  vec2 pecas(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float d1 = 8.0, d2 = 8.0; vec2 quem = vec2(0.0);
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = h22(i + g);
      float d = length(g + o - f);
      if (d < d1) { d2 = d1; d1 = d; quem = i + g; } else if (d < d2) { d2 = d; }
    }
    return vec2(h21(quem), d2 - d1);
  }

  void main() {
    vec2 q = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uEscala;
    vec2 tela = uRes / uEscala;

    // Cursor abre a chuva como uma mão na água.
    vec2 dc = q - uCursor;
    float d2 = dot(dc, dc) / (150.0 * 150.0);
    vec2 qc = q + vec2(sign(dc.x) * 46.0, -12.0) * uForca * exp(-d2);

    vec2 p = (q - uCentro) / max(uRaio, 1.0);
    float aa = 1.6 / max(uRaio, 1.0);
    vec3 corPainel = vec3(0.0); vec2 sem = vec2(0.0);
    vec3 r = uRosa > 0.002 ? rosacea(p, aa, corPainel, sem) : vec3(0.0);
    float vidro = r.x * uRosa;
    float pedra = r.y * uRosa;

    #if CAMADAS >= 2
      vec2 peca = pecas(p * 11.0 + sem * 3.0);
    #else
      vec2 peca = vec2(0.5, 1.0);
    #endif
    vec2 refr = (peca.x - 0.5) * vec2(10.0, 6.0) * vidro;

    // Camadas: longe, meio e perto.
    vec3 meio = chuva(qc + refr, 18.0, 0.0, 1.0);
    vec3 luz = vec3(0.0);
    float rainM = meio.z * (meio.x + meio.y * 2.4);
    float cabecaM = meio.z * meio.y;
    float rainL = 0.0, rainP = 0.0;
    #if CAMADAS >= 2
      vec3 longe = chuva(qc * 1.0 + vec2(uCursor.x * 0.012, 0.0) + refr, 11.0, 91.0, 0.62);
      rainL = longe.z * (longe.x + longe.y * 1.4);
    #endif
    #if CAMADAS >= 3
      vec3 perto = chuva(qc - vec2(uCursor.x * 0.03, 0.0), 34.0, 37.0, 1.45);
      rainP = perto.z * (perto.x + perto.y * 1.6);
    #endif

    if (uClaro > 0.5) {
      // Pergaminho: tinta e gravura em vez de luz.
      vec3 c = uFundo;
      float tinta = clamp(rainM * 0.07 + rainL * 0.04 + rainP * 0.05, 0.0, 0.1);
      c = mix(c, uChuva, tinta);
      c = mix(c, uCabeca, cabecaM * 0.2);
      c = mix(c, uTinta, pedra * 0.75);
      c = mix(c, uTinta, vidro * peca.x * 0.05 + vidro * (1.0 - smoothstep(0.0, 0.03, peca.y)) * 0.1);
      gl_FragColor = vec4(c, 1.0);
      #include <colorspace_fragment>
      return;
    }

    vec3 cor = uFundo;
    vec3 corChuva = mix(uChuva, uVit0, uCorDivisor);

    // Fora do vitral a chuva é fraca, como reflexo na pedra.
    float ambiente = 0.16 + 0.1 * fbm(q * 0.004 + uTempo * 0.015);
    cor += corChuva * (rainM * 0.32 + rainL * 0.14 + rainP * 0.16) * ambiente * 2.2;
    cor += uCabeca * cabecaM * 0.14;

    // Névoa de incenso e raios de luz vindos da rosácea.
    vec2 dirC = q - uCentro;
    float rr = length(dirC) / max(uRaio, 1.0);
    float ang = atan(dirC.y, dirC.x);
    float seg = floor((ang + TAU) / (TAU / 12.0));
    vec3 corRaio = mix(uVit0, uVit1, h11(seg) * 0.6);
    float raio = ruido(vec2(ang * 7.0, uTempo * 0.06)) * ruido(vec2(ang * 23.0, -uTempo * 0.04));
    float queda = exp(-max(rr - 1.0, 0.0) * 1.15) * smoothstep(0.85, 1.05, rr);
    float baixo = 0.3 + 0.7 * smoothstep(-0.4, 0.9, dirC.y / max(length(dirC), 1.0));
    float nevoa = fbm(q * 0.0035 + vec2(uTempo * 0.018, -uTempo * 0.009));
    cor += corRaio * raio * queda * baixo * 0.55 * uRosa * (0.45 + nevoa);
    cor += mix(uVit2, uVit0, 0.5) * nevoa * nevoa * 0.022;

    #if CAMADAS >= 2
      // Poeira suspensa nos feixes.
      vec2 gp = (q + vec2(uTempo * 3.0, -uTempo * 7.0)) / 42.0;
      vec2 ig = floor(gp); vec2 ep = h22(ig);
      float grao = smoothstep(0.045, 0.0, length(fract(gp) - ep)) * step(0.62, h21(ig + 3.0));
      cor += corRaio * grao * queda * uRosa * 0.8;
    #endif

    // Vitral: a chuva atrás do vidro é o que acende cada peça.
    if (vidro > 0.0) {
      float chumbo = 1.0 - smoothstep(0.0, 0.035, peca.y);
      float variacao = mix(0.55, 1.25, peca.x);
      float brilho = mix(0.17 + 0.05 * sin(uTempo * 0.4 + sem.x * 2.0 + sem.y), 1.15, uAceso);
      float acende = rainM * 1.05 + rainL * 0.75 + rainP * 0.5;
      vec3 v = corPainel * variacao * (brilho + acende * 1.25);
      v += uCabeca * corPainel * cabecaM * 1.7;
      v *= 1.0 - chumbo * 0.9;
      // Miolo mais quente, luz concentrada atrás da cruz.
      v *= 1.0 + 1.2 * exp(-rr * rr * 16.0);
      cor = mix(cor, v, vidro);
    }
    // Pedra: escura, com a borda tocada pela luz que vem de trás.
    if (pedra > 0.0) {
      vec3 pedraCor = mix(uFundo * 1.8 + vec3(0.012, 0.010, 0.008), corPainel * 0.08, 0.5);
      cor = mix(cor, pedraCor, pedra);
    }

    // Clarão único ao atravessar o vidro: o que cega é a própria cor do vitral.
    cor += mix(uVit0, uCabeca, 0.5) * uClarao;

    // Teto de luminância: garante a leitura do texto fora do hero.
    float lum = dot(cor, vec3(0.2126, 0.7152, 0.0722));
    if (lum > uTeto) cor *= uTeto / lum;

    gl_FragColor = vec4(cor, 1.0);
    #include <colorspace_fragment>
  }
`;
