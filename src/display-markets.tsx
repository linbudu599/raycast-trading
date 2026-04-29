import { List } from "@raycast/api";

import { formatMarketQuoteValue, formatPercent, formatQueryTime, MARKET_QUOTE_SECTIONS } from "./demo-data";

export default function DisplayMarkets() {
  const queriedAt = formatQueryTime(new Date());

  return (
    <List navigationTitle="Markets Status">
      {MARKET_QUOTE_SECTIONS.map((section) => (
        <List.Section key={section.title} title={section.title}>
          {section.items.map((quote) => (
            <List.Item
              key={quote.symbol}
              title={quote.name}
              subtitle={quote.symbol}
              accessories={[
                { text: formatMarketQuoteValue(quote), tooltip: "查询值" },
                { text: formatPercent(quote.changePercent), tooltip: "当日涨跌幅" },
                { text: queriedAt },
              ]}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
