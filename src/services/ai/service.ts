import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import z from "zod";

export class AIService {
  // Use dependency injection to allow usage of any models
  constructor(private model: ReturnType<typeof openai.languageModel>) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY environment variable");
    }
  }

  public getJsonResponse = async <T>(
    schema: z.ZodType<T>,
    output: "array" | "object" = "object",
    systemPrompt: string,
    userPrompt: string
  ) => {
    return generateObject({
      model: this.model,
      prompt: userPrompt.slice(0, 200_000), // limit to first 300k chars
      schema: schema,
      output: output,
      temperature: 0,
      system: systemPrompt,
    });
  };
}
