# Australian Tax Calculator (Next.js)

A fast, type-safe calculator for Australian income tax with a streamed AI summary and clean charts.

## Features

- Select financial year (multiple years supported)
- Enter salary and choose **includes/excludes super**
- Computes: **gross tax (brackets only)**, **net income**, **effective tax rate** (Medicare levy optional via separate function)
- Streaming AI summary (Vercel AI SDK + OpenAI)
- Recharts dashboard: composition donut, bracket bar chart, radial effective-rate gauge
- Responsive UI with Tailwind + lightweight components

## Tech

- Next.js, TypeScript, Tailwind CSS v4
- React Hook Form + Zod (input validation)
- Vercel AI SDK (`@ai-sdk/react`) + `@ai-sdk/openai`
- Recharts
- Bun (package manager and scripts)

## Install

```bash
bun install


# Create .env file based on .env.example
cp .env.example .env
# Direct to OpenAI (default)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx

# Optional: Vercel AI Gateway
# AI_GATEWAY_URL=https://ai.gateway.vercel.com/api/openai/v1
# AI_GATEWAY_API_KEY=xxxx
bun dev


### How It Works
### Core Service

TaxCalculatorService takes a flat array of TaxYearConfig (all years) and user input.

Validates inputs with Zod, converts package → base when includesSuper = true, and calculates bracket tax with a pure computeBracketTax helper.

```
