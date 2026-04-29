import { List } from "@raycast/api";

import { formatMarketQuoteValue, formatPercent, formatQueryTime } from "./demo-data";
import { fetchMarketSnapshot } from "./mock-api";
import { useMockRequest } from "./use-mock-request";

export default function DisplayMarkets() {
  const { data: snapshot, isLoading } = useMockRequest(fetchMarketSnapshot, []);
  const queriedAt = snapshot ? formatQueryTime(snapshot.queriedAt) : "";

  return (
    <List isLoading={isLoading} navigationTitle="Markets Status">
      {snapshot?.sections.map((section) => (
        <List.Section key={section.title} title={section.title}>
          {section.items.map((quote) => (
            <List.Item
              key={quote.symbol}
              title={quote.name}
              subtitle={quote.symbol}
              accessories={[
                { text: formatMarketQuoteValue(quote), tooltip: "查询值" },
                { text: formatPercent(quote.changePercent), tooltip: "当日涨跌幅" },
                { text: queriedAt, tooltip: "最新查询时间" },
              ]}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
