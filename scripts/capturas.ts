/** Capturas para revisão visual: `tsx scripts/capturas.ts <pasta> [tema]`. */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const pasta = process.argv[2] ?? "test-results/capturas";
const tema = process.argv[3] ?? "ouro";
const BASE = process.env.BASE ?? "http://localhost:3000";
const ESPERA = Number(process.env.ESPERA ?? 1500);
mkdirSync(pasta, { recursive: true });
const nav = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
for (const [nome, w, h] of [["celular", 390, 844], ["desktop", 1440, 900]] as const) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, colorScheme: "dark" });
  await ctx.addInitScript((t) => {
    localStorage.setItem("tema", t);
    // Renderização por software é lenta: congela a chuva em um quadro avançado para a foto.
    localStorage.setItem("chuva", "pausada");
  }, tema);
  const p = await ctx.newPage();
  const erros: string[] = [];
  p.on("console", (m) => { if (m.type() === "error") erros.push(m.text()); });
  p.on("pageerror", (e) => erros.push(String(e)));
  await p.goto(BASE, { waitUntil: "load" });
  await p.waitForSelector('.palco[data-pronta="sim"]', { timeout: 40000 }).catch(() => erros.push("cena não ficou pronta"));
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${pasta}/${nome}-${tema}-0-hero.png`, timeout: 120000 });
  for (const id of ["sobre", "agora", "trajetoria", "formacao", "competencias", "certificados", "contato"]) {
    await p.evaluate((i) => document.getElementById(i)?.scrollIntoView({ behavior: "instant" as ScrollBehavior }), id);
    await p.waitForTimeout(ESPERA);
    await p.screenshot({ path: `${pasta}/${nome}-${tema}-${id}.png`, timeout: 120000 });
  }
  for (const r of ["cv", "seguranca", "sistema"]) {
    await p.goto(`${BASE}/${r}`);
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${pasta}/${nome}-${tema}-rota-${r}.png` });
  }
  console.log(nome, erros.length ? erros.slice(0, 8) : "sem erros no console");
  await ctx.close();
}
await nav.close();
