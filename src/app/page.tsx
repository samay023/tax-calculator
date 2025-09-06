"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaxCalculatorForm from "../components/tax-calculator-form";
import { useState } from "react";
import { calculateTax } from "../components/tax-calculator-form/actions";
import { TaxResult } from "../services/tax-calculator/types";
import StreamedBreakdownClient from "../components/tax-result-card/index";

export default function Home() {
  const [taxBreakdownResult, setTaxBreakdownResult] =
    useState<TaxResult | null>(null);

  return (
    <main className="container my-10">
      <h1 className="mb-6 text-2xl font-bold">Australian Tax Calculator</h1>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Tax Calculator (full time residents)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <TaxCalculatorForm
            onSubmit={async (values) => {
              const result = await calculateTax(values);

              setTaxBreakdownResult(result);
            }}
          />
        </CardContent>
        <CardContent>
          {taxBreakdownResult && (
            <StreamedBreakdownClient result={taxBreakdownResult} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
