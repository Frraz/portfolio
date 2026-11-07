import next from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";

// Pastas ocultas (configurações locais de editor e ferramentas) ficam fora do lint.
const config = [...next, ...ts, { ignores: [".*/", ".next/", "out/", "public/", "scripts/*.py"] }];
export default config;
