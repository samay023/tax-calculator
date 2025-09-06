import TaxCalculatorService from "./service";
import taxConfig from "../../scripts/generateTaxConfig/tax-config.json";

export const taxCalculatorService = new TaxCalculatorService(taxConfig);
