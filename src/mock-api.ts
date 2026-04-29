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

export interface MarketTrendSummary {
  label: string;
  changePercent: number;
  note: string;
}

export interface ExtendedSessionTrend {
  session: Extract<TradingSession, "盘前" | "盘后">;
  value: number;
  changePercent: number;
  note: string;
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

const MARKET_DETAIL_MOCKS: Record<
  string,
  Pick<MarketQuoteDetail, "extendedSession" | "oneMonth" | "session" | "yearToDate" | "yesterday">
> = {
  "BTC/USDT": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 8.42, note: "现货资金持续流入，波动放大。" },
    session: "夜盘",
    yearToDate: { label: "今年来走势", changePercent: 51.68, note: "风险偏好回升推动主要加密资产上行。" },
    yesterday: { label: "昨日走势", changePercent: -1.12, note: "昨日冲高回落，短线承压。" },
  },
  CHINEXT: {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 3.28, note: "成长风格逐步修复。" },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: -2.14, note: "年内仍处震荡修复区间。" },
    yesterday: { label: "昨日走势", changePercent: 0.66, note: "昨日尾盘资金回流。" },
  },
  CSI300: {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 2.47, note: "权重板块温和走强。" },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: 5.36, note: "低估值板块支撑指数。" },
    yesterday: { label: "昨日走势", changePercent: 0.31, note: "昨日窄幅震荡收涨。" },
  },
  "ETH/USDT": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 6.93, note: "生态活跃度带动估值修复。" },
    session: "夜盘",
    yearToDate: { label: "今年来走势", changePercent: 34.21, note: "年内整体强于多数风险资产。" },
    yesterday: { label: "昨日走势", changePercent: 0.48, note: "昨日震荡走高。" },
  },
  HSI: {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 4.05, note: "互联网与地产链带来弹性。" },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: 7.84, note: "估值修复仍是主线。" },
    yesterday: { label: "昨日走势", changePercent: -0.52, note: "昨日高开低走。" },
  },
  HSTECH: {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 5.76, note: "科技龙头反弹贡献明显。" },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: 4.92, note: "年内波动仍高于主板指数。" },
    yesterday: { label: "昨日走势", changePercent: -0.81, note: "昨日跟随外盘回调。" },
  },
  NDX: {
    extendedSession: { session: "盘前", value: 17942.36, changePercent: 0.26, note: "大型科技股盘前小幅走强。" },
    oneMonth: { label: "近一个月走势", changePercent: 4.78, note: "AI 与半导体权重继续贡献主要涨幅。" },
    session: "盘前",
    yearToDate: { label: "今年来走势", changePercent: 12.64, note: "今年以来维持上行趋势。" },
    yesterday: { label: "昨日走势", changePercent: 0.72, note: "昨日尾盘拉升，收于日内高位附近。" },
  },
  "SOL/USDT": {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 12.36, note: "高 beta 属性带来更大弹性。" },
    session: "夜盘",
    yearToDate: { label: "今年来走势", changePercent: 28.57, note: "链上交易活跃度支撑表现。" },
    yesterday: { label: "昨日走势", changePercent: 2.15, note: "昨日强势突破短期压力。" },
  },
  SPX: {
    extendedSession: { session: "盘后", value: 5128.74, changePercent: -0.11, note: "盘后期指小幅回落。" },
    oneMonth: { label: "近一个月走势", changePercent: 2.16, note: "大盘股维持温和上行。" },
    session: "盘后",
    yearToDate: { label: "今年来走势", changePercent: 8.42, note: "盈利预期改善支撑指数。" },
    yesterday: { label: "昨日走势", changePercent: 0.34, note: "昨日震荡收涨。" },
  },
  SSE: {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 1.48, note: "指数延续箱体震荡。" },
    session: "盘中",
    yearToDate: { label: "今年来走势", changePercent: 3.62, note: "政策预期提供下方支撑。" },
    yesterday: { label: "昨日走势", changePercent: -0.18, note: "昨日量能略有收缩。" },
  },
  XAU: {
    extendedSession: undefined,
    oneMonth: { label: "近一个月走势", changePercent: 3.89, note: "避险需求与降息预期支撑金价。" },
    session: "夜盘",
    yearToDate: { label: "今年来走势", changePercent: 14.32, note: "今年以来维持高位趋势。" },
    yesterday: { label: "昨日走势", changePercent: -0.22, note: "昨日美元走强压制金价。" },
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
