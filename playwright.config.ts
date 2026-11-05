import { defineConfig } from "@playwright/test";

// E2E_BASE aponta os testes para outro alvo, como o contêiner real. Sem ela, sobe o servidor local.
const alvo = process.env.E2E_BASE;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 150_000,
  fullyParallel: true,
  workers: 3,
  use: { baseURL: alvo ?? "http://localhost:3211", colorScheme: "dark", serviceWorkers: "block", launchOptions: { args: ["--disable-3d-apis"] } }, // só cena.spec usa WebGL: em software ele é pesado
  webServer: alvo ? undefined : { command: "npx tsx scripts/servir.ts", env: { PORTA_TESTE: "3211" }, url: "http://localhost:3211/saude.txt", reuseExistingServer: false },
});
