export default async function scrapeTaxRateFromAto() {
  const url =
    "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents";
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      Accept: "text/html",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Connection: "keep-alive",
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);

  return res.text();
}
