import { List } from "@raycast/api";

export default function DisplayWatchList() {
  return (
    <List navigationTitle="Watch List">
      <List.EmptyView title="No items in your watch list yet." />
    </List>
  );
}
