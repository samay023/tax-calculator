import { describe, it, expect } from "bun:test";
import TaxCalculatorService, { computeBracketTax } from "./service";
import { RawCalculatorInput, TaxYearConfig, TaxBracket } from "./types";

const simpleBrackets: TaxBracket[] = [
  { threshold: 0, rate: 0 },
  { threshold: 10_000, rate: 0.1 },
  { threshold: 20_000, rate: 0.2 },
  { threshold: 50_000, rate: 0.3 },
];

const configurations: TaxYearConfig[] = [
  { financialYear: "2025-2026", brackets: simpleBrackets },
];

describe("computeBracketTax", () => {
  it("calculates slices and totals for 25000", () => {
    const { grossTax, breakdown } = computeBracketTax(25_000, simpleBrackets);
    expect(grossTax).toBeCloseTo(2_000, 2);
    expect(breakdown.length).toBe(3);
    expect(breakdown[0].from).toBe(0);
    expect(breakdown[breakdown.length - 1].to).toBe(25_000);
    for (let index = 1; index < breakdown.length; index++) {
      expect(breakdown[index - 1].to).toBe(breakdown[index].from);
    }
  });

  it("calculates slices and totals for 100000", () => {
    const { grossTax, breakdown } = computeBracketTax(100_000, simpleBrackets);
    expect(grossTax).toBeCloseTo(22_000, 2);
    expect(breakdown.length).toBe(4);
    expect(breakdown[0].from).toBe(0);
    expect(breakdown[breakdown.length - 1].to).toBe(100_000);
  });
});

describe("TaxCalculatorService.calculate", () => {
  it("throws when financial year is missing", () => {
    const service = new TaxCalculatorService(configurations);
    const input: RawCalculatorInput = {
      financialYear: "2099-2100",
      includesSuper: false,
      salary: "50000",
      superRate: "0.1",
    };
    expect(() => service.calculate(input)).toThrow(/No tax config found/);
  });

  it("calculates when salary excludes super", () => {
    const service = new TaxCalculatorService(configurations);
    const input: RawCalculatorInput = {
      financialYear: "2025-2026",
      includesSuper: false,
      salary: "25000",
      superRate: "0.1",
    };
    const result = service.calculate(input);
    expect(result.baseSalary).toBeCloseTo(25_000, 2);
    expect(result.taxableIncome).toBeCloseTo(25_000, 2);
    expect(result.grossTax).toBeCloseTo(2_000, 2);
    expect(result.bracketBreakdown.length).toBe(3);
    expect(result.effectiveTaxRate).toBeCloseTo(2000 / 25000, 6);
  });

  it("calculates when salary includes super", () => {
    const service = new TaxCalculatorService(configurations);
    const input: RawCalculatorInput = {
      financialYear: "2025-2026",
      includesSuper: true,
      salary: "110000",
      superRate: "0.1",
    };
    const result = service.calculate(input);
    expect(result.baseSalary).toBeCloseTo(100_000, 2);
    expect(result.taxableIncome).toBeCloseTo(100_000, 2);
    expect(result.grossTax).toBeCloseTo(22_000, 2);
    expect(result.bracketBreakdown.length).toBe(4);
    expect(result.effectiveTaxRate).toBeCloseTo(0.22, 6);
  });

  it("handles rounding", () => {
    const service = new TaxCalculatorService([
      {
        financialYear: "2025-2026",
        brackets: [
          { threshold: 0, rate: 0 },
          { threshold: 1_000, rate: 0.5 },
        ],
      },
    ]);
    const input: RawCalculatorInput = {
      financialYear: "2025-2026",
      includesSuper: false,
      salary: "1000.999",
      superRate: "0.1",
    };
    const result = service.calculate(input);
    expect(result.taxableIncome).toBeCloseTo(1001.0, 2);
    expect(result.grossTax).toBeCloseTo(0.5, 2);
    expect(result.effectiveTaxRate).toBeCloseTo(0.5 / 1001, 6);
  });
});
