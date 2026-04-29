export type MarketQuoteCategory = "US Index" | "Metals" | "Crypto" | "HK Index" | "CN Index";

export type MarketQuoteUnit = "points" | "usdPerOunce" | "usdt";

export interface MarketQuote {
  symbol: string;
  name: string;
  category: MarketQuoteCategory;
  value: number;
  changePercent: number;
  unit: MarketQuoteUnit;
}

export interface MarketQuoteSection {
  category: MarketQuoteCategory;
  title: string;
  items: readonly MarketQuote[];
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

export const MARKET_QUOTES: readonly MarketQuote[] = [
  {
    symbol: "NDX",
    name: "纳斯达克 100 指数",
    category: "US Index",
    value: 17896.12,
    changePercent: 0.84,
    unit: "points",
  },
  {
    symbol: "SPX",
    name: "标普 500 指数",
    category: "US Index",
    value: 5134.28,
    changePercent: 0.41,
    unit: "points",
  },
  {
    symbol: "XAU",
    name: "黄金国际金价",
    category: "Metals",
    value: 2328.64,
    changePercent: -0.18,
    unit: "usdPerOunce",
  },
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    category: "Crypto",
    value: 67240.18,
    changePercent: -0.36,
    unit: "usdt",
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    category: "Crypto",
    value: 3268.52,
    changePercent: 0.92,
    unit: "usdt",
  },
  {
    symbol: "SOL/USDT",
    name: "Solana",
    category: "Crypto",
    value: 151.74,
    changePercent: 1.86,
    unit: "usdt",
  },
  {
    symbol: "HSI",
    name: "恒生指数",
    category: "HK Index",
    value: 17746.91,
    changePercent: -0.73,
    unit: "points",
  },
  {
    symbol: "HSTECH",
    name: "恒生科技指数",
    category: "HK Index",
    value: 3619.42,
    changePercent: -1.08,
    unit: "points",
  },
  {
    symbol: "CHINEXT",
    name: "创业板指数",
    category: "CN Index",
    value: 1829.21,
    changePercent: 0.37,
    unit: "points",
  },
  {
    symbol: "CSI300",
    name: "沪深 300 指数",
    category: "CN Index",
    value: 3568.07,
    changePercent: 0.22,
    unit: "points",
  },
  {
    symbol: "SSE",
    name: "上证指数",
    category: "CN Index",
    value: 3091.28,
    changePercent: -0.12,
    unit: "points",
  },
];

export const MARKET_QUOTE_SECTIONS: readonly MarketQuoteSection[] = [
  {
    category: "US Index",
    title: "美股指数",
    items: MARKET_QUOTES.filter((quote) => quote.category === "US Index"),
  },
  {
    category: "Metals",
    title: "贵金属",
    items: MARKET_QUOTES.filter((quote) => quote.category === "Metals"),
  },
  {
    category: "Crypto",
    title: "加密货币",
    items: MARKET_QUOTES.filter((quote) => quote.category === "Crypto"),
  },
  {
    category: "HK Index",
    title: "港股指数",
    items: MARKET_QUOTES.filter((quote) => quote.category === "HK Index"),
  },
  {
    category: "CN Index",
    title: "A 股指数",
    items: MARKET_QUOTES.filter((quote) => quote.category === "CN Index"),
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

export const formatQueryTime = (value: Date) => queryTimeFormatter.format(value);
