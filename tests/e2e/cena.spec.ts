import { expect, test } from "@playwright/test";

// Renderização por software: lenta, mas prova que o WebGL roda sob a CSP real.
test.describe.configure({ mode: "serial" });
test.use({
  viewport: { width: 640, height: 400 },
  launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] },
});

test("a cena sobe sob CSP estrita, sem violações", async ({ page }) => {
  const erros: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") erros.push(m.text());
  });
  page.on("pageerror", (e) => erros.push(String(e)));
  await page.goto("/");
  await page.waitForSelector('.palco[data-pronta="sim"]', { timeout: 45_000 });
  expect(erros).toEqual([]);
});

test("com movimento reduzido, a cena não fica animando", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 640, height: 400 }, colorScheme: "dark" });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.waitForSelector('.palco[data-pronta="sim"]', { timeout: 45_000 });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(6000); // a nave chega depois, e pede alguns quadros
  const a = await page.locator(".palco canvas").screenshot({ timeout: 45_000 });
  await page.waitForTimeout(1500);
  const b = await page.locator(".palco canvas").screenshot({ timeout: 45_000 });
  expect(a.equals(b)).toBe(true);
  await ctx.close();
});

test("a nave carrega e aparece depois da travessia", async ({ page }) => {
  const pedidos: string[] = [];
  page.on("request", (r) => pedidos.push(new URL(r.url()).pathname));
  await page.goto("/");
  await page.waitForSelector('.palco[data-pronta="sim"]', { timeout: 45_000 });
  await expect.poll(() => pedidos.includes("/gl/nave.glb"), { timeout: 45_000 }).toBe(true);
});

test("a chuva anima de verdade", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('.palco[data-pronta="sim"]', { timeout: 45_000 });
  const a = await page.locator(".palco canvas").screenshot({ timeout: 45_000 });
  await page.waitForTimeout(1500);
  const b = await page.locator(".palco canvas").screenshot({ timeout: 45_000 });
  expect(a.equals(b)).toBe(false);
});

// Limites calculados em docs/06-motion-e-webgl.md: garantem tinta-2 em 4,5:1 sobre a cena.
const LIMITES: Record<string, { max?: number; min?: number }> = {
  ouro: { max: 0.0561 },
  fosforo: { max: 0.0672 },
  rubro: { max: 0.0544 },
  purpura: { max: 0.0554 },
  pergaminho: { min: 0.5406, max: 0.92 }, // sem teto, papel estourado para branco passaria
};

// A faixa direita de Contato e de Certificados fica livre de texto em tela larga; aqui a tela é estreita e o teto vale para tudo.
const CASOS = Object.entries(LIMITES).flatMap(([tema, limite]) => ["trajetoria", "formacao", "contato"].map((secao) => ({ tema, limite, secao })));

for (const { tema, limite, secao } of CASOS) {
  test(`legibilidade: a luz da cena respeita o limite atrás do texto (${tema}, ${secao})`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("tema", t), tema);
    await page.goto("/");
    await page.waitForSelector('.palco[data-pronta="sim"]', { timeout: 45_000 });
    await page.evaluate((s) => document.getElementById(s)?.scrollIntoView({ behavior: "instant" as ScrollBehavior }), secao);
    await page.waitForTimeout(3500);
    await page.evaluate(() => {
      document.querySelectorAll<HTMLElement>("main > *:not(.palco), .barra, .fibra").forEach((e) => (e.style.visibility = "hidden"));
    });
    await page.waitForTimeout(400);
    const png = (await page.screenshot({ timeout: 45_000 })).toString("base64");
    const medida = await page.evaluate(async (b64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const lin = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const lums: number[] = [];
      for (let i = 0; i < d.length; i += 4) lums.push(0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]));
      lums.sort((x, y) => x - y);
      return { p005: lums[Math.floor(lums.length * 0.005)], p995: lums[Math.floor(lums.length * 0.995)] };
    }, png);
    console.log(tema, secao, medida);
    if (limite.max) expect(medida.p995).toBeLessThanOrEqual(limite.max);
    if (limite.min) expect(medida.p005).toBeGreaterThanOrEqual(limite.min);
  });
}
