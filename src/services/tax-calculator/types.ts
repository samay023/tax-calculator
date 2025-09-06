export type TaxBracket = {
  threshold: number; // first dollar where this rate applies (0, 18201, …)
  rate: number; // decimal (0.30 = 30%)
};

export type TaxYearConfig = {
  financialYear: string; // "2025-2026"
  brackets: TaxBracket[];
};

export type RawCalculatorInput = {
  financialYear: string;
  includesSuper: boolean;
  salary: string;
  superRate: string;
};

export type TaxBreakdownSlice = {
  from: number;
  to: number;
  amount: number;
  rate: number;
  tax: number;
};

export type TaxResult = {
  financialYear: string;
  includesSuper: boolean;
  superRateDecimal: number; // normalized (0.5 for "50")
  inputSalary: number; // parsed salary
  baseSalary: number; // excl. super
  taxableIncome: number;
  grossTax: number; // brackets only
  effectiveTaxRate: number; // grossTax / taxableIncome
  bracketBreakdown: TaxBreakdownSlice[];
};
