import { List } from "@raycast/api";

export default function ConfigureWatchList() {
  return (
    <List navigationTitle="Configure Watch List">
      <List.EmptyView title="No symbols configured. Add symbols to start tracking them." />
    </List>
  );
}
