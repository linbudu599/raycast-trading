import { Action, ActionPanel, Detail, List } from "@raycast/api";

import { formatMarketDetailMarkdown, formatMarketQuoteValue, formatPercent, formatQueryTime } from "./demo-data";
import { fetchMarketQuoteDetail, fetchMarketSnapshot } from "./mock-api";
import { useMockRequest } from "./use-mock-request";

interface MarketDetailProps {
  symbol: string;
}

function MarketDetail({ symbol }: MarketDetailProps) {
  const { data: detail, isLoading } = useMockRequest(() => fetchMarketQuoteDetail(symbol), [symbol]);

  return (
    <Detail
      isLoading={isLoading}
      markdown={detail ? formatMarketDetailMarkdown(detail) : "Loading market detail..."}
      navigationTitle={detail?.quote.name ?? symbol}
    />
  );
}

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
              actions={
                <ActionPanel>
                  <Action.Push title="View Details" target={<MarketDetail symbol={quote.symbol} />} />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
