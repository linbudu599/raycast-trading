import { MARKET_CATEGORY_ORDER, MARKET_SECTION_SESSIONS, MARKET_SECTION_TITLES, MARKET_SYMBOLS } from "./markets";
import type { MarketQuote, MarketQuoteSection, MarketSymbolCode, TradingSession } from "./markets";

export type {
  MarketInstrumentType,
  MarketQuote,
  MarketQuoteCategory,
  MarketQuoteSection,
  MarketQuoteUnit,
  MarketSymbol,
  MarketSymbolCode,
  TradingSession,
} from "./markets";

export interface MarketSnapshot {
  queriedAt: Date;
  sections: readonly MarketQuoteSection[];
}

export interface MarketTrendSummary {
  label: string;
  changePercent: number;
}

export interface ExtendedSessionTrend {
  session: Extract<TradingSession, "盘前" | "盘后">;
  value: number;
  changePercent: number;
}

export interface MarketQuoteDetail {
  quote: MarketQuote;
  queriedAt: Date;
  session: TradingSession;
  yesterday: MarketTrendSummary;
  oneMonth: MarketTrendSummary;
  yearToDate: MarketTrendSummary;
  extendedSession: ExtendedSessionTrend | undefined;
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
}

export interface ConfigurableSymbol {
  symbol: string;
  name: string;
  isTracked: boolean;
}

const MARKET_QUOTE_MOCKS = {
  ".DJI.US": { value: 38996.39, changePercent: -0.22 },
  ".NDX.US": { value: 17896.12, changePercent: 0.84 },
  ".SPX.US": { value: 5134.28, changePercent: 0.41 },
  ".VIX.US": { value: 16.84, changePercent: -1.24 },
  "000001.SH": { value: 3091.28, changePercent: -0.12 },
  "000300.SH": { value: 3568.07, changePercent: 0.22 },
  "000510.SH": { value: 4821.36, changePercent: 0.18 },
  "399006.SZ": { value: 1829.21, changePercent: 0.37 },
  "ETHA.US": { value: 25.42, changePercent: 0.92 },
  "GLD.US": { value: 421.91, changePercent: -1.86 },
  "HSI.HK": { value: 17746.91, changePercent: -0.73 },
  "HSTECH.HK": { value: 3619.42, changePercent: -1.08 },
  "IBIT.US": { value: 41.86, changePercent: -0.36 },
  "IWM.US": { value: 2069.45, changePercent: 0.68 },
  "SOXX.US": { value: 438.71, changePercent: -3.67 },
} satisfies Record<MarketSymbolCode, Pick<MarketQuote, "changePercent" | "value">>;

const MARKET_QUOTES: readonly MarketQuote[] = MARKET_SYMBOLS.map((market) => ({
  ...market,
  ...MARKET_QUOTE_MOCKS[market.symbol],
}));

const MARKET_DETAIL_MOCKS: Record<
  string,
  Pick<MarketQuoteDetail, "extendedSession" | "oneMonth" | "session" | "yearToDate" | "yesterday">
> = {
  "IBIT.US": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 8.42 },
    session: "全天交易",
    yearToDate: { label: "今年来走势", changePercent: 51.68 },
    yesterday: { label: "昨日走势", changePercent: -1.12 },
  },
  "399006.SZ": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 3.28 },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: -2.14 },
    yesterday: { label: "昨日走势", changePercent: 0.66 },
  },
  "000300.SH": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 2.47 },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: 5.36 },
    yesterday: { label: "昨日走势", changePercent: 0.31 },
  },
  "000510.SH": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 2.94 },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: 4.18 },
    yesterday: { label: "昨日走势", changePercent: 0.27 },
  },
  ".DJI.US": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 1.38 },
    session: "休市",
    yearToDate: { label: "今年来走势", changePercent: 4.21 },
    yesterday: { label: "昨日走势", changePercent: -0.19 },
  },
  "ETHA.US": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 6.93 },
    session: "全天交易",
    yearToDate: { label: "今年来走势", changePercent: 34.21 },
    yesterday: { label: "昨日走势", changePercent: 0.48 },
  },
  "HSI.HK": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 4.05 },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: 7.84 },
    yesterday: { label: "昨日走势", changePercent: -0.52 },
  },
  "HSTECH.HK": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 5.76 },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: 4.92 },
    yesterday: { label: "昨日走势", changePercent: -0.81 },
  },
  ".NDX.US": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 4.78 },
    session: "休市",
    yearToDate: { label: "今年来走势", changePercent: 12.64 },
    yesterday: { label: "昨日走势", changePercent: 0.72 },
  },
  "IWM.US": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 3.64 },
    session: "休市",
    yearToDate: { label: "今年来走势", changePercent: 2.92 },
    yesterday: { label: "昨日走势", changePercent: 0.58 },
  },
  "SOXX.US": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 5.18 },
    session: "休市",
    yearToDate: { label: "今年来走势", changePercent: 9.42 },
    yesterday: { label: "昨日走势", changePercent: 1.06 },
  },
  ".SPX.US": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 2.16 },
    session: "休市",
    yearToDate: { label: "今年来走势", changePercent: 8.42 },
    yesterday: { label: "昨日走势", changePercent: 0.34 },
  },
  ".VIX.US": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: -6.42 },
    session: "休市",
    yearToDate: { label: "今年来走势", changePercent: 3.18 },
    yesterday: { label: "昨日走势", changePercent: -1.08 },
  },
  "000001.SH": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 1.48 },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: 3.62 },
    yesterday: { label: "昨日走势", changePercent: -0.18 },
  },
  "GLD.US": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 3.89 },
    session: "休市",
    yearToDate: { label: "今年来走势", changePercent: 14.32 },
    yesterday: { label: "昨日走势", changePercent: -1.86 },
  },
};

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
    session: "全天交易",
  },
];

const includesQuery = (value: string, query: string) => value.toLocaleLowerCase().includes(query.toLocaleLowerCase());

const resolveMock = <T>(value: T) => Promise.resolve(value);

export const fetchMarketSnapshot = () =>
  resolveMock<MarketSnapshot>({
    queriedAt: new Date(),
    sections: MARKET_CATEGORY_ORDER.map((category) => ({
      category,
      session: MARKET_SECTION_SESSIONS[category],
      title: MARKET_SECTION_TITLES[category],
      items: MARKET_QUOTES.filter((quote) => quote.category === category),
    })),
  });

export const fetchMarketQuoteDetail = (symbol: string) => {
  const quote = MARKET_QUOTES.find((item) => item.symbol === symbol);
  const detail = MARKET_DETAIL_MOCKS[symbol];

  return resolveMock<MarketQuoteDetail | undefined>(
    quote && detail
      ? {
          ...detail,
          quote,
          queriedAt: new Date(),
        }
      : undefined,
  );
};

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
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 903.56,
    changePercent: 1.27,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 172.63,
    changePercent: -0.71,
  },
];

export const CONFIGURABLE_SYMBOLS: readonly ConfigurableSymbol[] = [
  { symbol: "AAPL", name: "Apple Inc.", isTracked: true },
  { symbol: "NVDA", name: "NVIDIA Corp.", isTracked: true },
  { symbol: "TSLA", name: "Tesla Inc.", isTracked: true },
  { symbol: "MSFT", name: "Microsoft Corp.", isTracked: false },
  { symbol: "AMZN", name: "Amazon.com Inc.", isTracked: false },
];
