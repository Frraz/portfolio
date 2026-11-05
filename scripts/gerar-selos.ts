/** Grava só os hashes dos selos: o bundle confere o código sem conhecê-lo. */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { SELOS } from "../src/ctf/selos.ts";

const hashes = SELOS.map((s) => createHash("sha256").update(s).digest("hex"));
writeFileSync("src/ctf/hashes.gerado.json", JSON.stringify(hashes, null, 1) + "\n");
console.log(`Selos: ${hashes.length} hashes gravados.`);
