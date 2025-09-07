# Australian Tax Calculator (Next.js)

A fast, type-safe calculator for Australian income tax with charts.

## Features

- Select financial year (multiple years supported)
- Enter salary and choose **includes/excludes super**
- Computes: **gross tax (brackets only)**, **net income**, **effective tax rate** (Medicare levy optional via separate function)
- Recharts dashboard: composition donut, bracket bar chart, radial effective-rate gauge
- Responsive UI with Tailwind + lightweight components

## Tech

- Next.js, TypeScript, Tailwind CSS v4
- React Hook Form + Zod (input validation)
- Vercel AI SDK (`@ai-sdk/react`) + `@ai-sdk/openai`
- Recharts
- Bun (package manager and scripts)

## Install

````bash
bun install


# Create .env file based on .env.example
cp .env.example .env
# Direct to OpenAI (default)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx

# Optional: Vercel AI Gateway
# AI_GATEWAY_URL=https://ai.gateway.vercel.com/api/openai/v1
# AI_GATEWAY_API_KEY=xxxx
bun dev


### Generate Tax Config to auto-fill tax years and brackets. It scrapes the ATO website and uses GPT-4 to parse the HTML into structured JSON.
```bash
bun setup:tax-config
````

This creates `src/config/tax-config.json` which is imported by the app.
