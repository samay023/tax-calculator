import dotEnv from "dotenv";
dotEnv.config();
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { TaxSchema } from "./schema";

import scrapeTaxRateHTMLFromAto from "./scraper";
import { SYSTEM_PROMPT } from "./prompt";
import fs from "fs/promises";
import path from "path";

const model = openai("gpt-4o-2024-11-20");

const removeFileIfExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (err) {
    // File does not exist or other error
  }
};

const main = async () => {
  const text = await scrapeTaxRateHTMLFromAto();

  const { object: result } = await generateObject({
    model,
    prompt: text.slice(0, 200_000), // limit to first 300k chars
    schema: TaxSchema,
    output: "array",
    temperature: 0,
    system: SYSTEM_PROMPT,
  });

  const outPath = path.join(__dirname, "tax-config.json");
  await removeFileIfExists(outPath);
  await fs.writeFile(outPath, JSON.stringify(result.flat(), null, 2));
};

main()
  .then(() => {
    console.log("Successfully generated the tax config.");
  })
  .catch((err) => {
    console.error("Error running generateTaxConfig script:", err);
    process.exit(1);
  });
