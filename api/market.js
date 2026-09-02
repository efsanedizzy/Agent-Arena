/** Live market observation only. Agent execution and backing are not handled here. */
module.exports = async function handler(request, response) {
  const cryptoUrl = new URL('https://api.coingecko.com/api/v3/coins/markets');
  cryptoUrl.search = new URLSearchParams({ vs_currency: 'usd', ids: 'ethereum,bitcoin', price_change_percentage: '7d' }).toString();
  const cryptoHeaders = { Accept: 'application/json' };
  if (process.env.COINGECKO_API_KEY) cryptoHeaders['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;

  const cryptoRequest = fetch(cryptoUrl, { headers: cryptoHeaders, signal: AbortSignal.timeout(8000) })
    .then(async result => { if (!result.ok) throw new Error('Crypto provider unavailable'); return result.json(); });
  const stockRequest = async symbol => {
    if (!process.env.FINNHUB_API_KEY) return null;
    const url = new URL('https://finnhub.io/api/v1/quote');
    url.search = new URLSearchParams({ symbol, token: process.env.FINNHUB_API_KEY }).toString();
    const candleUrl = new URL('https://finnhub.io/api/v1/stock/candle');
    const to = Math.floor(Date.now() / 1000), from = to - 8 * 24 * 60 * 60;
    candleUrl.search = new URLSearchParams({ symbol, resolution: 'D', from: String(from), to: String(to), token: process.env.FINNHUB_API_KEY }).toString();
    const [quoteResult, candleResult] = await Promise.all([
      fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) }),
      fetch(candleUrl, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) })
    ]);
    if (!quoteResult.ok || !candleResult.ok) throw new Error(`${symbol} market data unavailable`);
    const [quote, candles] = await Promise.all([quoteResult.json(), candleResult.json()]);
    const firstClose = Array.isArray(candles.c) ? candles.c.find(Number.isFinite) : null;
    const change7d = Number.isFinite(firstClose) && firstClose > 0 ? ((quote.c / firstClose) - 1) * 100 : null;
    return Number.isFinite(quote.c) && quote.c > 0 ? { symbol, priceUsd: quote.c, change24h: Number(quote.dp) || 0, change7d } : null;
  };

  try {
    const [crypto, tsla, nvda, spy] = await Promise.all([cryptoRequest, stockRequest('TSLA'), stockRequest('NVDA'), stockRequest('SPY')]);
    const assets = [
      { symbol: 'ETH', priceUsd: crypto.find(asset => asset.id === 'ethereum')?.current_price ?? null, change24h: crypto.find(asset => asset.id === 'ethereum')?.price_change_percentage_24h ?? null, change7d: crypto.find(asset => asset.id === 'ethereum')?.price_change_percentage_7d_in_currency ?? null },
      { symbol: 'WBTC', priceUsd: crypto.find(asset => asset.id === 'bitcoin')?.current_price ?? null, change24h: crypto.find(asset => asset.id === 'bitcoin')?.price_change_percentage_24h ?? null, change7d: crypto.find(asset => asset.id === 'bitcoin')?.price_change_percentage_7d_in_currency ?? null },
      { symbol: 'USDG', priceUsd: 1, change24h: 0, change7d: 0 },
      tsla, nvda, spy
    ].filter(asset => asset && Number.isFinite(asset.priceUsd));
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=60');
    response.status(200).json({ source: process.env.FINNHUB_API_KEY ? 'CoinGecko + Finnhub' : 'CoinGecko', asOf: new Date().toISOString(), assets });
  } catch (error) {
    response.setHeader('Cache-Control', 'no-store');
    response.status(503).json({ error: 'Live market data is temporarily unavailable.' });
  }
};
