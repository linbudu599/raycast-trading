import type { MarketQuote, MarketQuoteDetail, StockQuote } from "./mock-api";

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

const formatTrendLine = ({ changePercent, label }: MarketQuoteDetail["yesterday"]) =>
  `- ${label}: ${formatPercent(changePercent)}`;

export const formatMarketDetailMarkdown = (detail: MarketQuoteDetail) =>
  [
    `# ${detail.quote.name}`,
    "",
    `- 标的代码: ${detail.quote.symbol}`,
    `- 最新报价: ${formatMarketQuoteValue(detail.quote)}`,
    `- 当前状态: ${detail.session}`,
    `- 查询时间: ${formatQueryTime(detail.queriedAt)}`,
    "",
    "## 核心走势",
    formatTrendLine(detail.yesterday),
    formatTrendLine(detail.oneMonth),
    formatTrendLine(detail.yearToDate),
    ...(detail.extendedSession
      ? [
          "",
          "## 美股扩展时段",
          `- ${detail.extendedSession.session}: ${formatMarketQuoteValue({
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
