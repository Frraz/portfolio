/**
 * Som ambiente procedural, feito no navegador: bordão grave em quinta justa e reverberação longa.
 * Sem arquivo nem música de terceiros. Volume máximo de -24 dBFS. Especificação em docs/07.
 */
let contexto: AudioContext | null = null;
let saida: GainNode | null = null;
let filtro: BiquadFilterNode | null = null;
let ligadoAgora = false;

const LIMITE = Math.pow(10, -24 / 20);

function reverberacao(ctx: AudioContext, segundos = 5.5) {
  const n = Math.floor(ctx.sampleRate * segundos);
  const ir = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3.2);
  }
  const conv = ctx.createConvolver();
  conv.buffer = ir;
  return conv;
}

function montar() {
  const ctx = new AudioContext();
  const ganho = ctx.createGain();
  ganho.gain.value = 0;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 340;
  lp.Q.value = 0.4;
  const rev = reverberacao(ctx);
  const seco = ctx.createGain();
  seco.gain.value = 0.35;
  const molhado = ctx.createGain();
  molhado.gain.value = 0.85;
  const compressor = ctx.createDynamicsCompressor();
  lp.connect(seco).connect(compressor);
  lp.connect(rev).connect(molhado).connect(compressor);
  compressor.connect(ganho).connect(ctx.destination);
  // Fundamental e quinta justa, com uma oitava fraca e leve batimento.
  for (const [f, a, d] of [[55, 0.5, -3], [55, 0.5, 3], [82.5, 0.34, -2], [82.5, 0.34, 2], [110, 0.12, 0]] as const) {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    o.detune.value = d;
    const g = ctx.createGain();
    g.gain.value = a * 0.22;
    o.connect(g).connect(lp);
    o.start();
  }
  contexto = ctx;
  saida = ganho;
  filtro = lp;
  addEventListener("scroll", aoRolar, { passive: true });
  addEventListener("visibilitychange", aoVisibilidade);
  addEventListener("nave:filtro", cliquePorta);
}

let ultimoY = 0;
function aoRolar() {
  if (!contexto || !filtro) return;
  const v = Math.min(1, Math.abs(scrollY - ultimoY) / 80);
  ultimoY = scrollY;
  filtro.frequency.setTargetAtTime(340 + v * 500, contexto.currentTime, 0.25);
  filtro.frequency.setTargetAtTime(340, contexto.currentTime + 0.3, 0.9);
}

function aoVisibilidade() {
  if (!contexto) return;
  if (document.hidden) void contexto.suspend();
  else if (ligadoAgora) void contexto.resume();
}

/** Clique discreto das portas ao abrir. */
function cliquePorta() {
  if (!contexto || !saida || !ligadoAgora) return;
  const t = contexto.currentTime;
  const o = contexto.createOscillator();
  o.frequency.setValueAtTime(180, t);
  o.frequency.exponentialRampToValueAtTime(70, t + 0.09);
  const g = contexto.createGain();
  g.gain.setValueAtTime(0.5, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  o.connect(g).connect(filtro!);
  o.start(t);
  o.stop(t + 0.14);
}

export function ligar() {
  if (!contexto) montar();
  ligadoAgora = true;
  void contexto!.resume();
  saida!.gain.cancelScheduledValues(contexto!.currentTime);
  saida!.gain.setTargetAtTime(LIMITE, contexto!.currentTime, 0.6);
}

export function desligar() {
  ligadoAgora = false;
  if (!contexto || !saida) return;
  const t = contexto.currentTime;
  saida.gain.cancelScheduledValues(t);
  saida.gain.setTargetAtTime(0, t, 0.13); // ~400 ms até o silêncio
  window.setTimeout(() => {
    if (!ligadoAgora) void contexto?.suspend();
  }, 500);
}
