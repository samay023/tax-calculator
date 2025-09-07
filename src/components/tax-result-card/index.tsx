"use client";
import * as React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  LabelList,
  RadialBarChart,
  RadialBar,
} from "recharts";

/** Minimal shape expected; matches your TaxResult fields. */
type TaxBreakdownSlice = {
  from: number;
  to: number;
  amount: number;
  rate: number; // decimal
  tax: number;
};

type TaxResultLike = {
  financialYear: string;
  includesSuper: boolean;
  superRateDecimal: number; // decimal
  inputSalary: number;
  baseSalary: number;
  taxableIncome: number;
  grossTax: number;
  effectiveTaxRate: number; // decimal
  bracketBreakdown: TaxBreakdownSlice[];
};

type Props = { result: TaxResultLike };

const CURRENCY = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});
const PERCENT = new Intl.NumberFormat("en-AU", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

const COLORS = {
  tax: "#ef4444",
  net: "#22c55e",
  super: "#6366f1",
  bar: "#0ea5e9",
  grid: "#e5e7eb",
  gauge: "#8b5cf6",
  gaugeTrack: "#ede9fe",
};

function toRangeLabel(s: TaxBreakdownSlice) {
  const nf = new Intl.NumberFormat("en-AU");
  return `${nf.format(s.from)}–${nf.format(s.to)}`;
}

function buildComposition(result: TaxResultLike) {
  const net = Math.max(0, result.taxableIncome - result.grossTax);
  const parts = [
    {
      name: "Tax",
      value: Number(result.grossTax.toFixed(2)),
      fill: COLORS.tax,
    },
    { name: "Net income", value: Number(net.toFixed(2)), fill: COLORS.net },
  ];
  if (result.includesSuper) {
    const superPortion = Math.max(0, result.inputSalary - result.baseSalary);
    if (superPortion > 0) {
      parts.push({
        name: "Super (package)",
        value: Number(superPortion.toFixed(2)),
        fill: COLORS.super,
      });
    }
  }
  return parts;
}

function buildSlices(result: TaxResultLike) {
  return result.bracketBreakdown.map((s) => ({
    label: toRangeLabel(s),
    tax: Number(s.tax.toFixed(2)),
    amount: Number(s.amount.toFixed(0)),
    ratePct: Number((s.rate * 100).toFixed(1)),
  }));
}

export default function TaxResultDashboard({ result }: Props) {
  const composition = React.useMemo(() => buildComposition(result), [result]);
  const slices = React.useMemo(() => buildSlices(result), [result]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* KPIs */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="mb-3 text-sm text-zinc-500">
          Summary – {result.financialYear}
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div>Package</div>
          <div className="text-right">
            {CURRENCY.format(result.inputSalary)}
          </div>
          <div>Base salary</div>
          <div className="text-right">{CURRENCY.format(result.baseSalary)}</div>
          <div>Taxable income</div>
          <div className="text-right">
            {CURRENCY.format(result.taxableIncome)}
          </div>
          <div>Gross tax</div>
          <div className="text-right text-red-600">
            {CURRENCY.format(result.grossTax)}
          </div>
          <div>Effective tax rate</div>
          <div className="text-right">
            {PERCENT.format(result.effectiveTaxRate)}
          </div>
          {result.includesSuper && (
            <>
              <div>Super rate</div>
              <div className="text-right">
                {PERCENT.format(result.superRateDecimal)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Effective rate gauge */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="mb-3 text-sm text-zinc-500">Effective tax rate</div>
        <div className="h-56">
          <ResponsiveContainer>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={[
                {
                  name: "rate",
                  value: result.effectiveTaxRate * 100,
                  fill: COLORS.gauge,
                },
              ]}
              startAngle={220}
              endAngle={-40}
            >
              <RadialBar background dataKey="value" cornerRadius={8} />
              {/* simple track */}
              <RadialBar
                data={[{ name: "track", value: 100, fill: COLORS.gaugeTrack }]}
                dataKey="value"
                cornerRadius={8}
                fillOpacity={0.35}
              />
              <Tooltip
                formatter={(v) => [`${Number(v).toFixed(2)}%`, "Rate"]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center text-2xl font-semibold">
          {PERCENT.format(result.effectiveTaxRate)}
        </div>
      </div>

      {/* Composition donut */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="mb-3 text-sm text-zinc-500">Income composition</div>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={composition}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
              >
                {composition.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
                <LabelList
                  position="outside"
                  formatter={(v: string) => `${CURRENCY.format(Number(v))}`}
                />
              </Pie>
              <Tooltip formatter={(v, n) => [CURRENCY.format(Number(v)), n]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tax by bracket slice */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="mb-3 text-sm text-zinc-500">Tax by bracket slice</div>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={slices} margin={{ left: 8, right: 8 }}>
              <CartesianGrid stroke={COLORS.grid} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tickFormatter={(v) => CURRENCY.format(Number(v))}
                width={80}
              />
              <Tooltip
                formatter={(v, n, p) => {
                  if (n === "tax") return [CURRENCY.format(Number(v)), "Tax"];
                  if (n === "amount")
                    return [CURRENCY.format(Number(v)), "Amount taxed"];
                  if (n === "ratePct") return [`${v}%`, "Rate"];
                  return [v, n];
                }}
              />
              <Bar dataKey="tax" fill={COLORS.bar} radius={6}>
                <LabelList
                  dataKey="ratePct"
                  position="top"
                  formatter={(v: string) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          Bar height shows tax from each slice; label shows that slice’s
          marginal rate.
        </p>
      </div>
    </div>
  );
}
