# Raycast Trading

A [Raycast](https://www.raycast.com/) extension for market overview, watchlists, quote lookup, and Longbridge API call inspection.

The extension fetches live market data through the [Longbridge CLI](https://open.longbridge.com/) and presents it in Raycast with bilingual UI support.

## Features

- **Market Overview**: monitor major US, Hong Kong, China A-share, commodity, and crypto-related market indicators.
- **Watchlist**: track real-time quotes for saved symbols, grouped by market.
- **Quote Lookup**: look up live quotes and reference data by symbol, company name, or market.
- **Manage Watchlist**: add, remove, and reorder watchlist symbols.
- **API Call Log**: inspect persisted Longbridge request/response logs, including formatted JSON responses.

## Commands

| Command | Description |
| --- | --- |
| **Market Overview** | Monitor major global market indexes and cross-asset indicators. |
| **Watchlist** | Track real-time quotes for your saved symbols. |
| **Quote Lookup** | Look up real-time quotes and reference data by symbol. |
| **Manage Watchlist** | Add, remove, and reorder symbols in your watchlist. |
| **API Call Log** | Review persisted Longbridge API request and response logs. |

## Preferences

| Preference | Scope | Description | Default |
| --- | --- | --- | --- |
| **Language** | Extension | Display language: English or Simplified Chinese. | English |
| **Change Color Style** | Extension | Choose whether gains are green or red. | Green Up / Red Down |
| **Show Active Markets Only** | Market Overview | Hide closed market sections from the market overview. | Off |

## Longbridge Setup

This extension shells out to the `longbridge` CLI for live data. Make sure it is installed and authenticated before using quote-related commands.

```bash
longbridge auth login
longbridge quote AAPL.US --format json
```

Supported symbol examples:

- US stocks: `NVDA.US`, `AAPL.US`
- Hong Kong stocks: `700.HK`, `1810.HK`
- China A-shares: `600519.SH`, `300750.SZ`
- US indexes: `.NDX.US`, `.SPX.US`, `.DJI.US`

## Development

Prerequisites:

- macOS with [Raycast](https://www.raycast.com/) installed
- Node.js `>=22`
- pnpm `>=10`
- Longbridge CLI authenticated locally

Install dependencies and start the Raycast development server:

```bash
pnpm install
pnpm dev
```

Useful scripts:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm release
```

## Notes

- API call logs are stored with Raycast `LocalStorage` and keep the latest Longbridge calls for inspection.
- Quote data is fetched through Longbridge CLI commands such as `quote` and `static`.
- Closed-market quotes may be cached briefly to reduce unnecessary API calls.
