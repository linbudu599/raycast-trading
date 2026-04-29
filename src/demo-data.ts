export type MarketTrend = "up" | "down" | "flat";

export interface MarketSnapshot {
  symbol: string;
  name: string;
  status: string;
  price: number;
  changePercent: number;
  trend: MarketTrend;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  note: string;
}

export interface ConfigurableSymbol {
  symbol: string;
  name: string;
  isTracked: boolean;
}

export const MARKET_SNAPSHOTS: readonly MarketSnapshot[] = [
  {
    symbol: "SPY",
    name: "S&P 500 ETF",
    status: "Open",
    price: 512.32,
    changePercent: 0.82,
    trend: "up",
  },
  {
    symbol: "QQQ",
    name: "Nasdaq 100 ETF",
    status: "Open",
    price: 438.19,
    changePercent: 1.14,
    trend: "up",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    status: "24/7",
    price: 67240.18,
    changePercent: -0.36,
    trend: "down",
  },
];

export const WATCHLIST_ITEMS: readonly WatchlistItem[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 184.86,
    changePercent: 0.42,
    note: "Earnings watch",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 903.56,
    changePercent: 1.27,
    note: "AI momentum",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 172.63,
    changePercent: -0.71,
    note: "Volatile",
  },
];

export const CONFIGURABLE_SYMBOLS: readonly ConfigurableSymbol[] = [
  { symbol: "AAPL", name: "Apple Inc.", isTracked: true },
  { symbol: "NVDA", name: "NVIDIA Corp.", isTracked: true },
  { symbol: "TSLA", name: "Tesla Inc.", isTracked: true },
  { symbol: "MSFT", name: "Microsoft Corp.", isTracked: false },
  { symbol: "AMZN", name: "Amazon.com Inc.", isTracked: false },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: "currency",
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

const trendLabel = (trend: MarketTrend) => {
  if (trend === "up") {
    return "Rising";
  }

  if (trend === "down") {
    return "Falling";
  }

  return "Flat";
};

const marketRows = MARKET_SNAPSHOTS.map(
  (market) =>
    `| ${market.symbol} | ${market.name} | ${formatCurrency(market.price)} | ${formatPercent(
      market.changePercent,
    )} | ${market.status} / ${trendLabel(market.trend)} |`,
);

export const MARKET_STATUS_MARKDOWN = [
  "# Markets Status",
  "",
  "Demo market snapshot with precomputed rows.",
  "",
  "| Symbol | Market | Last | Change | Status |",
  "|---|---|---:|---:|---|",
  ...marketRows,
].join("\n");
