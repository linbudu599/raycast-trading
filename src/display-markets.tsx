import { List } from "@raycast/api";

import { formatCurrency, formatPercent, formatTrend, MARKET_SNAPSHOTS } from "./demo-data";

export default function DisplayMarkets() {
  return (
    <List navigationTitle="Markets Status">
      {MARKET_SNAPSHOTS.map((market) => (
        <List.Item
          key={market.symbol}
          title={market.symbol}
          subtitle={market.name}
          accessories={[
            { text: formatCurrency(market.price) },
            { text: formatPercent(market.changePercent) },
            { text: `${market.status} / ${formatTrend(market.trend)}` },
          ]}
        />
      ))}
    </List>
  );
}
