import { chromium } from "@playwright/test";
const pasta = process.argv[2];
const tema = process.argv[3] ?? "rubro";
const nav = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
for (const [nome, w, h] of [["desktop", 1440, 900], ["celular", 390, 844]] as const) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h }, colorScheme: "dark" });
  await ctx.addInitScript((t) => { localStorage.setItem("tema", t); localStorage.setItem("chuva", "pausada"); }, tema);
  const p = await ctx.newPage();
  await p.goto("http://localhost:3212", { waitUntil: "load" });
  await p.waitForSelector('.palco[data-pronta="sim"]', { timeout: 40000 }).catch(() => console.log("sem cena"));
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${pasta}/${nome}-${tema}-topo.png` });
  const hHero = await p.locator(".hero").evaluate((e) => e.getBoundingClientRect().height);
  await p.evaluate((y) => window.scrollTo(0, y), hHero - h / 2);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${pasta}/${nome}-${tema}-divisa.png` });
  await ctx.close();
}
await nav.close();
