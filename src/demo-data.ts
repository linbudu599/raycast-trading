import type { MarketQuote, StockQuote } from "./mock-api";

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

const decimalFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const queryTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  year: "numeric",
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

export const formatMarketQuoteValue = ({ unit, value }: Pick<MarketQuote, "unit" | "value">) => {
  if (unit === "usdPerOunce") {
    return `${currencyFormatter.format(value)} / oz`;
  }

  if (unit === "usdt") {
    return `${decimalFormatter.format(value)} USDT`;
  }

  return `${decimalFormatter.format(value)} pts`;
};

export const formatFundNav = (value: number) => value.toFixed(4);

export const formatStockQuoteValue = ({ currency, value }: Pick<StockQuote, "currency" | "value">) =>
  `${decimalFormatter.format(value)} ${currency}`;

export const formatQueryTime = (value: Date) => queryTimeFormatter.format(value);
