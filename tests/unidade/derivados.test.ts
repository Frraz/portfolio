import { describe, expect, it } from "vitest";
import { bitsDoHash, fingerprint, hexdump, horas, tempoDecorrido } from "@/conteudo/derivados";

describe("derivados", () => {
  it("hexdump usa UTF-8 real e marca bytes não imprimíveis", () => {
    const l = hexdump("Aé");
    expect(l).toEqual([{ offset: "00000000", bytes: ["41", "c3", "a9"], ascii: "A.." }]);
  });
  it("hexdump quebra em linhas de 16 bytes", () => {
    const l = hexdump("a".repeat(20));
    expect(l).toHaveLength(2);
    expect(l[1].offset).toBe("00000010");
    expect(l[1].bytes).toHaveLength(4);
  });
  it("fingerprint é estável e muda com o campo", () => {
    const a = fingerprint(["x", "y", null]);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(fingerprint(["x", "y", null])).toBe(a);
    expect(fingerprint(["x", "z", null])).not.toBe(a);
  });
  it("bits do hash têm o tamanho pedido", () => {
    expect(bitsDoHash("ff00", 8)).toBe("11111111");
    expect(bitsDoHash("a".repeat(64), 64)).toHaveLength(64);
  });
  it("tempo decorrido conta meses completos em UTC", () => {
    expect(tempoDecorrido("2022-02", new Date("2026-11-06T12:00:00Z"))).toEqual({ anos: 4, meses: 9 });
    expect(tempoDecorrido("2026-08", new Date("2026-11-06T12:00:00Z"))).toEqual({ anos: 0, meses: 3 });
    expect(tempoDecorrido("2030-01", new Date("2026-11-06T12:00:00Z"))).toEqual({ anos: 0, meses: 0 });
  });
  it("lê horas de curso", () => {
    expect(horas("2.600 h")).toBe(2600);
    expect(horas("420 h")).toBe(420);
    expect(horas("8 h estimadas")).toBe(8);
    expect(horas(null)).toBeNull();
  });
});
