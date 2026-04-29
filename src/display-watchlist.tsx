import { List } from "@raycast/api";

import { formatPercent, formatUsd } from "./demo-data";
import { WATCHLIST_ITEMS } from "./mock-api";

export default function DisplayWatchList() {
  return (
    <List navigationTitle="Watch List">
      {WATCHLIST_ITEMS.map((item) => (
        <List.Item
          key={item.symbol}
          title={item.symbol}
          subtitle={item.name}
          accessories={[
            { text: formatUsd(item.price) },
            { text: formatPercent(item.changePercent), tooltip: item.note },
          ]}
        />
      ))}
    </List>
  );
}
