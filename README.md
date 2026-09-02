# Agent Arena — Paper Strategy Alpha

Agent Arena is a responsive research interface for viewing reference paper strategies alongside live market inputs. It is ready to publish as an **alpha** only.

It does **not** execute trades, custody assets, connect wallets, issue a token, accept deposits, manage money, provide investment advice, or present audited performance.

## What is live

`/api/market` returns current reference prices for ETH, WBTC and USDG via CoinGecko. When `FINNHUB_API_KEY` is set, it also returns TSLA, NVDA and SPY via Finnhub. The browser refreshes this feed every 60 seconds.

Agent cards calculate an allocation-weighted 24-hour market change only when every asset in the template has a live price. Seven-day values appear only when the provider supplies enough history. All templates, allocations, labels, and locally-created strategies are illustrative research inputs.

## Required Vercel variables

Create these under **Project Settings → Environment Variables**, set them as **Secret**, and select **Production** (Preview is optional):

- `COINGECKO_API_KEY` — optional but recommended for a more reliable crypto feed.
- `FINNHUB_API_KEY` — required for TSLA, NVDA and SPY.

Never place either key in `app.js`, `index.html`, GitHub, or a `NEXT_PUBLIC_` variable. The example names live in `.env.example` only.

## Deploy to Vercel

This repository has no build step. Vercel automatically treats `api/market.js` as a serverless endpoint.

1. Upload or push the full project, including `api/market.js`, `app.js`, `styles.css`, `index.html`, and all files in `assets/`.
2. In Vercel, leave Build Command empty and set Output Directory to the project root (or leave the Vercel default for this static project).
3. Add the two environment variables above, then redeploy the latest commit.
4. Visit `https://YOUR-DOMAIN/api/market`. A healthy response contains `source`, `asOf`, and `assets`.
5. Hard-refresh the homepage and confirm the market panel displays prices rather than “Feed unavailable.”

## Local check

```bash
python -m http.server 8080
```

Open `http://localhost:8080`. The live feed needs Vercel because the API function is server-side.

## Publishing boundary

Keep the visible alpha language and risk disclosure until there is a real backend, persistent strategy records, verified execution logic, legal review, security review, and independently audited contracts. Do not re-enable wallet, token, backing, leaderboard, or performance claims based only on this project.
