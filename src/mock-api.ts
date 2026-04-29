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

export interface MarketSnapshot {
  queriedAt: Date;
  sections: readonly MarketQuoteSection[];
}

export type FundRiskLevel = "低风险" | "中风险" | "中高风险";

export interface FundNavPerformance {
  code: string;
  name: string;
  nav: number;
  dailyChangePercent: number;
  updatedAt: Date;
  riskLevel: FundRiskLevel;
}

export interface FundSnapshot {
  queriedAt: Date;
  items: readonly FundNavPerformance[];
}

export type TradingSession = "盘前" | "盘中" | "盘后" | "夜盘" | "休市";

export type StockQuoteMarket = "US" | "HK" | "CN" | "Crypto";

export interface StockQuote {
  symbol: string;
  name: string;
  market: StockQuoteMarket;
  value: number;
  currency: string;
  dailyChangePercent: number;
  session: TradingSession;
  queriedAt: Date;
}

export interface StockSearchResult {
  queriedAt: Date;
  items: readonly StockQuote[];
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

const MARKET_QUOTES: readonly MarketQuote[] = [
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

const MARKET_SECTION_TITLES: Record<MarketQuoteCategory, string> = {
  "CN Index": "A 股指数",
  Crypto: "加密货币",
  "HK Index": "港股指数",
  Metals: "贵金属",
  "US Index": "美股指数",
};

const MARKET_CATEGORY_ORDER: readonly MarketQuoteCategory[] = ["US Index", "Metals", "Crypto", "HK Index", "CN Index"];

const WATCH_FUNDS: readonly Omit<FundNavPerformance, "updatedAt">[] = [
  {
    code: "110022",
    name: "易方达消费行业股票",
    nav: 4.126,
    dailyChangePercent: 0.86,
    riskLevel: "中高风险",
  },
  {
    code: "161725",
    name: "招商中证白酒指数",
    nav: 1.0527,
    dailyChangePercent: -0.43,
    riskLevel: "中高风险",
  },
  {
    code: "000248",
    name: "汇添富中证主要消费 ETF 联接",
    nav: 2.781,
    dailyChangePercent: 0.31,
    riskLevel: "中风险",
  },
  {
    code: "270042",
    name: "广发纳斯达克 100 ETF 联接",
    nav: 5.214,
    dailyChangePercent: 1.12,
    riskLevel: "中高风险",
  },
  {
    code: "000311",
    name: "景顺长城沪深 300 增强",
    nav: 2.019,
    dailyChangePercent: -0.08,
    riskLevel: "中风险",
  },
];

const STOCK_QUOTES: readonly Omit<StockQuote, "queriedAt">[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    market: "US",
    value: 184.86,
    currency: "USD",
    dailyChangePercent: 0.42,
    session: "盘前",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    market: "US",
    value: 903.56,
    currency: "USD",
    dailyChangePercent: 1.27,
    session: "盘后",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    market: "US",
    value: 172.63,
    currency: "USD",
    dailyChangePercent: -0.71,
    session: "盘中",
  },
  {
    symbol: "0700.HK",
    name: "腾讯控股",
    market: "HK",
    value: 372.8,
    currency: "HKD",
    dailyChangePercent: 0.91,
    session: "盘中",
  },
  {
    symbol: "600519.SH",
    name: "贵州茅台",
    market: "CN",
    value: 1698.2,
    currency: "CNY",
    dailyChangePercent: -0.24,
    session: "休市",
  },
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    market: "Crypto",
    value: 67240.18,
    currency: "USDT",
    dailyChangePercent: -0.36,
    session: "夜盘",
  },
];

const includesQuery = (value: string, query: string) => value.toLocaleLowerCase().includes(query.toLocaleLowerCase());

const resolveMock = <T>(value: T) => Promise.resolve(value);

export const fetchMarketSnapshot = () =>
  resolveMock<MarketSnapshot>({
    queriedAt: new Date(),
    sections: MARKET_CATEGORY_ORDER.map((category) => ({
      category,
      title: MARKET_SECTION_TITLES[category],
      items: MARKET_QUOTES.filter((quote) => quote.category === category),
    })),
  });

export const fetchWatchFunds = () => {
  const queriedAt = new Date();

  return resolveMock<FundSnapshot>({
    queriedAt,
    items: WATCH_FUNDS.map((fund) => ({
      ...fund,
      updatedAt: queriedAt,
    })),
  });
};

export const searchStockQuotes = (query: string) => {
  const queriedAt = new Date();
  const normalizedQuery = query.trim();
  const items = normalizedQuery
    ? STOCK_QUOTES.filter(
        (quote) =>
          includesQuery(quote.symbol, normalizedQuery) ||
          includesQuery(quote.name, normalizedQuery) ||
          includesQuery(quote.market, normalizedQuery),
      )
    : STOCK_QUOTES;

  return resolveMock<StockSearchResult>({
    queriedAt,
    items: items.map((quote) => ({
      ...quote,
      queriedAt,
    })),
  });
};

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
