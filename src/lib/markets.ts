export type MarketQuoteCategory = "US Index" | "Commodities" | "Crypto" | "HK Index" | "CN Index";

export type MarketInstrumentType = "ETF";

export type MarketQuoteUnit = "points" | "usd";

export type TradingSession = "盘前" | "盘中" | "盘后" | "全天交易" | "休市";

export interface MarketSymbol {
  symbol: string;
  name: string;
  category: MarketQuoteCategory;
  instrumentType?: MarketInstrumentType;
  unit: MarketQuoteUnit;
}

export interface MarketQuote extends MarketSymbol {
  value: number;
  changePercent: number;
}

export interface MarketQuoteSection {
  category: MarketQuoteCategory;
  session: TradingSession | undefined;
  title: string;
  items: readonly MarketQuote[];
}

export const MARKET_SYMBOLS = [
  {
    symbol: ".NDX.US",
    name: "纳斯达克 100",
    category: "US Index",
    unit: "points",
  },
  {
    symbol: ".SPX.US",
    name: "标普 500 指数",
    category: "US Index",
    unit: "points",
  },
  {
    symbol: ".DJI.US",
    name: "道琼斯指数",
    category: "US Index",
    unit: "points",
  },
  {
    symbol: "IWM.US",
    name: "罗素 2000 指数",
    category: "US Index",
    instrumentType: "ETF",
    unit: "points",
  },
  {
    symbol: "SOXX.US",
    name: "半导体指数",
    category: "US Index",
    instrumentType: "ETF",
    unit: "points",
  },
  {
    symbol: ".VIX.US",
    name: "恐慌指数",
    category: "US Index",
    unit: "points",
  },
  {
    symbol: "GLD.US",
    name: "黄金",
    category: "Commodities",
    instrumentType: "ETF",
    unit: "usd",
  },
  {
    symbol: "IBIT.US",
    name: "比特币",
    category: "Crypto",
    instrumentType: "ETF",
    unit: "usd",
  },
  {
    symbol: "ETHA.US",
    name: "ETH",
    category: "Crypto",
    instrumentType: "ETF",
    unit: "usd",
  },
  {
    symbol: "HSI.HK",
    name: "恒生指数",
    category: "HK Index",
    unit: "points",
  },
  {
    symbol: "HSTECH.HK",
    name: "恒生科技指数",
    category: "HK Index",
    unit: "points",
  },
  {
    symbol: "399006.SZ",
    name: "创业板指数",
    category: "CN Index",
    unit: "points",
  },
  {
    symbol: "000300.SH",
    name: "沪深 300 指数",
    category: "CN Index",
    unit: "points",
  },
  {
    symbol: "000510.SH",
    name: "中证 A 500 指数",
    category: "CN Index",
    unit: "points",
  },
  {
    symbol: "000001.SH",
    name: "上证指数",
    category: "CN Index",
    unit: "points",
  },
] as const satisfies readonly MarketSymbol[];

export type MarketSymbolCode = (typeof MARKET_SYMBOLS)[number]["symbol"];

export const MARKET_SECTION_TITLES: Record<MarketQuoteCategory, string> = {
  "CN Index": "A 股指数",
  Commodities: "贵金属/大宗商品",
  Crypto: "加密货币",
  "HK Index": "港股指数",
  "US Index": "美股指数",
};

export const MARKET_SECTION_SESSIONS: Partial<Record<MarketQuoteCategory, TradingSession>> = {
  "CN Index": "盘中",
  "HK Index": "盘中",
  "US Index": "休市",
};

export const MARKET_CATEGORY_ORDER: readonly MarketQuoteCategory[] = [
  "US Index",
  "Commodities",
  "Crypto",
  "HK Index",
  "CN Index",
];
