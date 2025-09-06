"use server";

import { taxCalculatorService } from "../../services/tax-calculator";
import { FormValues } from "./schema";

export const calculateTax = async (formValues: FormValues) => {
  return taxCalculatorService.calculate(formValues);
};
