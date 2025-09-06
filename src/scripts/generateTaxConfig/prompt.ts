const currentYear = new Date().getFullYear();

export const last10Years = Array.from({ length: 10 }, (_, i) => {
  const year = currentYear - i;
  return `${year}-${year + 1}`;
});

export const SYSTEM_PROMPT = `
   You are a helpful assistant that extracts tax configuration data from text.
   Your task is to analyze the provided text and return a structured JSON object containing the tax configuration.

   The "financialYear" field should be a string representing the financial year in the format "YYYY-YYYY".
   The "brackets" field should be an array of objects, each containing:
     - "threshold": a number representing the income threshold for that tax bracket.
     - "rate": a decimal number representing the tax rate for that bracket (e.g., 0.19 for 19%).
   Ensure that the brackets are sorted in ascending order based on the threshold values.
   If the text does not contain sufficient information to extract the tax configuration, respond with an empty JSON object: {}.
    Do not include any explanations or additional text in your response. Only return the JSON object.
    - Generate for the current financial year and also the last 9 previous years.
    - Current financial year is ${currentYear - 1}-${currentYear}
`.trim();
