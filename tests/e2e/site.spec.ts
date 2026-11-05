import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROTAS = ["/", "/cv", "/seguranca", "/sistema", "/offline"];

test.describe("segurança", () => {
  for (const rota of ROTAS) {
    test(`CSP sem violações e sem unsafe em script: ${rota}`, async ({ page }) => {
      const erros: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") erros.push(m.text());
      });
      page.on("pageerror", (e) => erros.push(String(e)));
      const r = await page.goto(rota, { waitUntil: "networkidle" });
      const csp = r!.headers()["content-security-policy"];
      expect(csp).toBeTruthy();
      const script = csp.split(";").find((d) => d.trim().startsWith("script-src"))!;
      expect(script).not.toContain("unsafe");
      expect(erros).toEqual([]);
    });
  }

  test("nenhum recurso de terceiros é carregado", async ({ page }) => {
    const externos: string[] = [];
    page.on("request", (q) => {
      if (new URL(q.url()).origin !== new URL(page.url() === "about:blank" ? q.url() : page.url()).origin && !q.url().startsWith("data:")) externos.push(q.url());
    });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(externos).toEqual([]);
  });

  test("a página não cria cookies", async ({ page, context }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    expect(await context.cookies()).toEqual([]);
  });

  test("arquivos públicos existem", async ({ request }) => {
    const sec = await request.get("/.well-known/security.txt");
    expect(await sec.text()).toMatch(/Contact: mailto:.*\nExpires: 20/);
    expect((await request.get("/robots.txt")).status()).toBe(200);
    expect((await request.get("/sitemap.xml")).status()).toBe(200);
    expect((await request.get("/sbom.json")).status()).toBe(200);
  });
});

test.describe("conteúdo sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("tudo pode ser lido, incluindo os 36 certificados", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Warley Ferraz");
    for (const t of ["Sobre", "Agora", "Trajetória", "Formação", "Competências", "Certificados", "Contato"]) {
      await expect(page.getByRole("heading", { level: 2, name: t })).toBeVisible();
    }
    await expect(page.locator(".selo:visible")).toHaveCount(36);
    await expect(page.locator(".filtros").first()).toBeHidden();
    await expect(page.getByRole("button", { name: "Mostrar WhatsApp" })).toHaveCount(0);
  });
  test("o pôster não fica atrás dos textos", async ({ page }) => {
    await page.goto("/");
    const fundo = await page.locator("#sobre").evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(fundo).not.toBe("rgba(0, 0, 0, 0)");
  });
  test("/cv traz cargo, formação e competências", async ({ page }) => {
    await page.goto("/cv");
    await expect(page.locator("main")).toContainText("Linknet Telecomunicações");
    await expect(page.locator("main")).toContainText("Segurança Cibernética");
    await expect(page.locator("main")).toContainText("Burp Suite");
  });
});

test.describe("interações", () => {
  test("recrutador: nome e ações aparecem de imediato", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("link", { name: "Ver currículo" }).click();
    await expect(page).toHaveURL(/\/cv$/);
  });

  test("carregar chunks não dispara transição de rota, que engoliria cliques", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { transicoes: number }).transicoes = 0;
      const original = document.startViewTransition?.bind(document);
      if (original) {
        document.startViewTransition = ((...a: Parameters<typeof original>) => {
          (window as unknown as { transicoes: number }).transicoes++;
          return original(...a);
        }) as typeof document.startViewTransition;
      }
    });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(await page.evaluate(() => (window as unknown as { transicoes: number }).transicoes)).toBe(0);
  });

  test("WhatsApp só existe depois do clique", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    expect(await page.content()).not.toMatch(/wa\.me/);
    await page.getByRole("button", { name: "Mostrar WhatsApp" }).click();
    const link = page.locator('a[href^="https://wa.me/"]');
    await expect(link).toBeVisible();
    await expect(link).toBeFocused();
  });

  test("filtro de competências vai para a URL e pode ser compartilhado", async ({ page }) => {
    await page.goto("/");
    await page.locator("#competencias").getByRole("button", { name: "Segurança" }).click();
    await expect(page).toHaveURL(/area=seguranca/);
    await expect(page.getByText("GPON e FTTH")).toBeHidden();
    await expect(page.getByText("Burp Suite")).toBeVisible();
    await page.reload();
    await expect(page.getByText("GPON e FTTH")).toBeHidden();
    await expect(page.locator("#competencias").getByRole("button", { name: "Segurança" })).toHaveAttribute("aria-pressed", "true");
  });

  test("certificados: 21 principais, 36 ao expandir", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".selo:visible")).toHaveCount(21);
    await page.getByRole("button", { name: "Ver todos os 36" }).click();
    await expect(page.locator(".selo:visible")).toHaveCount(36);
  });

  test("tema é salvo e reaplicado", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 360 });
    await page.goto("/");
    await page.getByRole("button", { name: "Tema" }).click();
    await page.getByRole("menuitem", { name: "Rubro" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-tema", "rubro");
    await page.goto("/cv");
    await expect(page.locator("html")).toHaveAttribute("data-tema", "rubro");
  });

  test("celular: barra cabe na tela e o Índice navega", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 700 });
    await page.goto("/");
    const larguras = await page.evaluate(() => ({ corpo: document.documentElement.scrollWidth, tela: innerWidth }));
    expect(larguras.corpo).toBeLessThanOrEqual(larguras.tela);
    await page.getByRole("button", { name: "Índice" }).click();
    await page.getByRole("link", { name: /Formação/ }).click();
    await expect(page.locator("#formacao")).toBeInViewport();
  });

  test("404 tem status real e caminho de volta", async ({ page }) => {
    const r = await page.goto("/nao-existe");
    expect(r!.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("não existe");
  });
});

test.describe("acessibilidade", () => {
  for (const tema of ["ouro", "pergaminho"]) {
    for (const rota of ["/", "/cv", "/seguranca", "/sistema"]) {
      test(`axe sem violações graves: ${rota} (${tema})`, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem("tema", t), tema);
        await page.goto(rota, { waitUntil: "networkidle" });
        const { violations } = await new AxeBuilder({ page }).analyze();
        const graves = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        expect(graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
      });
    }
  }
  test("um único h1 por rota", async ({ page }) => {
    for (const rota of ROTAS) {
      await page.goto(rota);
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });
});
