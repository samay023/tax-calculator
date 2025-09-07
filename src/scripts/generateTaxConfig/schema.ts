import { z } from "zod";

export const BracketSchema = z
  .object({
    threshold: z.number(),
    rate: z.number(), // decimal (e.g., 0.3 for 30%)
  })
  .strict();

export const TaxYearSchema = z.object({
  financialYear: z.string(), // e.g. "2025-2026"
  brackets: z.array(BracketSchema).min(1),
});

export const TaxSchema = z.array(TaxYearSchema);

// Types
export type TaxBracket = z.infer<typeof BracketSchema>;
export type TaxYearConfig = z.infer<typeof TaxYearSchema>;
export type TaxConfigList = z.infer<typeof TaxSchema>;
