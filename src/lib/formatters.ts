import { Color } from "@raycast/api";

import { t, translateMarketName, translateSession } from "./i18n";
import type { Language } from "./i18n";
import type { MarketQuote, MarketQuoteDetail } from "./market-types";

export type ChangeColorStyle = "green-up-red-down" | "red-up-green-down";

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

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  notation: "compact",
});

const queryTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  year: "numeric",
});

export const EMPTY_VALUE = "-";

export const getChangeColor = (value: number, style: ChangeColorStyle = "green-up-red-down") => {
  if (value > 0) {
    return style === "green-up-red-down" ? Color.Green : Color.Red;
  }

  if (value < 0) {
    return style === "green-up-red-down" ? Color.Red : Color.Green;
  }

  return Color.SecondaryText;
};

export const formatUsd = (value: number) => currencyFormatter.format(value);

export const formatNumber = (value: number) => decimalFormatter.format(value);

export const formatOptionalNumber = (value: number | undefined) =>
  value === undefined ? EMPTY_VALUE : formatNumber(value);

export const formatCompactNumber = (value: number | undefined) =>
  value === undefined ? EMPTY_VALUE : compactNumberFormatter.format(value);

export const formatMoneyAmount = (value: number | undefined, currency: string) => {
  if (value === undefined) {
    return EMPTY_VALUE;
  }

  return `${compactNumberFormatter.format(value)}${currency ? ` ${currency}` : ""}`;
};

export const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

export const formatMarketQuoteValue = ({ value }: Pick<MarketQuote, "unit" | "value">) => formatNumber(value);

export const formatStockQuoteValue = ({ currency, value }: { currency: string; value: number }) =>
  `${formatNumber(value)}${currency ? ` ${currency}` : ""}`;

export const formatQueryTime = (value: Date) => queryTimeFormatter.format(value);

export const formatDetailLine = (label: string, value: string) => `- ${label}: ${value}`;

export const formatSession = (session: string | undefined, language: Language) =>
  translateSession(session, language) ?? EMPTY_VALUE;

export const formatJsonOutput = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value.trim() || undefined;
  }
};

const formatTrendLine = (label: string, { changePercent }: MarketQuoteDetail["yesterday"]) =>
  formatDetailLine(label, formatPercent(changePercent));

export const formatMarketDetailMarkdown = (detail: MarketQuoteDetail, language: Language) =>
  [
    `# ${translateMarketName(detail.quote.symbol, detail.quote.name, language)}`,
    "",
    formatDetailLine(t("stockSymbol", language), detail.quote.symbol),
    formatDetailLine(t("latestPrice", language), formatMarketQuoteValue(detail.quote)),
    formatDetailLine(t("currentStatus", language), formatSession(detail.session, language)),
    formatDetailLine(t("queryTime", language), formatQueryTime(detail.queriedAt)),
    "",
    `## ${t("trendCore", language)}`,
    formatTrendLine(t("trendToday", language), detail.yesterday),
    formatTrendLine(t("trendOneMonth", language), detail.oneMonth),
    formatTrendLine(t("trendYearToDate", language), detail.yearToDate),
    ...(detail.extendedSession
      ? [
          "",
          `## ${t("usExtendedSession", language)}`,
          formatDetailLine(
            formatSession(detail.extendedSession.session, language),
            `${formatMarketQuoteValue({
              unit: detail.quote.unit,
              value: detail.extendedSession.value,
            })} / ${formatPercent(detail.extendedSession.changePercent)}`,
          ),
        ]
      : []),
  ].join("\n");
