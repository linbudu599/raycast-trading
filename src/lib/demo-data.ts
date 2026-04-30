import type { MarketQuote, MarketQuoteDetail, StockQuote } from "./mock-api";
import { t, translateMarketName, translateSession } from "./i18n";
import type { Language } from "./i18n";

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

const cnyFormatter = new Intl.NumberFormat("zh-CN", {
  currency: "CNY",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: "currency",
});

const queryTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  year: "numeric",
});

export const formatUsd = (value: number) => currencyFormatter.format(value);

export const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

export const formatMarketQuoteValue = ({ value }: Pick<MarketQuote, "unit" | "value">) =>
  decimalFormatter.format(value);

const formatTrendLine = (label: string, { changePercent }: MarketQuoteDetail["yesterday"]) =>
  `- ${label}: ${formatPercent(changePercent)}`;

export const formatMarketDetailMarkdown = (detail: MarketQuoteDetail, language: Language) =>
  [
    `# ${translateMarketName(detail.quote.symbol, detail.quote.name, language)}`,
    "",
    `- ${t("stockSymbol", language)}: ${detail.quote.symbol}`,
    `- ${t("latestPrice", language)}: ${formatMarketQuoteValue(detail.quote)}`,
    `- ${t("currentStatus", language)}: ${translateSession(detail.session, language)}`,
    `- ${t("queryTime", language)}: ${formatQueryTime(detail.queriedAt)}`,
    "",
    `## ${t("trendCore", language)}`,
    formatTrendLine(t("trendToday", language), detail.yesterday),
    formatTrendLine(t("trendOneMonth", language), detail.oneMonth),
    formatTrendLine(t("trendYearToDate", language), detail.yearToDate),
    ...(detail.extendedSession
      ? [
          "",
          `## ${t("usExtendedSession", language)}`,
          `- ${translateSession(detail.extendedSession.session, language)}: ${formatMarketQuoteValue({
            unit: detail.quote.unit,
            value: detail.extendedSession.value,
          })} / ${formatPercent(detail.extendedSession.changePercent)}`,
        ]
      : []),
  ].join("\n");

export const formatFundNav = (value: number) => value.toFixed(4);

export const calculateFundDailyEarningsPerTenThousand = (dailyChangePercent: number) =>
  10000 * (dailyChangePercent / 100);

export const formatDailyEarnings = (value: number) => cnyFormatter.format(value);

export const formatStockQuoteValue = ({ currency, value }: Pick<StockQuote, "currency" | "value">) =>
  `${decimalFormatter.format(value)} ${currency}`;

export const formatQueryTime = (value: Date) => queryTimeFormatter.format(value);
