/**
 * Vercel serverless function. Keeps optional provider credentials off the client.
 * This endpoint is for live market observation only, not portfolio valuation or execution.
 */
module.exports = async function handler(request, response) {
  const endpoint = new URL('https://api.coingecko.com/api/v3/simple/price');
  endpoint.search = new URLSearchParams({
    ids: 'ethereum,bitcoin',
    vs_currencies: 'usd',
    include_24hr_change: 'true'
  }).toString();

  const headers = { Accept: 'application/json' };
  if (process.env.COINGECKO_API_KEY) headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;

  try {
    const upstream = await fetch(endpoint, { headers, signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) throw new Error(`Market provider returned ${upstream.status}`);
    const prices = await upstream.json();
    const read = (id, symbol) => ({
      symbol,
      priceUsd: prices[id]?.usd ?? null,
      change24h: prices[id]?.usd_24h_change ?? null
    });
    response.setHeader('Cache-Control', 's-maxage=45, stale-while-revalidate=30');
    response.status(200).json({ source: 'CoinGecko', asOf: new Date().toISOString(), assets: [read('ethereum', 'ETH'), read('bitcoin', 'WBTC')] });
  } catch (error) {
    response.setHeader('Cache-Control', 'no-store');
    response.status(503).json({ error: 'Live market data is temporarily unavailable.' });
  }
}
