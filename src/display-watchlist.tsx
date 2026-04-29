import { List } from "@raycast/api";

import { formatCurrency, formatPercent, WATCHLIST_ITEMS } from "./demo-data";

export default function DisplayWatchList() {
  return (
    <List navigationTitle="Watch List">
      {WATCHLIST_ITEMS.map((item) => (
        <List.Item
          key={item.symbol}
          title={item.symbol}
          subtitle={item.name}
          accessories={[
            { text: formatCurrency(item.price) },
            { text: formatPercent(item.changePercent), tooltip: item.note },
          ]}
        />
      ))}
    </List>
  );
}
