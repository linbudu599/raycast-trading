import { getPreferenceValues } from "@raycast/api";

export type Language = "en" | "zh-CN";

interface ExtensionPreferences {
  language?: Language;
}

type TranslationKey = keyof (typeof TRANSLATIONS)["en"];

const TRANSLATIONS = {
  en: {
    addSymbol: "Add Symbol",
    addToWatchlist: "Add to Watch List",
    aShares: "A Shares",
    available: "Available",
    changePercentTooltip: "Daily Change",
    cnIndex: "China Indexes",
    commodities: "Commodities",
    configureWatchlist: "Configure Watch List",
    copySymbol: "Copy Symbol",
    crypto: "Crypto",
    currentStatus: "Current Status",
    displayWatchlist: "Watch List",
    duplicateSymbol: "Already in Watch List",
    duplicateSymbolMessage: "This symbol is already being watched.",
    enterAnotherSymbol: "Please check the symbol and try again.",
    failedToAddSymbol: "Failed to Add Symbol",
    failedToLoadMarketDetail: "Failed to Load Market Detail",
    failedToLoadMarkets: "Failed to Load Markets",
    failedToLoadWatchlist: "Failed to Load Watch List",
    failedToLoadWatchedFunds: "Failed to Load Watched Funds",
    failedToSearchStocks: "Failed to Search Stock Quotes",
    fundCode: "Fund Code",
    hkIndex: "Hong Kong Indexes",
    hkStocks: "Hong Kong Stocks",
    latestNav: "Latest NAV",
    latestPrice: "Latest Price",
    latestQueryTime: "Latest Query Time",
    loadMarketsDescription: "Fetching market quotes from Longbridge...",
    loadMarketsTitle: "Fetching Longbridge Quotes",
    loadWatchlistDescription: "Fetching watch list quotes from Longbridge...",
    loadWatchlistTitle: "Fetching Watch List Quotes",
    marketDetailNotFound: "Market Detail Not Found",
    marketDetailNotFoundDescription: "No Longbridge quote found for",
    marketStatus: "Markets Status",
    missingSymbols: "Missing Symbols",
    moveDown: "Move Down",
    moveUp: "Move Up",
    name: "Name",
    namePlaceholder: "Optional display name",
    noStockQuotesFound: "No Stock Quotes Found",
    noStockQuotesFoundDescription: "Try another symbol, name, or market.",
    noWatchlistItems: "No Watch List Items",
    noWatchlistItemsDescription: "Add a symbol to start tracking quotes.",
    optional: "Optional",
    other: "Other",
    priceTooltip: "Latest Price",
    queryTime: "Query Time",
    removeFromWatchlist: "Remove from Watch List",
    removedFromWatchlist: "Removed from Watch List",
    riskLevel: "Risk Level",
    searchPlaceholder: "Search symbol, name, or market",
    searchResults: "Search Results",
    searchStock: "Search Stock",
    sessionAllDay: "All-Day Trading",
    sessionClosed: "Closed",
    sessionPostMarket: "Post-market",
    sessionPreMarket: "Pre-market",
    sessionRegular: "Trading",
    stockSymbol: "Symbol",
    symbolHelp: "Use Longbridge format such as NVDA.US, 1810.HK, or 601398.SH.",
    symbolNotFound: "Symbol Not Found",
    symbolNotFoundMessage: "Longbridge returned no quote for this symbol.",
    symbolPlaceholder: "NVDA.US",
    tracked: "Tracked",
    trendCore: "Core Trends",
    trendToday: "Daily Change",
    trendYearToDate: "Year-to-date",
    trendOneMonth: "One-month",
    updatedWatchlist: "Watch List Updated",
    usExtendedSession: "US Extended Session",
    usIndex: "US Indexes",
    usStocks: "US Stocks",
    valuePerTenThousand: "Daily Earnings per 10,000",
    watchFunds: "Watch Funds",
    watchlistDetail: "Watch List Detail",
  },
  "zh-CN": {
    addSymbol: "新增标的",
    addToWatchlist: "加入关注列表",
    aShares: "A 股",
    available: "可添加",
    changePercentTooltip: "当日涨跌幅",
    cnIndex: "A 股指数",
    commodities: "贵金属/大宗商品",
    configureWatchlist: "配置关注列表",
    copySymbol: "复制标的代码",
    crypto: "加密货币",
    currentStatus: "当前状态",
    displayWatchlist: "关注列表",
    duplicateSymbol: "已在关注列表中",
    duplicateSymbolMessage: "这个标的已经被关注。",
    enterAnotherSymbol: "请检查标的代码后重新添加。",
    failedToAddSymbol: "新增标的失败",
    failedToLoadMarketDetail: "加载市场详情失败",
    failedToLoadMarkets: "加载市场行情失败",
    failedToLoadWatchlist: "加载关注列表失败",
    failedToLoadWatchedFunds: "加载关注基金失败",
    failedToSearchStocks: "搜索股票行情失败",
    fundCode: "基金代码",
    hkIndex: "港股指数",
    hkStocks: "港股",
    latestNav: "当日净值",
    latestPrice: "最新报价",
    latestQueryTime: "最新查询时间",
    loadMarketsDescription: "请稍候，正在批量获取市场报价...",
    loadMarketsTitle: "正在查询 Longbridge 行情",
    loadWatchlistDescription: "请稍候，正在获取关注标的行情...",
    loadWatchlistTitle: "正在查询关注列表行情",
    marketDetailNotFound: "未找到市场详情",
    marketDetailNotFoundDescription: "Longbridge 未返回行情：",
    marketStatus: "市场状态",
    missingSymbols: "未返回行情的标的",
    moveDown: "下移",
    moveUp: "上移",
    name: "名称",
    namePlaceholder: "可选展示名称",
    noStockQuotesFound: "未找到股票行情",
    noStockQuotesFoundDescription: "请尝试其他代码、名称或市场。",
    noWatchlistItems: "暂无关注标的",
    noWatchlistItemsDescription: "新增一个标的即可开始跟踪行情。",
    optional: "可选",
    other: "其他",
    priceTooltip: "最新报价",
    queryTime: "查询时间",
    removeFromWatchlist: "从关注列表移除",
    removedFromWatchlist: "已从关注列表移除",
    riskLevel: "风险等级",
    searchPlaceholder: "搜索标的代码、名称或市场",
    searchResults: "搜索结果",
    searchStock: "搜索股票",
    sessionAllDay: "全天交易",
    sessionClosed: "休市",
    sessionPostMarket: "盘后",
    sessionPreMarket: "盘前",
    sessionRegular: "盘中",
    stockSymbol: "标的代码",
    symbolHelp: "请使用 Longbridge 格式，例如 NVDA.US、1810.HK 或 601398.SH。",
    symbolNotFound: "标的不存在",
    symbolNotFoundMessage: "Longbridge 没有返回这个标的的行情。",
    symbolPlaceholder: "NVDA.US",
    tracked: "已关注",
    trendCore: "核心走势",
    trendToday: "当日涨跌幅",
    trendYearToDate: "今年来走势",
    trendOneMonth: "近一个月走势",
    updatedWatchlist: "关注列表已更新",
    usExtendedSession: "美股扩展时段",
    usIndex: "美股指数",
    usStocks: "美股",
    valuePerTenThousand: "每万元当日收益",
    watchFunds: "关注基金",
    watchlistDetail: "关注标的详情",
  },
} as const;

const MARKET_SYMBOL_NAMES: Record<string, Record<Language, string>> = {
  ".DJI.US": { en: "Dow Jones Industrial Average", "zh-CN": "道琼斯指数" },
  ".NDX.US": { en: "Nasdaq 100", "zh-CN": "纳斯达克 100" },
  ".SPX.US": { en: "S&P 500 Index", "zh-CN": "标普 500 指数" },
  ".VIX.US": { en: "CBOE Volatility Index", "zh-CN": "恐慌指数" },
  "000001.SH": { en: "SSE Composite Index", "zh-CN": "上证指数" },
  "000300.SH": { en: "CSI 300 Index", "zh-CN": "沪深 300 指数" },
  "000510.SH": { en: "CSI A500 Index", "zh-CN": "中证 A 500 指数" },
  "399006.SZ": { en: "ChiNext Index", "zh-CN": "创业板指数" },
  "ETHA.US": { en: "Ethereum", "zh-CN": "ETH" },
  "GLD.US": { en: "Gold", "zh-CN": "黄金" },
  "HSI.HK": { en: "Hang Seng Index", "zh-CN": "恒生指数" },
  "HSTECH.HK": { en: "Hang Seng Tech Index", "zh-CN": "恒生科技指数" },
  "IBIT.US": { en: "Bitcoin", "zh-CN": "比特币" },
  "IWM.US": { en: "Russell 2000 ETF", "zh-CN": "罗素 2000 指数" },
  "SOXX.US": { en: "Semiconductor ETF", "zh-CN": "半导体指数" },
};

export const getLanguage = (): Language => {
  const preferences = getPreferenceValues<ExtensionPreferences>();
  return preferences.language === "zh-CN" ? "zh-CN" : "en";
};

export const t = (key: TranslationKey, language: Language = getLanguage()) => TRANSLATIONS[language][key];

export const translateSession = (session: string | undefined, language: Language = getLanguage()) => {
  if (session === "盘前") {
    return t("sessionPreMarket", language);
  }

  if (session === "盘中") {
    return t("sessionRegular", language);
  }

  if (session === "盘后") {
    return t("sessionPostMarket", language);
  }

  if (session === "全天交易") {
    return t("sessionAllDay", language);
  }

  if (session === "休市") {
    return t("sessionClosed", language);
  }

  return session;
};

export const translateMarketCategory = (category: string, language: Language = getLanguage()) => {
  if (category === "US Index") {
    return t("usIndex", language);
  }

  if (category === "HK Index") {
    return t("hkIndex", language);
  }

  if (category === "CN Index") {
    return t("cnIndex", language);
  }

  if (category === "Commodities") {
    return t("commodities", language);
  }

  if (category === "Crypto") {
    return t("crypto", language);
  }

  return category;
};

export const translateWatchlistCategory = (category: string, language: Language = getLanguage()) => {
  if (category === "US Stocks") {
    return t("usStocks", language);
  }

  if (category === "HK Stocks") {
    return t("hkStocks", language);
  }

  if (category === "A Shares") {
    return t("aShares", language);
  }

  return t("other", language);
};

export const translateMarketName = (symbol: string, fallback: string, language: Language = getLanguage()) =>
  MARKET_SYMBOL_NAMES[symbol]?.[language] ?? fallback;
