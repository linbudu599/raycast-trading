import { List } from "@raycast/api";

import { CONFIGURABLE_SYMBOLS } from "./demo-data";

export default function ConfigureWatchList() {
  return (
    <List navigationTitle="Configure Watch List">
      {CONFIGURABLE_SYMBOLS.map((item) => (
        <List.Item
          key={item.symbol}
          title={item.symbol}
          subtitle={item.name}
          accessories={[{ text: item.isTracked ? "Tracked" : "Available" }]}
        />
      ))}
    </List>
  );
}
