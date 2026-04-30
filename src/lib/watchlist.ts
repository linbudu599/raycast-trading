import { LocalStorage } from "@raycast/api";

import { fetchLongbridgeQuotes } from "./longbridge-api";
import type { Language } from "./i18n";
import type { ExtendedSessionTrend, MarketQuoteUnit, TradingSession } from "./market-types";
import type { MarketQuoteCategory, MarketSymbol } from "./markets";

export type WatchlistCategory = "US Stocks" | "HK Stocks" | "A Shares" | "Other";

export interface WatchlistItem {
  symbol: string;
  name: string;
  category: WatchlistCategory;
  unit: MarketQuoteUnit;
}

export interface WatchlistQuote extends WatchlistItem {
  value: number;
  changePercent: number;
  queriedAt: Date;
  session: TradingSession;
  extendedSession: ExtendedSessionTrend | undefined;
}

export interface WatchlistSection {
  category: WatchlistCategory;
  items: readonly WatchlistQuote[];
}

export interface WatchlistSnapshot {
  queriedAt: Date;
  sections: readonly WatchlistSection[];
  missingSymbols: readonly string[];
}

const WATCHLIST_STORAGE_KEY = "watchlist.items.v1";

export const WATCHLIST_CATEGORY_ORDER: readonly WatchlistCategory[] = ["US Stocks", "HK Stocks", "A Shares", "Other"];

const DEFAULT_WATCHLIST_NAMES: Record<string, Record<Language, string>> = {
  "1810.HK": { en: "Xiaomi Corporation", "zh-CN": "小米集团" },
  "601398.SH": { en: "ICBC", "zh-CN": "工商银行" },
  "AAPL.US": { en: "Apple Inc.", "zh-CN": "苹果" },
  "NVDA.US": { en: "NVIDIA Corporation", "zh-CN": "英伟达" },
};

const DEFAULT_WATCHLIST_SYMBOLS = ["NVDA.US", "AAPL.US", "1810.HK", "601398.SH"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object";

const isWatchlistCategory = (value: unknown): value is WatchlistCategory =>
  value === "US Stocks" || value === "HK Stocks" || value === "A Shares" || value === "Other";

const isMarketQuoteUnit = (value: unknown): value is MarketQuoteUnit => value === "points" || value === "usd";

const isWatchlistItem = (value: unknown): value is WatchlistItem => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.symbol === "string" &&
    typeof value.name === "string" &&
    isWatchlistCategory(value.category) &&
    isMarketQuoteUnit(value.unit)
  );
};

export const normalizeWatchlistSymbol = (symbol: string) => symbol.trim().toUpperCase();

export const getWatchlistCategory = (symbol: string): WatchlistCategory => {
  if (symbol.endsWith(".US")) {
    return "US Stocks";
  }

  if (symbol.endsWith(".HK")) {
    return "HK Stocks";
  }

  if (symbol.endsWith(".SH") || symbol.endsWith(".SZ")) {
    return "A Shares";
  }

  return "Other";
};

export const getDefaultWatchlistName = (symbol: string, language: Language) =>
  DEFAULT_WATCHLIST_NAMES[symbol]?.[language];

export const getWatchlistDisplayName = (item: Pick<WatchlistItem, "name" | "symbol">, language: Language) =>
  getDefaultWatchlistName(item.symbol, language) ?? item.name;

const createWatchlistItem = (symbol: string, language: Language, name?: string): WatchlistItem => ({
  category: getWatchlistCategory(symbol),
  name: name?.trim() || getDefaultWatchlistName(symbol, language) || symbol,
  symbol,
  unit: "usd",
});

const toMarketCategory = (category: WatchlistCategory): MarketQuoteCategory => {
  if (category === "HK Stocks") {
    return "HK Index";
  }

  if (category === "A Shares") {
    return "CN Index";
  }

  return "US Index";
};

const toMarketSymbol = (item: WatchlistItem): MarketSymbol => ({
  category: toMarketCategory(item.category),
  name: item.name,
  symbol: item.symbol,
  unit: item.unit,
});

const parseStoredWatchlist = (storedValue: string): readonly WatchlistItem[] | undefined => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(storedValue);
  } catch {
    return undefined;
  }

  if (!Array.isArray(parsed) || !parsed.every(isWatchlistItem)) {
    return undefined;
  }

  return parsed;
};

export const getDefaultWatchlistItems = (language: Language): readonly WatchlistItem[] =>
  DEFAULT_WATCHLIST_SYMBOLS.map((symbol) => createWatchlistItem(symbol, language));

export const getWatchlistItems = async (language: Language): Promise<readonly WatchlistItem[]> => {
  const storedValue = await LocalStorage.getItem<string>(WATCHLIST_STORAGE_KEY);

  if (!storedValue) {
    return getDefaultWatchlistItems(language);
  }

  return parseStoredWatchlist(storedValue) ?? getDefaultWatchlistItems(language);
};

export const saveWatchlistItems = (items: readonly WatchlistItem[]) =>
  LocalStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));

export const buildValidatedWatchlistItem = async (
  symbolInput: string,
  language: Language,
  nameInput?: string,
): Promise<WatchlistItem | undefined> => {
  const symbol = normalizeWatchlistSymbol(symbolInput);

  if (!symbol) {
    return undefined;
  }

  const item = createWatchlistItem(symbol, language, nameInput);
  const quotes = await fetchLongbridgeQuotes([toMarketSymbol(item)]);

  return quotes.length > 0 ? item : undefined;
};

export const fetchWatchlistSnapshot = async (language: Language): Promise<WatchlistSnapshot> => {
  const queriedAt = new Date();
  const items = await getWatchlistItems(language);
  const resolvedQuotes = await fetchLongbridgeQuotes(items.map(toMarketSymbol));
  const quotesBySymbol = new Map(resolvedQuotes.map((quote) => [quote.quote.symbol, quote]));
  const quotes = items
    .map((item): WatchlistQuote | undefined => {
      const resolvedQuote = quotesBySymbol.get(item.symbol);

      if (!resolvedQuote) {
        return undefined;
      }

      return {
        ...item,
        changePercent: resolvedQuote.quote.changePercent,
        extendedSession: resolvedQuote.extendedSession,
        queriedAt: resolvedQuote.queriedAt,
        session: resolvedQuote.session,
        value: resolvedQuote.quote.value,
      };
    })
    .filter((quote): quote is WatchlistQuote => quote !== undefined);
  const quotedSymbols = new Set(quotes.map((quote) => quote.symbol));

  return {
    missingSymbols: items.map((item) => item.symbol).filter((symbol) => !quotedSymbols.has(symbol)),
    queriedAt,
    sections: WATCHLIST_CATEGORY_ORDER.map((category) => ({
      category,
      items: quotes.filter((quote) => quote.category === category),
    })).filter((section) => section.items.length > 0),
  };
};
