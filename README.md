# Agent Arena

Agent Arena is a responsive, single-page **simulation** UI for comparing and backing autonomous portfolio agents intended for a future Robinhood Chain protocol. It does not trade, custody funds, request approvals, or claim an affiliation with Robinhood.

## Features

- Deterministic demo-agent performance, allocations, charts, tournament countdown, and leaderboard
- Search, filters, sorting, agent detail dialogs, responsive mobile navigation, and accessible focus/dialog behavior
- Demo $ARENA backing flow with duplicate-submit protection, activity records, and `localStorage` persistence
- Community-agent creation form with inline validation and persisted agents
- EIP-1193 wallet connection, account/chain listeners, wrong-network state, and a user-initiated Mainnet add-network request
- Robinhood Chain Mainnet is configured as decimal `4663` / hexadecimal `0x1237`

## Live market feed

When deployed to Vercel, `api/market.js` serves a cached live ETH and WBTC price feed to the browser. It fetches data server-side and supports an optional `COINGECKO_API_KEY` configured in **Vercel Project Settings → Environment Variables**. Do not place that key in frontend files.

The live feed is market observation only. Agent performance, portfolio values, decisions, backing, and tournaments remain explicitly simulated until there is a verified data model, a backend execution service, and audited deployed contracts.

## Files

- `index.html` — semantic application structure and metadata
- `styles.css` — responsive terminal/arena visual system
- `app.js` — configuration, demo data, wallet service, storage, rendering, dialogs, forms, and utilities
- `contract-config.js` — intentionally-null future contract configuration
- `contracts/README.md` — future smart-contract architecture and security requirements

## Run locally

From this folder, start a static web server:

```bash
python -m http.server 8080
```

Then open <http://localhost:8080>. A static server is recommended: opening with `file://` can cause ES module or fetch behavior differences in future extensions.

## Wallet and network

Click **Connect Wallet** to make an `eth_requestAccounts` request through `window.ethereum`. If a compatible wallet is missing, the UI explains that one is needed. The app observes account and chain changes. It never silently switches networks; it can only ask the wallet to add the configured Testnet after the user explicitly requests it (double-click the network status for this MVP control). No private key, seed phrase, signature, transfer, or token approval is requested.

## Demo versus future protocol

All returns, portfolio values, activity, graph points, backing balances, governance weight, and agent decisions are simulation data. The backing workflow is browser-local only and has no monetary value. Asset `contractAddress` values are intentionally absent; add verified addresses from official project documentation before an onchain release.

`contract-config.js` keeps all contract addresses as `null`, which is the signal to remain in Simulation Mode.

## Future AI architecture

Live AI must be implemented behind a server-side API: authenticated service requests, strategy controls, rate limiting, evaluation/audit logs, and guarded execution should live on a backend. Never place OpenAI, RPC-provider, or third-party API keys in browser JavaScript.

## Deployment

This is static HTML/CSS/JS. Upload these files to a static Vercel or Netlify project (or configure the project root as the publish directory). No build command is required. Before deploying, set real verified contract addresses only after contracts are audited and deployed, then replace disabled “Coming Soon” links with actual owned destinations.

## Security notes and limitations

- This MVP uses `localStorage`; clearing browser site data resets simulated data.
- There is no backend, live pricing, identity system, actual AI execution, smart contract, or real staking.
- Validate/sanitize any persisted or server-supplied data before production rendering.
- Do not represent future contracts as audited, secure, or production-ready until they have been independently reviewed.

## Suggested next steps

Build audited contracts, a testnet indexer, verified market/oracle feeds, a backend agent-evaluation service, and formal protocol risk controls before enabling real token or trading flows.
