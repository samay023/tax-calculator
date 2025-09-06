import {
  RawCalculatorInput,
  TaxResult,
  TaxBreakdownSlice,
  TaxYearConfig,
  TaxBracket,
} from "./types";

export const computeBracketTax = (
  taxableIncome: number,
  brackets: readonly TaxBracket[]
) => {
  const sorted = [...brackets].sort((a, b) => a.threshold - b.threshold);

  let remaining = taxableIncome;
  let grossTax = 0;
  const slices: TaxBreakdownSlice[] = [];

  for (let i = sorted.length - 1; i >= 0; i--) {
    const { threshold, rate } = sorted[i];
    if (remaining > threshold) {
      const amount = round2(remaining - threshold);
      const sliceTax = round2(amount * rate);
      grossTax = round2(grossTax + sliceTax);
      slices.push({
        from: threshold,
        to: remaining,
        amount,
        rate,
        tax: sliceTax,
      });
      remaining = threshold;
    }
  }
  return { grossTax, breakdown: slices.reverse() };
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const round6 = (n: number) => Math.round(n * 1_000_000) / 1_000_000;

export default class TaxCalculatorService {
  private readonly index: ReadonlyMap<string, TaxYearConfig>;

  constructor(configs: readonly TaxYearConfig[]) {
    this.index = new Map(configs.map((c) => [c.financialYear, c]));
  }

  public calculate(input: RawCalculatorInput): TaxResult {
    const cfg = this.index.get(input.financialYear);

    if (!cfg) {
      throw new Error(
        `No tax config found for financialYear ${input.financialYear}`
      );
    }

    const baseSalary = input.includesSuper
      ? +input.salary / (1 + +input.superRate)
      : input.salary;

    const taxableIncome = round2(Math.max(0, +baseSalary));

    const { grossTax, breakdown } = computeBracketTax(
      taxableIncome,
      cfg.brackets
    );
    const effectiveTaxRate =
      taxableIncome > 0 ? round6(grossTax / taxableIncome) : 0;

    return {
      financialYear: cfg.financialYear,
      includesSuper: input.includesSuper,
      superRateDecimal: +input.superRate,
      inputSalary: round2(+input.salary),
      baseSalary: round2(+baseSalary),
      taxableIncome,
      grossTax,
      effectiveTaxRate,
      bracketBreakdown: breakdown,
    };
  }
}
