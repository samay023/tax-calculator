import dotEnv from "dotenv";
dotEnv.config();

import { openai } from "@ai-sdk/openai";
import fs from "fs/promises";
import path from "path";
import { AIService } from "../../services/ai";
import { SYSTEM_PROMPT } from "./prompt";
import { TaxSchema } from "./schema";
import scrapeTaxRateHTMLFromAto from "./scraper";

const model = openai("gpt-4o-2024-11-20");

const removeFileIfExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch {
    // File does not exist or other error
  }
};

const main = async () => {
  const userPrompt = await scrapeTaxRateHTMLFromAto();
  const aiService = new AIService(model);

  const { object: result } = await aiService.getJsonResponse(
    TaxSchema,
    "array",
    SYSTEM_PROMPT,
    userPrompt
  );

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
