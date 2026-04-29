import { List } from "@raycast/api";
import { useCallback, useState } from "react";

import { formatPercent, formatQueryTime, formatStockQuoteValue } from "./lib/demo-data";
import { searchStockQuotes } from "./lib/mock-api";
import { useMockRequest } from "./lib/use-mock-request";

export default function SearchStock() {
  const [searchText, setSearchText] = useState("");
  const requestQuotes = useCallback(() => searchStockQuotes(searchText), [searchText]);
  const result = useMockRequest(requestQuotes, [requestQuotes]);
  const items = result.data?.items ?? [];
  const queriedAt = result.data ? formatQueryTime(result.data.queriedAt) : "";

  return (
    <List
      isLoading={result.isLoading}
      navigationTitle="Search Stock"
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search symbol, name, or market"
      throttle
    >
      {result.error ? (
        <List.EmptyView title="Failed to search stock quotes" description={result.error.message} />
      ) : null}
      {items.length === 0 && !result.isLoading && !result.error ? (
        <List.EmptyView title="No stock quotes found" description="Try another symbol, name, or market." />
      ) : null}
      <List.Section title="搜索结果">
        {items.map((quote) => (
          <List.Item
            key={quote.symbol}
            title={quote.name}
            subtitle={quote.symbol}
            accessories={[
              { text: formatStockQuoteValue(quote), tooltip: "最新报价" },
              { text: formatPercent(quote.dailyChangePercent), tooltip: "当日涨跌幅" },
              { text: quote.session, tooltip: "交易状态" },
              { text: queriedAt, tooltip: "最新查询时间" },
            ]}
          />
        ))}
      </List.Section>
    </List>
  );
}
