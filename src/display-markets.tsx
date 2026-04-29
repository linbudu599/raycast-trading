import { Action, ActionPanel, Detail, List } from "@raycast/api";
import { useCallback } from "react";

import { formatMarketDetailMarkdown, formatMarketQuoteValue, formatPercent, formatQueryTime } from "./demo-data";
import { fetchMarketQuoteDetail, fetchMarketSnapshot } from "./mock-api";
import { useMockRequest } from "./use-mock-request";

interface MarketDetailProps {
  symbol: string;
}

function MarketDetail({ symbol }: MarketDetailProps) {
  const requestDetail = useCallback(() => fetchMarketQuoteDetail(symbol), [symbol]);
  const { data: detail, error, isLoading } = useMockRequest(requestDetail, [requestDetail]);

  const markdown = (() => {
    if (error) {
      return `# Failed to load market detail\n\n${error.message}`;
    }

    if (detail) {
      return formatMarketDetailMarkdown(detail);
    }

    return isLoading ? "Loading market detail..." : `# Market detail not found\n\nNo mock detail found for ${symbol}.`;
  })();

  return <Detail isLoading={isLoading} markdown={markdown} navigationTitle={detail?.quote.name ?? symbol} />;
}

export default function DisplayMarkets() {
  const { data: snapshot, error, isLoading } = useMockRequest(fetchMarketSnapshot, []);
  const queriedAt = snapshot ? formatQueryTime(snapshot.queriedAt) : "";

  return (
    <List isLoading={isLoading} navigationTitle="Markets Status">
      {error ? <List.EmptyView title="Failed to load markets" description={error.message} /> : null}
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
