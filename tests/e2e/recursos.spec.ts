import { expect, test } from "@playwright/test";

test.describe("terminal", () => {
  test("abre por teclado, responde e devolve o foco", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.keyboard.press("Control+k");
    const entrada = page.getByRole("textbox", { name: "Comando" });
    await expect(entrada).toBeFocused();
    await entrada.fill("whoami");
    await entrada.press("Enter");
    await expect(page.getByRole("log")).toContainText("Analista de Redes N2");
    await entrada.fill("cabecalhos");
    await entrada.press("Enter");
    await expect(page.getByRole("log")).toContainText("content-security-policy: default-src 'none'");
    await expect(page.getByRole("log")).toContainText("x-selo: CABECALHO-HTTP");
    await page.keyboard.press("Escape");
    await expect(entrada).toBeHidden();
  });

  test("tema pelo terminal e histórico por seta", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.keyboard.press("Control+k");
    const entrada = page.getByRole("textbox", { name: "Comando" });
    await entrada.fill("tema rubro");
    await entrada.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-tema", "rubro");
    await entrada.press("ArrowUp");
    await expect(entrada).toHaveValue("tema rubro");
  });

  test("não expõe o telefone nem em certificados nem em contato", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.keyboard.press("Control+k");
    const entrada = page.getByRole("textbox", { name: "Comando" });
    for (const cmd of ["contato", "sobre", "agora"]) {
      await entrada.fill(cmd);
      await entrada.press("Enter");
    }
    await expect(page.getByRole("log")).not.toContainText(/\(\d{2}\) \d{5}/);
    await expect(page.getByRole("log")).toContainText("seção Contato");
  });
});

test.describe("CTF", () => {
  test("os selos estão nos lugares públicos e o progresso fica só no navegador", async ({ page, request }) => {
    const r = await page.goto("/", { waitUntil: "networkidle" });
    expect(r!.headers()["x-selo"]).toBe("CABECALHO-HTTP");
    expect(await (await request.get("/")).text()).toContain("selo 0: FONTE-VISTA");
    expect(await (await request.get("/robots.txt")).text()).toContain("selo 2: ROBOS-LEEM");
    expect(await (await request.get("/.well-known/security.txt")).text()).toContain("selo 4: SECURITY-TXT");
    expect(await page.content()).toContain("selo 6: METADADO-SVG");
    await page.keyboard.press("Control+k");
    const entrada = page.getByRole("textbox", { name: "Comando" });
    await entrada.fill("selo lumen");
    await entrada.press("Enter");
    await expect(page.getByRole("log")).toContainText("selo 7 confirmado");
    expect(await page.evaluate(() => localStorage.getItem("selos"))).toBe("[7]");
  });

  test("o console traz a assinatura e o selo 1", async ({ page }) => {
    const mensagens: string[] = [];
    page.on("console", (m) => mensagens.push(m.text()));
    await page.goto("/", { waitUntil: "networkidle" });
    await expect.poll(() => mensagens.join("\n")).toContain("selo 1: CONSOLE-ABERTO");
  });

  test("selo em Lottie roda sob a CSP real", async ({ page }) => {
    const erros: string[] = [];
    page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
    page.on("pageerror", (e) => erros.push(String(e)));
    await page.goto("/", { waitUntil: "networkidle" });
    await page.keyboard.press("Control+k");
    const entrada = page.getByRole("textbox", { name: "Comando" });
    await entrada.fill("selo fonte-vista");
    await entrada.press("Enter");
    await expect(page.locator(".selo-sigilo svg")).toBeVisible();
    expect(erros).toEqual([]);
  });

  test("os nove selos liberam o tema Selado", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("selos", "[0,1,2,3,4,5,6,7,8]"));
    await page.goto("/", { waitUntil: "networkidle" });
    await page.keyboard.press("Control+k");
    const entrada = page.getByRole("textbox", { name: "Comando" });
    await entrada.fill("tema selado");
    await entrada.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-tema", "selado");
  });
});

test.describe("Divisor", () => {
  test("a luz chega às oito ONUs por clique e anuncia cada painel", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    const grupo = page.getByRole("group", { name: "Simulação da divisão de luz em uma rede GPON" });
    await grupo.scrollIntoViewIfNeeded();
    const clicar = (nome: string) => grupo.getByRole("button", { name: nome, exact: true }).click({ timeout: 6000 });
    await expect(grupo.getByRole("button", { name: "ONU 4", exact: true })).toBeDisabled();
    await clicar("OLT 1");
    for (const d of ["Divisor 2", "Divisor 9"]) await clicar(d);
    for (const d of ["Divisor 3", "Divisor 6", "Divisor 10", "Divisor 13"]) await clicar(d);
    await expect(grupo.locator(".petala.acesa")).toHaveCount(9);
    await expect(grupo.getByText("Os oito painéis estão acesos")).toBeAttached();
    await expect(page.getByText("Desenho ilustrativo. Sem dados de nenhuma rede real.")).toBeVisible();
    await page.reload({ waitUntil: "networkidle" });
    await expect(grupo.locator(".petala.acesa")).toHaveCount(9);
  });

  test("funciona só com teclado", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const grupo = page.getByRole("group", { name: "Simulação da divisão de luz em uma rede GPON" });
    const olt = grupo.getByRole("button", { name: "OLT 1", exact: true });
    await olt.focus();
    await page.keyboard.press("Enter");
    await expect(olt).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("ArrowRight");
    await expect(grupo.getByRole("button", { name: /Divisor/ }).first()).toBeFocused();
  });
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("sem trilho, sem Lenis e com todo o conteúdo no estado final", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("data-movimento", "pronto");
    const altura = await page.locator(".hero-trilho").evaluate((e) => e.getBoundingClientRect().height);
    expect(altura).toBeLessThanOrEqual((await page.viewportSize())!.height + 1);
    expect(await page.locator("html").getAttribute("class")).not.toContain("lenis");
    // A tela branca fica pronta, sem transição.
    const papel = await page.locator(".inicial").evaluate((e) => getComputedStyle(e, "::before").opacity);
    expect(papel).toBe("1");
    const fim = await page.locator(".lanceta-janela").first().evaluate((e) => getComputedStyle(e).getPropertyValue("--luz"));
    expect(Number(fim)).toBeGreaterThan(0);
  });

  test("Divisor acende na hora", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const grupo = page.getByRole("group", { name: "Simulação da divisão de luz em uma rede GPON" });
    await grupo.getByRole("button", { name: "OLT 1", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(grupo.locator(".divisor-luz path")).toHaveCount(2);
  });
});

test.describe("rolagem", () => {
  test("o hero fica preso, o texto sai e reaparece ao voltar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveClass(/lenis/);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, innerHeight * 0.9));
    await expect(h1).toBeHidden({ timeout: 5000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(h1).toBeVisible({ timeout: 5000 });
  });

  test("a tela branca dispara uma vez e fica", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("data-movimento", "pronto");
    const opacidade = () => page.locator(".inicial").evaluate((e) => Number(getComputedStyle(e, "::before").opacity));
    await expect.poll(opacidade).toBe(0);
    await page.locator(".inicial").scrollIntoViewIfNeeded();
    await expect.poll(opacidade, { timeout: 5000 }).toBe(1);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    expect(await opacidade()).toBe(1);
  });

  test("âncora do Índice para abaixo da barra", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Formação", exact: true }).click();
    await expect(page.locator("#formacao")).toBeInViewport();
    await expect.poll(async () => page.locator("#formacao").evaluate((e) => Math.round(e.getBoundingClientRect().top)), { timeout: 5000 }).toBeLessThan(120);
  });
});

test("o som liga por clique, sem erro, e o botão reflete o estado", async ({ page }) => {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(String(e)));
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Ligar som" }).click();
  const desligar = page.getByRole("button", { name: "Desligar som" });
  await expect(desligar).toHaveAttribute("aria-pressed", "true");
  await desligar.click();
  await expect(page.getByRole("button", { name: "Ligar som" })).toBeVisible();
  expect(erros).toEqual([]);
});

test.describe("service worker e offline", () => {
  test.use({ serviceWorkers: "allow" });

  test("registra, faz o pré-cache e cai em /offline sem rede", async ({ page, context }) => {
    await page.goto("/cv", { waitUntil: "networkidle" });
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
    await expect.poll(() => page.evaluate(async () => (await caches.keys()).some((k) => k.startsWith("nave-"))), { timeout: 20000 }).toBe(true);
    await expect.poll(() => page.evaluate(async () => !!(await caches.match("/offline"))), { timeout: 20000 }).toBe(true);
    await page.reload({ waitUntil: "networkidle" }); // o controlador assume
    await context.setOffline(true);
    await page.goto("/cv");
    await expect(page.locator("main")).toContainText("Linknet Telecomunicações");
    await page.goto("/seguranca").catch(() => {});
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Sem conexão|Segurança/);
    await context.setOffline(false);
  });
});

test("manifesto e transição de rota não violam a CSP", async ({ page, request }) => {
  const erros: string[] = [];
  page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  page.on("pageerror", (e) => erros.push(String(e)));
  expect((await request.get("/manifest.webmanifest")).status()).toBe(200);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Ver currículo" }).click();
  await expect(page).toHaveURL(/\/cv$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(erros).toEqual([]);
});
