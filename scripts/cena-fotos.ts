/**
 * Fotos da página com movimento ligado, em renderização por software: `tsx scripts/cena-fotos.ts <pasta> [tema] [largura] [altura]`.
 * Pausa a chuva para ficar viável. ESPERA em ms por foto; PONTOS="y:nome,..." tira fotos em posições do trilho (fração da tela).
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const pasta = process.argv[2] ?? "test-results/cena";
const tema = process.argv[3] ?? "ouro";
const w = Number(process.argv[4] ?? 1200);
const h = Number(process.argv[5] ?? 700);
const ids = (process.env.SECOES ?? "sobre,inicial,agora,trajetoria,formacao,competencias,certificados,contato").split(",").filter(Boolean);
const pontos = (process.env.PONTOS ?? "0.35:travessia-1,0.75:travessia-2").split(",").filter(Boolean);
const ESPERA = Number(process.env.ESPERA ?? 9000);
const BASE = process.env.BASE ?? "http://localhost:3000";
mkdirSync(pasta, { recursive: true });
const nav = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, colorScheme: "dark", serviceWorkers: "block", hasTouch: w < 500 });
await ctx.addInitScript((t) => {
  localStorage.setItem("tema", t);
  localStorage.setItem("chuva", "pausada");
}, tema);
const p = await ctx.newPage();
const erros: string[] = [];
p.on("console", (m) => { if (m.type() === "error") erros.push(m.text()); });
p.on("pageerror", (e) => erros.push(String(e)));
await p.goto(BASE, { waitUntil: "load" });
await p.waitForSelector('.palco[data-pronta="sim"]', { timeout: 90000 });
await p.waitForTimeout(ESPERA);
const foto = async (nome: string) => p.screenshot({ path: `${pasta}/${w}-${tema}-${nome}.png`, timeout: 180000 });
await foto("0-hero");
for (const pt of pontos) {
  const [f, nome] = pt.split(":");
  await p.evaluate((y) => window.scrollTo(0, y * innerHeight), Number(f));
  await p.waitForTimeout(ESPERA);
  await foto(nome);
}
for (const id of ids) {
  await p.evaluate((i) => (i === "inicial" ? document.querySelector(".inicial") : document.getElementById(i))?.scrollIntoView({ behavior: "instant" as ScrollBehavior }), id);
  await p.waitForTimeout(ESPERA);
  await foto(id);
}
console.log(erros.length ? erros.slice(0, 8) : "sem erros no console");
await nav.close();
