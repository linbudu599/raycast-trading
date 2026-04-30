import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useCallback, useState } from "react";

import {
  formatCompactNumber,
  formatDetailLine,
  formatMoneyAmount,
  formatOptionalNumber,
  formatPercent,
  formatQueryTime,
  formatSession,
  formatStockQuoteValue,
  getChangeColor,
} from "./lib/formatters";
import { getLanguage, t } from "./lib/i18n";
import { searchStockQuotes } from "./lib/longbridge-api";
import type { StockExtendedSessionQuote, StockQuote } from "./lib/longbridge-api";
import { useAsyncRequest } from "./lib/use-async-request";

const formatExtendedSessionLine = (
  quote: StockExtendedSessionQuote,
  currency: string,
  language: ReturnType<typeof getLanguage>,
) =>
  formatDetailLine(
    formatSession(quote.session, language),
    `${formatStockQuoteValue({ currency, value: quote.last })} / ${formatPercent(quote.changePercent)} (${quote.timestamp})`,
  );

const formatStockDetailMarkdown = (quote: StockQuote, language: ReturnType<typeof getLanguage>) =>
  [
    `# ${quote.name}`,
    "",
    `## ${t("quoteDetails", language)}`,
    formatDetailLine(t("stockSymbol", language), quote.symbol),
    formatDetailLine(t("latestPrice", language), formatStockQuoteValue(quote)),
    formatDetailLine(t("changePercentTooltip", language), formatPercent(quote.dailyChangePercent)),
    formatDetailLine(t("currentStatus", language), formatSession(quote.session, language)),
    formatDetailLine(t("quoteStatus", language), quote.status),
    formatDetailLine(t("latestQueryTime", language), formatQueryTime(quote.queriedAt)),
    "",
    `## ${t("dailyStats", language)}`,
    formatDetailLine(t("openPrice", language), formatStockQuoteValue({ currency: quote.currency, value: quote.open })),
    formatDetailLine(t("highPrice", language), formatStockQuoteValue({ currency: quote.currency, value: quote.high })),
    formatDetailLine(t("lowPrice", language), formatStockQuoteValue({ currency: quote.currency, value: quote.low })),
    formatDetailLine(
      t("previousClose", language),
      formatStockQuoteValue({ currency: quote.currency, value: quote.prevClose }),
    ),
    formatDetailLine(t("volume", language), formatCompactNumber(quote.volume)),
    formatDetailLine(t("turnover", language), formatMoneyAmount(quote.turnover, quote.currency)),
    ...(quote.preMarketQuote || quote.postMarketQuote
      ? [
          "",
          `## ${t("extendedTrading", language)}`,
          ...(quote.preMarketQuote ? [formatExtendedSessionLine(quote.preMarketQuote, quote.currency, language)] : []),
          ...(quote.postMarketQuote
            ? [formatExtendedSessionLine(quote.postMarketQuote, quote.currency, language)]
            : []),
        ]
      : []),
    "",
    `## ${t("basicInformation", language)}`,
    formatDetailLine(t("name", language), quote.name),
    formatDetailLine(t("exchange", language), quote.exchange ?? "-"),
    formatDetailLine(t("lotSize", language), formatOptionalNumber(quote.lotSize)),
    formatDetailLine(t("totalShares", language), formatCompactNumber(quote.totalShares)),
    formatDetailLine(t("circulatingShares", language), formatCompactNumber(quote.circulatingShares)),
    "",
    `## ${t("valuationMetrics", language)}`,
    formatDetailLine(t("eps", language), formatOptionalNumber(quote.eps)),
    formatDetailLine(t("epsTtm", language), formatOptionalNumber(quote.epsTtm)),
    formatDetailLine(t("bps", language), formatOptionalNumber(quote.bps)),
    formatDetailLine(t("dividend", language), formatOptionalNumber(quote.dividend)),
  ].join("\n");

export default function SearchStock() {
  const language = getLanguage();
  const [searchText, setSearchText] = useState("");
  const requestQuotes = useCallback(() => searchStockQuotes(searchText), [searchText]);
  const result = useAsyncRequest(requestQuotes, [requestQuotes]);
  const hasSearchText = searchText.trim().length > 0;
  const items = result.data?.items ?? [];
  const queriedAt = result.data ? formatQueryTime(result.data.queriedAt) : "";

  return (
    <List
      isLoading={result.isLoading}
      isShowingDetail
      navigationTitle={t("searchStock", language)}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={t("searchPlaceholder", language)}
      throttle
    >
      {result.error ? (
        <List.EmptyView title={t("failedToSearchStocks", language)} description={result.error.message} />
      ) : null}
      {!hasSearchText && !result.isLoading && !result.error ? (
        <List.EmptyView
          title={t("searchStock", language)}
          description={t("searchPlaceholder", language)}
          icon={Icon.MagnifyingGlass}
        />
      ) : null}
      {hasSearchText && items.length === 0 && !result.isLoading && !result.error ? (
        <List.EmptyView
          title={t("noStockQuotesFound", language)}
          description={t("noStockQuotesFoundDescription", language)}
          icon={Icon.MagnifyingGlass}
        />
      ) : null}
      <List.Section title={t("searchResults", language)}>
        {items.map((quote) => (
          <List.Item
            key={quote.symbol}
            title={quote.name}
            subtitle={quote.symbol}
            keywords={[quote.symbol, quote.name, quote.market, quote.exchange ?? ""]}
            accessories={[
              { text: formatStockQuoteValue(quote), tooltip: t("latestPrice", language) },
              {
                tag: {
                  color: getChangeColor(quote.dailyChangePercent),
                  value: formatPercent(quote.dailyChangePercent),
                },
                tooltip: t("changePercentTooltip", language),
              },
              { text: formatSession(quote.session, language), tooltip: t("currentStatus", language) },
              { text: queriedAt, tooltip: t("latestQueryTime", language) },
            ]}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard title={t("copySymbol", language)} content={quote.symbol} />
              </ActionPanel>
            }
            detail={<List.Item.Detail markdown={formatStockDetailMarkdown(quote, language)} />}
          />
        ))}
      </List.Section>
    </List>
  );
}
