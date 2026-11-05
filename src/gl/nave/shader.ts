/**
 * Pedra da nave: a luz foi assada em cinza por vértice no Blender (R = abside, G = oclusão, B = portal) e o tema a tinge aqui.
 * Toda a cena obedece ao mesmo teto de luminância da chuva, para o texto continuar legível.
 */
export const verticePedra = /* glsl */ `
  attribute vec4 color;
  varying vec3 vN;
  varying vec3 vP;
  varying vec3 vC;
  void main() {
    vec4 m = modelMatrix * vec4(position, 1.0);
    vP = m.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    vC = color.rgb;
    gl_Position = projectionMatrix * viewMatrix * m;
  }
`;

const teto = /* glsl */ `
  vec3 limitar(vec3 c, float teto) {
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    return l > teto ? c * teto / l : c;
  }
`;

export const fragmentoPedra = /* glsl */ `
  precision highp float;
  uniform vec3 uFundo;
  uniform vec3 uTinta;
  uniform vec3 uLeste;
  uniform vec3 uOeste;
  uniform float uTeto;
  uniform float uClaro;
  uniform float uNave;
  varying vec3 vN;
  varying vec3 vP;
  varying vec3 vC;
  ${teto}
  void main() {
    vec3 N = normalize(vN);
    vec3 V = cameraPosition - vP;
    float dist = length(V);
    V /= dist;
    float rim = pow(1.0 - abs(dot(N, V)), 3.0);
    float ao = vC.g * vC.g;
    float leste = vC.r * vC.r;
    float oeste = vC.b * vC.b;
    float neblina = 1.0 - exp(-dist * 0.055);
    float piso = step(0.9, N.y) * step(vP.y, 0.02);

    if (uClaro > 0.5) {
      // Pergaminho: gravura em traços. Tom vira densidade de hachura; não há luz.
      float tom = clamp(1.0 - (leste + oeste) * 0.8 - ao * 0.5, 0.0, 1.0);
      float escala = 3.2;
      float h1 = sin((gl_FragCoord.x + gl_FragCoord.y) * escala * 0.5);
      float h2 = sin((gl_FragCoord.x - gl_FragCoord.y) * escala * 0.5);
      float traco = smoothstep(0.55, 0.9, h1) * smoothstep(0.1, 0.4, tom);
      traco = max(traco, smoothstep(0.55, 0.9, h2) * smoothstep(0.45, 0.75, tom));
      float contorno = smoothstep(0.45, 0.8, rim);
      float tinta = clamp(traco * 0.2 + contorno * 0.34, 0.0, 0.3) * (1.0 - neblina * 0.9) * (1.0 - piso * 0.7);
      gl_FragColor = vec4(mix(uFundo, uTinta, tinta), uNave);
      #include <colorspace_fragment>
      return;
    }

    vec3 c = uFundo * 1.4 + vec3(0.004);
    c += uLeste * leste * 0.5 * (0.3 + 0.7 * ao);
    c += uOeste * oeste * 0.5 * (0.3 + 0.7 * ao);
    c += uLeste * rim * 0.05 * ao;
    if (piso > 0.5) {
      // Lajotas riscadas no próprio shader: o piso não merece geometria.
      vec2 g = abs(fract(vP.xz / 2.0) - 0.5);
      float junta = smoothstep(0.482, 0.495, max(g.x, g.y));
      c *= 1.0 - junta * 0.5;
    }
    c = mix(c, uFundo, neblina);
    c = limitar(c, uTeto);
    gl_FragColor = vec4(c, uNave);
    #include <colorspace_fragment>
  }
`;

export const verticeLuz = /* glsl */ `
  varying vec3 vP;
  varying vec3 vL;
  void main() {
    vL = position;
    vec4 m = modelMatrix * vec4(position, 1.0);
    vP = m.xyz;
    gl_Position = projectionMatrix * viewMatrix * m;
  }
`;

/** Luz em vão de pedra: portal, rosácea e lancetas. `uAte` é a fração da janela acesa, em altura. */
export const fragmentoLuz = /* glsl */ `
  precision highp float;
  uniform vec3 uCor;
  uniform vec3 uCor2;
  uniform vec3 uFundo;
  uniform vec3 uTinta;
  uniform float uForca;
  uniform float uTeto;
  uniform float uClaro;
  uniform float uNave;
  uniform float uAte;
  uniform vec2 uFaixa;
  uniform float uLivreX;
  varying vec3 vP;
  varying vec3 vL;
  ${teto}
  float h(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  void main() {
    float f = (vP.y - uFaixa.x) / max(uFaixa.y - uFaixa.x, 0.001);
    float aceso = 1.0 - smoothstep(uAte - 0.015, uAte + 0.015, f);
    vec2 cel = floor(vec2(vP.x, vP.y) * 2.2);
    float peca = 0.55 + 0.75 * h(cel);
    float dist = length(cameraPosition - vP);
    float neblina = exp(-dist * 0.012);
    if (uClaro > 0.5) {
      vec3 c = mix(uFundo, uTinta, (0.05 + 0.14 * aceso * peca));
      gl_FragColor = vec4(c, uNave);
      #include <colorspace_fragment>
      return;
    }
    vec3 c = mix(uCor, uCor2, h(cel + 3.0) * 0.55) * peca * (0.06 + aceso * uForca) * neblina;
    float teto = gl_FragCoord.x > uLivreX ? 10.0 : uTeto;
    c = limitar(c, teto);
    gl_FragColor = vec4(c, uNave);
    #include <colorspace_fragment>
  }
`;
