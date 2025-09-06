import z from "zod";
import { last10Years } from "./constants";

export const formSchema = z.object({
  financialYear: z
    .string()
    .nonempty("Select a financial year")
    .refine(
      (val) => {
        return last10Years.includes(val);
      },
      {
        message: "Invalid financial year",
      }
    ),
  salary: z
    .string({
      error: "Enter a salary amount",
    })
    .refine((v) => {
      // if v is not a valid number (with optional commas and decimal point), return false
      const salary = v.replaceAll(",", "").replace(".", "").trim();
      return !isNaN(Number(salary)) && salary !== "";
    }, "Enter a valid amount"),

  includesSuper: z.boolean(),
  superRate: z
    .string()
    .refine((v) => {
      // rate should be between 0% and 50%
      const rate = v.replace("%", "").trim();
      const num = Number(rate) / 100;
      return !isNaN(num) && num >= 0 && num <= 0.5;
    }, "Enter a valid super rate between 0% and 50%")
    .transform((v) => {
      const rate = v.replace("%", "").trim();
      return rate;
    }),
});

export type FormValues = z.infer<typeof formSchema>;
