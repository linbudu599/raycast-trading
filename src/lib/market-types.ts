import type { MarketQuote, MarketQuoteSection, TradingSession } from "./markets";

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
