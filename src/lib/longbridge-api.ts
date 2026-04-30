import { Cache } from "@raycast/api";
import { execFile } from "child_process";

import { recordApiCall } from "./api-call-log";
import { MARKET_CATEGORY_ORDER, MARKET_SECTION_TITLES, MARKET_SYMBOLS } from "./markets";
import type { MarketQuote, MarketQuoteCategory, MarketQuoteSection, MarketSymbol, TradingSession } from "./markets";
import type { ExtendedSessionTrend, MarketQuoteDetail, MarketSnapshot, MarketTrendSummary } from "./market-types";

type ConcreteMarket = "US" | "HK" | "CN";

type SessionWindow = {
  startMinutes: number;
  endMinutes: number;
  session: Extract<TradingSession, "盘前" | "盘中" | "盘后">;
};

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface ResolvedQuote {
  quote: MarketQuote;
  queriedAt: Date;
  session: TradingSession;
  actualSession: TradingSession;
  extendedSession: ExtendedSessionTrend | undefined;
}

interface CachedResolvedQuote {
  value: number;
  changePercent: number;
  queriedAtTimestamp: number;
  expiresAtTimestamp: number;
  session: TradingSession;
  actualSession: TradingSession;
  extendedSession: ExtendedSessionTrend | undefined;
}

interface SelectedPrice {
  value: number;
  prevClose: number;
  actualSession: TradingSession;
  extendedSession: ExtendedSessionTrend | undefined;
}

interface LongbridgeCliPrePostQuote {
  high: string;
  last: string;
  low: string;
  prev_close: string;
  timestamp: string;
  turnover: string;
  volume: number;
}

interface LongbridgeCliQuote {
  high: string;
  symbol: string;
  last: string;
  low: string;
  open: string;
  prev_close: string;
  pre_market_quote: LongbridgeCliPrePostQuote | null;
  post_market_quote: LongbridgeCliPrePostQuote | null;
  status: string;
  turnover: string;
  volume: number;
}

interface LongbridgeCliStaticInfo {
  bps: string;
  "circ._shares": string;
  currency: string;
  dividend: string;
  eps: string;
  eps_ttm: string;
  exchange: string;
  lot_size: string;
  name: string;
  symbol: string;
  total_shares: string;
}

export type StockQuoteMarket = "US" | "HK" | "CN" | "SG" | "Crypto" | "Other";

export interface StockExtendedSessionQuote {
  changePercent: number;
  high: number;
  last: number;
  low: number;
  session: Extract<TradingSession, "盘前" | "盘后">;
  timestamp: string;
  turnover: number;
  volume: number;
}

export interface StockQuote {
  bps: number | undefined;
  circulatingShares: number | undefined;
  currency: string;
  dailyChangePercent: number;
  dividend: number | undefined;
  eps: number | undefined;
  epsTtm: number | undefined;
  exchange: string | undefined;
  high: number;
  lotSize: number | undefined;
  low: number;
  market: StockQuoteMarket;
  name: string;
  open: number;
  postMarketQuote: StockExtendedSessionQuote | undefined;
  preMarketQuote: StockExtendedSessionQuote | undefined;
  prevClose: number;
  queriedAt: Date;
  session: TradingSession;
  status: string;
  symbol: string;
  totalShares: number | undefined;
  turnover: number;
  value: number;
  volume: number;
}

export interface StockSearchResult {
  queriedAt: Date;
  items: readonly StockQuote[];
}

const cache = new Cache({ namespace: "longbridge-api" });

const SESSION_WINDOWS: Record<ConcreteMarket, readonly SessionWindow[]> = {
  CN: [
    { startMinutes: 9 * 60 + 30, endMinutes: 11 * 60 + 30, session: "盘中" },
    { startMinutes: 13 * 60, endMinutes: 15 * 60, session: "盘中" },
  ],
  HK: [
    { startMinutes: 9 * 60 + 30, endMinutes: 12 * 60, session: "盘中" },
    { startMinutes: 13 * 60, endMinutes: 16 * 60, session: "盘中" },
  ],
  US: [
    { startMinutes: 4 * 60, endMinutes: 9 * 60 + 30, session: "盘前" },
    { startMinutes: 9 * 60 + 30, endMinutes: 16 * 60, session: "盘中" },
    { startMinutes: 16 * 60, endMinutes: 20 * 60, session: "盘后" },
  ],
};

const MARKET_TIME_ZONES: Record<ConcreteMarket, string> = {
  CN: "Asia/Shanghai",
  HK: "Asia/Hong_Kong",
  US: "America/New_York",
};

const DETAIL_PLACEHOLDER: Omit<MarketQuoteDetail, "extendedSession" | "queriedAt" | "quote" | "session" | "yesterday"> =
  {
    oneMonth: { label: "近一个月走势", changePercent: 0 },
    yearToDate: { label: "今年来走势", changePercent: 0 },
  };

const SEARCH_SYMBOL_HINTS = [
  { market: "US", name: "Apple", symbol: "AAPL.US" },
  { market: "US", name: "NVIDIA", symbol: "NVDA.US" },
  { market: "US", name: "Tesla", symbol: "TSLA.US" },
  { market: "US", name: "Microsoft", symbol: "MSFT.US" },
  { market: "US", name: "Amazon", symbol: "AMZN.US" },
  { market: "US", name: "Alphabet", symbol: "GOOGL.US" },
  { market: "HK", name: "Tencent", symbol: "700.HK" },
  { market: "HK", name: "Xiaomi", symbol: "1810.HK" },
  { market: "HK", name: "Alibaba", symbol: "9988.HK" },
  { market: "CN", name: "Kweichow Moutai", symbol: "600519.SH" },
  { market: "CN", name: "CATL", symbol: "300750.SZ" },
] as const;

const LONG_BRIDGE_COMMAND_DEDUP_WINDOW_MS = 2_000;

const longbridgeInFlightCalls = new Map<string, Promise<string>>();
const longbridgeRecentCalls = new Map<string, { expiresAt: number; stdout: string }>();

const getCacheKey = (symbol: string) => `market-quote:${symbol}`;

const getZonedParts = (date: Date, timeZone: string): ZonedParts => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone,
    year: "numeric",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  const hour = Number(parts.hour);

  return {
    day: Number(parts.day),
    hour: hour === 24 ? 0 : hour,
    minute: Number(parts.minute),
    month: Number(parts.month),
    second: Number(parts.second),
    year: Number(parts.year),
  };
};

const getWeekday = ({ day, month, year }: Pick<ZonedParts, "day" | "month" | "year">) =>
  new Date(Date.UTC(year, month - 1, day)).getUTCDay();

const isWeekday = (parts: Pick<ZonedParts, "day" | "month" | "year">) => {
  const weekday = getWeekday(parts);
  return weekday >= 1 && weekday <= 5;
};

const getCurrentMinutes = ({ hour, minute }: Pick<ZonedParts, "hour" | "minute">) => hour * 60 + minute;

const getSessionFromWindows = (date: Date, market: ConcreteMarket): TradingSession => {
  const parts = getZonedParts(date, MARKET_TIME_ZONES[market]);

  if (!isWeekday(parts)) {
    return "休市";
  }

  const currentMinutes = getCurrentMinutes(parts);
  return (
    SESSION_WINDOWS[market].find(
      (window) => currentMinutes >= window.startMinutes && currentMinutes < window.endMinutes,
    )?.session ?? "休市"
  );
};

const addLocalDays = (parts: Pick<ZonedParts, "day" | "month" | "year">, days: number) => {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));

  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  };
};

const zonedTimeToUtcTimestamp = (
  parts: Pick<ZonedParts, "day" | "month" | "year">,
  hour: number,
  minute: number,
  timeZone: string,
) => {
  const utcGuess = Date.UTC(parts.year, parts.month - 1, parts.day, hour, minute);
  const guessedZonedParts = getZonedParts(new Date(utcGuess), timeZone);
  const desiredUtc = Date.UTC(parts.year, parts.month - 1, parts.day, hour, minute);
  const guessedZonedUtc = Date.UTC(
    guessedZonedParts.year,
    guessedZonedParts.month - 1,
    guessedZonedParts.day,
    guessedZonedParts.hour,
    guessedZonedParts.minute,
    guessedZonedParts.second,
  );

  return utcGuess + (desiredUtc - guessedZonedUtc);
};

const getNextSessionStartTimestamp = (date: Date, market: ConcreteMarket) => {
  const timeZone = MARKET_TIME_ZONES[market];
  const parts = getZonedParts(date, timeZone);

  for (let dayOffset = 0; dayOffset <= 7; dayOffset += 1) {
    const localDate = addLocalDays(parts, dayOffset);

    if (!isWeekday(localDate)) {
      continue;
    }

    for (const window of SESSION_WINDOWS[market]) {
      const timestamp = zonedTimeToUtcTimestamp(
        localDate,
        Math.floor(window.startMinutes / 60),
        window.startMinutes % 60,
        timeZone,
      );

      if (timestamp > date.getTime()) {
        return timestamp;
      }
    }
  }

  return date.getTime() + 60 * 60 * 1000;
};

const getConcreteMarket = (symbol: string): ConcreteMarket | undefined => {
  if (symbol.endsWith(".US")) {
    return "US";
  }

  if (symbol.endsWith(".HK")) {
    return "HK";
  }

  if (symbol.endsWith(".SH") || symbol.endsWith(".SZ")) {
    return "CN";
  }

  return undefined;
};

const getCategorySession = (category: MarketQuoteCategory, date: Date): TradingSession | undefined => {
  if (category === "Crypto") {
    return "全天交易";
  }

  if (category === "Commodities") {
    return isWeekday(getZonedParts(date, MARKET_TIME_ZONES.US)) ? "盘中" : "休市";
  }

  if (category === "US Index") {
    return getSessionFromWindows(date, "US");
  }

  if (category === "HK Index") {
    return getSessionFromWindows(date, "HK");
  }

  if (category === "CN Index") {
    return getSessionFromWindows(date, "CN");
  }

  return undefined;
};

const calculateChangePercent = (value: number, prevClose: number) => {
  if (!Number.isFinite(value) || !Number.isFinite(prevClose) || prevClose === 0) {
    return 0;
  }

  return ((value - prevClose) / prevClose) * 100;
};

const parseQuoteNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseOptionalQuoteNumber = (value: string | undefined) => {
  if (value === undefined || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object";

const includesQuery = (value: string, query: string) => value.toLocaleLowerCase().includes(query.toLocaleLowerCase());

const isTradingSessionValue = (value: unknown): value is TradingSession =>
  value === "盘前" || value === "盘中" || value === "盘后" || value === "全天交易" || value === "休市";

const isExtendedSessionTrend = (value: unknown): value is ExtendedSessionTrend => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.session === "盘前" || value.session === "盘后") &&
    typeof value.value === "number" &&
    typeof value.changePercent === "number"
  );
};

const isCachedResolvedQuote = (value: unknown): value is CachedResolvedQuote => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.value === "number" &&
    typeof value.changePercent === "number" &&
    typeof value.queriedAtTimestamp === "number" &&
    typeof value.expiresAtTimestamp === "number" &&
    isTradingSessionValue(value.session) &&
    isTradingSessionValue(value.actualSession) &&
    (value.extendedSession === undefined || isExtendedSessionTrend(value.extendedSession))
  );
};

const getPrePostPrice = (
  session: Extract<TradingSession, "盘前" | "盘后">,
  quote: LongbridgeCliPrePostQuote | null,
): SelectedPrice | undefined => {
  if (!quote) {
    return undefined;
  }

  const value = parseQuoteNumber(quote.last);
  const prevClose = parseQuoteNumber(quote.prev_close);

  return {
    actualSession: session,
    extendedSession: {
      changePercent: calculateChangePercent(value, prevClose),
      session,
      value,
    },
    prevClose,
    value,
  };
};

const selectPrice = (quote: LongbridgeCliQuote, actualSession: TradingSession): SelectedPrice => {
  const regularValue = parseQuoteNumber(quote.last);
  const regularPrevClose = parseQuoteNumber(quote.prev_close);

  if (actualSession === "盘前") {
    const preMarketPrice = getPrePostPrice("盘前", quote.pre_market_quote);

    if (preMarketPrice) {
      return preMarketPrice;
    }
  }

  if (actualSession === "盘后") {
    const postMarketPrice = getPrePostPrice("盘后", quote.post_market_quote);

    if (postMarketPrice) {
      return postMarketPrice;
    }
  }

  return {
    actualSession: actualSession === "全天交易" ? "全天交易" : actualSession,
    extendedSession: undefined,
    prevClose: regularPrevClose,
    value: regularValue,
  };
};

const readCachedQuote = (market: MarketSymbol, now: Date): ResolvedQuote | undefined => {
  const value = cache.get(getCacheKey(market.symbol));

  if (!value) {
    return undefined;
  }

  let cached: unknown;

  try {
    cached = JSON.parse(value);
  } catch {
    cache.remove(getCacheKey(market.symbol));
    return undefined;
  }

  if (!isCachedResolvedQuote(cached)) {
    cache.remove(getCacheKey(market.symbol));
    return undefined;
  }

  if (cached.expiresAtTimestamp <= now.getTime()) {
    cache.remove(getCacheKey(market.symbol));
    return undefined;
  }

  return {
    actualSession: cached.actualSession,
    extendedSession: cached.extendedSession,
    queriedAt: new Date(cached.queriedAtTimestamp),
    quote: {
      ...market,
      changePercent: cached.changePercent,
      value: cached.value,
    },
    session: cached.session,
  };
};

const writeCachedQuote = (resolvedQuote: ResolvedQuote, expiresAtTimestamp: number) => {
  const cached: CachedResolvedQuote = {
    actualSession: resolvedQuote.actualSession,
    changePercent: resolvedQuote.quote.changePercent,
    extendedSession: resolvedQuote.extendedSession,
    expiresAtTimestamp,
    queriedAtTimestamp: resolvedQuote.queriedAt.getTime(),
    session: resolvedQuote.session,
    value: resolvedQuote.quote.value,
  };

  cache.set(getCacheKey(resolvedQuote.quote.symbol), JSON.stringify(cached));
};

const isLongbridgeCliPrePostQuote = (value: unknown): value is LongbridgeCliPrePostQuote => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.high === "string" &&
    typeof value.last === "string" &&
    typeof value.low === "string" &&
    typeof value.prev_close === "string" &&
    typeof value.timestamp === "string" &&
    typeof value.turnover === "string" &&
    typeof value.volume === "number"
  );
};

const isLongbridgeCliQuote = (value: unknown): value is LongbridgeCliQuote => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.high === "string" &&
    typeof value.symbol === "string" &&
    typeof value.last === "string" &&
    typeof value.low === "string" &&
    typeof value.open === "string" &&
    typeof value.prev_close === "string" &&
    (value.pre_market_quote === null || isLongbridgeCliPrePostQuote(value.pre_market_quote)) &&
    (value.post_market_quote === null || isLongbridgeCliPrePostQuote(value.post_market_quote)) &&
    typeof value.status === "string" &&
    typeof value.turnover === "string" &&
    typeof value.volume === "number"
  );
};

const isLongbridgeCliStaticInfo = (value: unknown): value is LongbridgeCliStaticInfo => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.bps === "string" &&
    typeof value["circ._shares"] === "string" &&
    typeof value.currency === "string" &&
    typeof value.dividend === "string" &&
    typeof value.eps === "string" &&
    typeof value.eps_ttm === "string" &&
    typeof value.exchange === "string" &&
    typeof value.lot_size === "string" &&
    typeof value.name === "string" &&
    typeof value.symbol === "string" &&
    typeof value.total_shares === "string"
  );
};

const getCommandKey = (file: string, args: readonly string[]) => JSON.stringify([file, ...args]);

const execFileOnceAsync = (file: string, args: readonly string[]) =>
  new Promise<string>((resolve, reject) => {
    const startedAt = new Date();

    execFile(
      file,
      [...args],
      {
        env: {
          ...process.env,
          PATH: [process.env.PATH, "/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin"].filter(Boolean).join(":"),
        },
      },
      (error, stdout, stderr) => {
        if (file === "longbridge") {
          void recordApiCall({
            args,
            command: file,
            durationMs: Date.now() - startedAt.getTime(),
            errorMessage: error ? stderr.trim() || error.message : undefined,
            startedAt,
            status: error ? "failure" : "success",
            stderr: stderr.trim() || undefined,
            stdout,
            stdoutBytes: Buffer.byteLength(stdout),
          });
        }

        if (error) {
          reject(new Error(stderr.trim() || error.message));
          return;
        }

        resolve(stdout);
      },
    );
  });

const execFileAsync = (file: string, args: readonly string[]) => {
  if (file !== "longbridge") {
    return execFileOnceAsync(file, args);
  }

  const key = getCommandKey(file, args);
  const recentCall = longbridgeRecentCalls.get(key);

  if (recentCall && recentCall.expiresAt > Date.now()) {
    return Promise.resolve(recentCall.stdout);
  }

  const inFlightCall = longbridgeInFlightCalls.get(key);

  if (inFlightCall) {
    return inFlightCall;
  }

  const call = execFileOnceAsync(file, args)
    .then((stdout) => {
      longbridgeRecentCalls.set(key, {
        expiresAt: Date.now() + LONG_BRIDGE_COMMAND_DEDUP_WINDOW_MS,
        stdout,
      });
      return stdout;
    })
    .finally(() => {
      longbridgeInFlightCalls.delete(key);
    });

  longbridgeInFlightCalls.set(key, call);
  return call;
};

const fetchCliQuotes = async (symbols: readonly string[]): Promise<readonly LongbridgeCliQuote[]> => {
  if (symbols.length === 0) {
    return [];
  }

  const output = await execFileAsync("longbridge", ["quote", ...symbols, "--format", "json"]);
  const parsed: unknown = JSON.parse(output.trim() || "[]");

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(isLongbridgeCliQuote);
};

const fetchCliStaticInfos = async (symbols: readonly string[]): Promise<readonly LongbridgeCliStaticInfo[]> => {
  if (symbols.length === 0) {
    return [];
  }

  const output = await execFileAsync("longbridge", ["static", ...symbols, "--format", "json"]);
  const parsed: unknown = JSON.parse(output.trim() || "[]");

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(isLongbridgeCliStaticInfo);
};

const resolveQuote = (market: MarketSymbol, quote: LongbridgeCliQuote, now: Date): ResolvedQuote => {
  const concreteMarket = getConcreteMarket(market.symbol);
  const actualSession = concreteMarket ? getSessionFromWindows(now, concreteMarket) : "休市";
  const selectedPrice = selectPrice(quote, actualSession);
  const displaySession = getCategorySession(market.category, now) ?? selectedPrice.actualSession;
  const resolvedQuote: ResolvedQuote = {
    actualSession: selectedPrice.actualSession,
    extendedSession: selectedPrice.extendedSession,
    queriedAt: now,
    quote: {
      ...market,
      changePercent: calculateChangePercent(selectedPrice.value, selectedPrice.prevClose),
      value: selectedPrice.value,
    },
    session: displaySession,
  };

  if (concreteMarket && actualSession === "休市") {
    writeCachedQuote(resolvedQuote, getNextSessionStartTimestamp(now, concreteMarket));
  }

  return resolvedQuote;
};

const buildSections = (quotes: readonly MarketQuote[], now: Date): readonly MarketQuoteSection[] =>
  MARKET_CATEGORY_ORDER.map((category) => ({
    category,
    items: quotes.filter((quote) => quote.category === category),
    session: getCategorySession(category, now),
    title: MARKET_SECTION_TITLES[category],
  }));

const getStockQuoteMarket = (symbol: string): StockQuoteMarket => {
  if (symbol.endsWith(".US")) {
    return "US";
  }

  if (symbol.endsWith(".HK")) {
    return "HK";
  }

  if (symbol.endsWith(".SH") || symbol.endsWith(".SZ")) {
    return "CN";
  }

  if (symbol.endsWith(".SG")) {
    return "SG";
  }

  if (symbol.endsWith(".HAS")) {
    return "Crypto";
  }

  return "Other";
};

const getStockSession = (symbol: string, now: Date): TradingSession => {
  const concreteMarket = getConcreteMarket(symbol);
  return concreteMarket ? getSessionFromWindows(now, concreteMarket) : "休市";
};

const normalizeSearchQuery = (query: string) => query.trim().toUpperCase();

const getSymbolCandidates = (query: string): readonly string[] => {
  if (!query) {
    return [];
  }

  const hintedSymbols = SEARCH_SYMBOL_HINTS.filter(
    (item) => includesQuery(item.symbol, query) || includesQuery(item.name, query) || includesQuery(item.market, query),
  ).map((item) => item.symbol);

  if (query.includes(".")) {
    return [...new Set([query, ...hintedSymbols])];
  }

  const inferredSymbols: string[] = [];

  if (/^[A-Z]+$/.test(query)) {
    inferredSymbols.push(`${query}.US`);
  }

  if (/^\d{1,5}$/.test(query)) {
    inferredSymbols.push(`${Number(query)}.HK`);
  }

  if (/^\d{6}$/.test(query)) {
    if (query.startsWith("6")) {
      inferredSymbols.push(`${query}.SH`);
    } else if (query.startsWith("0") || query.startsWith("3")) {
      inferredSymbols.push(`${query}.SZ`);
    } else {
      inferredSymbols.push(`${query}.SH`, `${query}.SZ`);
    }
  }

  return [...new Set([...hintedSymbols, ...inferredSymbols])];
};

const toStockExtendedSessionQuote = (
  session: Extract<TradingSession, "盘前" | "盘后">,
  quote: LongbridgeCliPrePostQuote | null,
): StockExtendedSessionQuote | undefined => {
  if (!quote) {
    return undefined;
  }

  const last = parseQuoteNumber(quote.last);
  const prevClose = parseQuoteNumber(quote.prev_close);

  return {
    changePercent: calculateChangePercent(last, prevClose),
    high: parseQuoteNumber(quote.high),
    last,
    low: parseQuoteNumber(quote.low),
    session,
    timestamp: quote.timestamp,
    turnover: parseQuoteNumber(quote.turnover),
    volume: quote.volume,
  };
};

const toStockQuote = (
  quote: LongbridgeCliQuote,
  staticInfo: LongbridgeCliStaticInfo | undefined,
  now: Date,
): StockQuote => {
  const value = parseQuoteNumber(quote.last);
  const prevClose = parseQuoteNumber(quote.prev_close);

  return {
    bps: parseOptionalQuoteNumber(staticInfo?.bps),
    circulatingShares: parseOptionalQuoteNumber(staticInfo?.["circ._shares"]),
    currency: staticInfo?.currency ?? "",
    dailyChangePercent: calculateChangePercent(value, prevClose),
    dividend: parseOptionalQuoteNumber(staticInfo?.dividend),
    eps: parseOptionalQuoteNumber(staticInfo?.eps),
    epsTtm: parseOptionalQuoteNumber(staticInfo?.eps_ttm),
    exchange: staticInfo?.exchange,
    high: parseQuoteNumber(quote.high),
    lotSize: parseOptionalQuoteNumber(staticInfo?.lot_size),
    low: parseQuoteNumber(quote.low),
    market: getStockQuoteMarket(quote.symbol),
    name: staticInfo?.name ?? quote.symbol,
    open: parseQuoteNumber(quote.open),
    postMarketQuote: toStockExtendedSessionQuote("盘后", quote.post_market_quote),
    preMarketQuote: toStockExtendedSessionQuote("盘前", quote.pre_market_quote),
    prevClose,
    queriedAt: now,
    session: getStockSession(quote.symbol, now),
    status: quote.status,
    symbol: quote.symbol,
    totalShares: parseOptionalQuoteNumber(staticInfo?.total_shares),
    turnover: parseQuoteNumber(quote.turnover),
    value,
    volume: quote.volume,
  };
};

export const fetchLongbridgeQuotes = async (
  symbols: readonly MarketSymbol[] = MARKET_SYMBOLS,
): Promise<readonly ResolvedQuote[]> => {
  const now = new Date();
  const cachedQuotes = new Map<string, ResolvedQuote>();
  const symbolsToQuery = symbols.filter((market) => {
    const cachedQuote = readCachedQuote(market, now);

    if (cachedQuote) {
      cachedQuotes.set(market.symbol, cachedQuote);
      return false;
    }

    return true;
  });

  const queriedQuotes = await fetchCliQuotes(symbolsToQuery.map((market) => market.symbol));
  const quotesBySymbol = new Map(queriedQuotes.map((quote) => [quote.symbol, quote]));

  return symbols
    .map((market) => {
      const cachedQuote = cachedQuotes.get(market.symbol);

      if (cachedQuote) {
        return cachedQuote;
      }

      const quote = quotesBySymbol.get(market.symbol);
      return quote ? resolveQuote(market, quote, now) : undefined;
    })
    .filter((quote): quote is ResolvedQuote => quote !== undefined);
};

export const fetchMarketSnapshot = async (): Promise<MarketSnapshot> => {
  const queriedAt = new Date();
  const resolvedQuotes = await fetchLongbridgeQuotes();

  return {
    queriedAt,
    sections: buildSections(
      resolvedQuotes.map((quote) => quote.quote),
      queriedAt,
    ),
  };
};

export const fetchMarketQuoteDetail = async (symbol: string): Promise<MarketQuoteDetail | undefined> => {
  const market = MARKET_SYMBOLS.find((item) => item.symbol === symbol);

  if (!market) {
    return undefined;
  }

  const [resolvedQuote] = await fetchLongbridgeQuotes([market]);

  if (!resolvedQuote) {
    return undefined;
  }

  const yesterday: MarketTrendSummary = {
    changePercent: resolvedQuote.quote.changePercent,
    label: "当日涨跌幅",
  };

  return {
    ...DETAIL_PLACEHOLDER,
    extendedSession: resolvedQuote.extendedSession,
    queriedAt: resolvedQuote.queriedAt,
    quote: resolvedQuote.quote,
    session: resolvedQuote.session,
    yesterday,
  };
};

export const searchStockQuotes = async (query: string): Promise<StockSearchResult> => {
  const queriedAt = new Date();
  const symbols = getSymbolCandidates(normalizeSearchQuery(query));
  const [quotes, staticInfos] = await Promise.all([fetchCliQuotes(symbols), fetchCliStaticInfos(symbols)]);
  const staticInfoBySymbol = new Map(staticInfos.map((info) => [info.symbol, info]));

  return {
    queriedAt,
    items: quotes.map((quote) => toStockQuote(quote, staticInfoBySymbol.get(quote.symbol), queriedAt)),
  };
};
