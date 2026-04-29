import { List } from "@raycast/api";
import { useState } from "react";

import { formatPercent, formatQueryTime, formatStockQuoteValue } from "./demo-data";
import { searchStockQuotes } from "./mock-api";
import { useMockRequest } from "./use-mock-request";

export default function SearchStock() {
  const [searchText, setSearchText] = useState("");
  const result = useMockRequest(() => searchStockQuotes(searchText), [searchText]);
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
      {items.length === 0 && !result.isLoading ? (
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
