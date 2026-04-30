import { List } from "@raycast/api";
import { useCallback, useState } from "react";

import { formatPercent, formatQueryTime, formatStockQuoteValue } from "./lib/demo-data";
import { getLanguage, t, translateSession } from "./lib/i18n";
import { searchStockQuotes } from "./lib/mock-api";
import { useMockRequest } from "./lib/use-mock-request";

export default function SearchStock() {
  const language = getLanguage();
  const [searchText, setSearchText] = useState("");
  const requestQuotes = useCallback(() => searchStockQuotes(searchText), [searchText]);
  const result = useMockRequest(requestQuotes, [requestQuotes]);
  const items = result.data?.items ?? [];
  const queriedAt = result.data ? formatQueryTime(result.data.queriedAt) : "";

  return (
    <List
      isLoading={result.isLoading}
      navigationTitle={t("searchStock", language)}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={t("searchPlaceholder", language)}
      throttle
    >
      {result.error ? (
        <List.EmptyView title={t("failedToSearchStocks", language)} description={result.error.message} />
      ) : null}
      {items.length === 0 && !result.isLoading && !result.error ? (
        <List.EmptyView
          title={t("noStockQuotesFound", language)}
          description={t("noStockQuotesFoundDescription", language)}
        />
      ) : null}
      <List.Section title={t("searchResults", language)}>
        {items.map((quote) => (
          <List.Item
            key={quote.symbol}
            title={quote.name}
            subtitle={quote.symbol}
            accessories={[
              { text: formatStockQuoteValue(quote), tooltip: t("latestPrice", language) },
              { text: formatPercent(quote.dailyChangePercent), tooltip: t("changePercentTooltip", language) },
              { text: translateSession(quote.session, language), tooltip: t("currentStatus", language) },
              { text: queriedAt, tooltip: t("latestQueryTime", language) },
            ]}
          />
        ))}
      </List.Section>
    </List>
  );
}
