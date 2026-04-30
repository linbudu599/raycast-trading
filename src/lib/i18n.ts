import { getPreferenceValues } from "@raycast/api";

export type Language = "en" | "zh-CN";

interface ExtensionPreferences {
  language?: Language;
}

type TranslationKey = keyof (typeof TRANSLATIONS)["en"];

const TRANSLATIONS = {
  en: {
    addSymbol: "Add Symbol",
    addToWatchlist: "Add to Watchlist",
    aShares: "A Shares",
    apiCallLogsCleared: "API Call Log Cleared",
    apiCallStatusFailure: "Failed",
    apiCallStatusSuccess: "Succeeded",
    available: "Available",
    basicInformation: "Basic Information",
    bps: "Book Value per Share",
    changePercentTooltip: "Daily Change",
    circulatingShares: "Circulating Shares",
    cnIndex: "China Indexes",
    commodities: "Commodities",
    configureWatchlist: "Manage Watchlist",
    copyCommand: "Copy Command",
    copyResponseJson: "Copy Response JSON",
    copySymbol: "Copy Symbol",
    clearApiCallLogs: "Clear API Call Logs",
    command: "Command",
    crypto: "Crypto",
    currentStatus: "Current Status",
    dailyStats: "Daily Stats",
    dividend: "Dividend",
    displayWatchlist: "Watchlist",
    duplicateSymbol: "Already in Watchlist",
    duplicateSymbolMessage: "This symbol is already in your watchlist.",
    duration: "Duration",
    enterAnotherSymbol: "Please check the symbol and try again.",
    eps: "EPS",
    epsTtm: "EPS TTM",
    exchange: "Exchange",
    extendedTrading: "Extended Trading",
    failedToAddSymbol: "Failed to Add Symbol",
    failedToLoadApiCallLogs: "Failed to Load API Call Logs",
    failedToLoadMarketDetail: "Failed to Load Market Detail",
    failedToLoadMarkets: "Failed to Load Markets",
    failedToLoadWatchlist: "Failed to Load Watchlist",
    failedToSearchStocks: "Failed to Look Up Quotes",
    highPrice: "High",
    hkIndex: "Hong Kong Indexes",
    hkStocks: "Hong Kong Stocks",
    latestPrice: "Latest Price",
    latestQueryTime: "Latest Query Time",
    loadMarketsDescription: "Fetching market quotes from Longbridge...",
    loadMarketsTitle: "Fetching Longbridge Quotes",
    loadWatchlistDescription: "Fetching watchlist quotes from Longbridge...",
    loadWatchlistTitle: "Fetching Watchlist Quotes",
    lotSize: "Lot Size",
    lowPrice: "Low",
    marketDetailNotFound: "Market Detail Not Found",
    marketDetailNotFoundDescription: "No Longbridge quote found for",
    marketStatus: "Market Overview",
    missingSymbols: "Missing Symbols",
    moveDown: "Move Down",
    moveUp: "Move Up",
    name: "Name",
    namePlaceholder: "Optional display name",
    noStockQuotesFound: "No Quotes Found",
    noStockQuotesFoundDescription: "Try another symbol, name, or market.",
    noApiCallLogs: "No API Call Logs",
    noApiCallLogsDescription: "Longbridge API calls will appear here after you use the extension.",
    noResponseJson: "No response body was saved for this call.",
    noWatchlistItems: "No Watchlist Symbols",
    noWatchlistItemsDescription: "Add a symbol to start tracking quotes.",
    optional: "Optional",
    other: "Other",
    openPrice: "Open",
    previousClose: "Previous Close",
    priceTooltip: "Latest Price",
    quoteDetails: "Quote Details",
    quoteStatus: "Quote Status",
    queryTime: "Query Time",
    requestTime: "Request Time",
    responseJson: "Response JSON",
    responseTruncated: "Response output was truncated before saving.",
    removeFromWatchlist: "Remove from Watchlist",
    removedFromWatchlist: "Removed from Watchlist",
    searchPlaceholder: "Enter symbol, company name, or market",
    searchResults: "Search Results",
    searchStock: "Quote Lookup",
    showApiCall: "API Call Log",
    sessionAllDay: "All-Day Trading",
    sessionClosed: "Closed",
    sessionPostMarket: "Post-market",
    sessionPreMarket: "Pre-market",
    sessionRegular: "Trading",
    stockSymbol: "Symbol",
    stderr: "Standard Error",
    symbolHelp: "Use Longbridge format such as NVDA.US, 1810.HK, or 601398.SH.",
    symbolNotFound: "Symbol Not Found",
    symbolNotFoundMessage: "Longbridge returned no quote for this symbol.",
    symbolPlaceholder: "NVDA.US",
    totalShares: "Total Shares",
    tracked: "Tracked",
    trendCore: "Core Trends",
    trendToday: "Daily Change",
    trendYearToDate: "Year-to-date",
    trendOneMonth: "One-month",
    turnover: "Turnover",
    updatedWatchlist: "Watchlist Updated",
    usExtendedSession: "US Extended Session",
    usIndex: "US Indexes",
    usStocks: "US Stocks",
    valuationMetrics: "Valuation Metrics",
    volume: "Volume",
    watchlistDetail: "Symbol Details",
    stdoutBytes: "Output Size",
  },
  "zh-CN": {
    addSymbol: "新增标的",
    addToWatchlist: "加入自选股",
    aShares: "A 股",
    apiCallLogsCleared: "API 调用日志已清空",
    apiCallStatusFailure: "失败",
    apiCallStatusSuccess: "成功",
    available: "可添加",
    basicInformation: "基础信息",
    bps: "每股净资产",
    changePercentTooltip: "当日涨跌幅",
    circulatingShares: "流通股本",
    cnIndex: "A 股指数",
    commodities: "贵金属/大宗商品",
    configureWatchlist: "管理自选股",
    copyCommand: "复制命令",
    copyResponseJson: "复制响应 JSON",
    copySymbol: "复制标的代码",
    clearApiCallLogs: "清空 API 调用日志",
    command: "命令",
    crypto: "加密货币",
    currentStatus: "当前状态",
    dailyStats: "日内行情",
    dividend: "股息",
    displayWatchlist: "自选股",
    duplicateSymbol: "已在自选股中",
    duplicateSymbolMessage: "这个标的已经在自选股中。",
    duration: "耗时",
    enterAnotherSymbol: "请检查标的代码后重新添加。",
    eps: "每股收益",
    epsTtm: "每股收益 TTM",
    exchange: "交易所",
    extendedTrading: "扩展时段",
    failedToAddSymbol: "新增标的失败",
    failedToLoadApiCallLogs: "加载 API 调用日志失败",
    failedToLoadMarketDetail: "加载市场详情失败",
    failedToLoadMarkets: "加载市场行情失败",
    failedToLoadWatchlist: "加载自选股失败",
    failedToSearchStocks: "查询行情失败",
    highPrice: "最高价",
    hkIndex: "港股指数",
    hkStocks: "港股",
    latestPrice: "最新报价",
    latestQueryTime: "最新查询时间",
    loadMarketsDescription: "请稍候，正在批量获取市场报价...",
    loadMarketsTitle: "正在查询 Longbridge 行情",
    loadWatchlistDescription: "请稍候，正在获取自选股行情...",
    loadWatchlistTitle: "正在查询自选股行情",
    lotSize: "每手股数",
    lowPrice: "最低价",
    marketDetailNotFound: "未找到市场详情",
    marketDetailNotFoundDescription: "Longbridge 未返回行情：",
    marketStatus: "市场概览",
    missingSymbols: "未返回行情的标的",
    moveDown: "下移",
    moveUp: "上移",
    name: "名称",
    namePlaceholder: "可选展示名称",
    noStockQuotesFound: "未找到行情",
    noStockQuotesFoundDescription: "请尝试其他代码、名称或市场。",
    noApiCallLogs: "暂无 API 调用日志",
    noApiCallLogsDescription: "使用扩展触发 Longbridge API 调用后会展示在这里。",
    noResponseJson: "这条调用没有保存响应内容。",
    noWatchlistItems: "暂无自选标的",
    noWatchlistItemsDescription: "新增一个标的即可开始跟踪行情。",
    optional: "可选",
    other: "其他",
    openPrice: "开盘价",
    previousClose: "昨收价",
    priceTooltip: "最新报价",
    quoteDetails: "行情详情",
    quoteStatus: "行情状态",
    queryTime: "查询时间",
    requestTime: "请求时间",
    responseJson: "响应 JSON",
    responseTruncated: "响应内容保存时已截断。",
    removeFromWatchlist: "从自选股移除",
    removedFromWatchlist: "已从自选股移除",
    searchPlaceholder: "输入标的代码、公司名称或市场",
    searchResults: "搜索结果",
    searchStock: "行情查询",
    showApiCall: "API 调用日志",
    sessionAllDay: "全天交易",
    sessionClosed: "休市",
    sessionPostMarket: "盘后",
    sessionPreMarket: "盘前",
    sessionRegular: "盘中",
    stockSymbol: "标的代码",
    stderr: "标准错误",
    symbolHelp: "请使用 Longbridge 格式，例如 NVDA.US、1810.HK 或 601398.SH。",
    symbolNotFound: "标的不存在",
    symbolNotFoundMessage: "Longbridge 没有返回这个标的的行情。",
    symbolPlaceholder: "NVDA.US",
    totalShares: "总股本",
    tracked: "已关注",
    trendCore: "核心走势",
    trendToday: "当日涨跌幅",
    trendYearToDate: "今年来走势",
    trendOneMonth: "近一个月走势",
    turnover: "成交额",
    updatedWatchlist: "自选股已更新",
    usExtendedSession: "美股扩展时段",
    usIndex: "美股指数",
    usStocks: "美股",
    valuationMetrics: "估值指标",
    volume: "成交量",
    watchlistDetail: "标的详情",
    stdoutBytes: "输出大小",
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
