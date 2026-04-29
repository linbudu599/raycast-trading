import { Action, ActionPanel, List, showToast, Toast } from "@raycast/api";

import { CONFIGURABLE_SYMBOLS } from "./lib/mock-api";

const showDemoConfigurationToast = (symbol: string, isTracked: boolean) =>
  showToast({
    style: Toast.Style.Success,
    title: isTracked ? "Removed from demo watch list" : "Added to demo watch list",
    message: `${symbol} will persist once real storage is connected.`,
  });

export default function ConfigureWatchList() {
  return (
    <List navigationTitle="Configure Watch List">
      {CONFIGURABLE_SYMBOLS.map((item) => (
        <List.Item
          key={item.symbol}
          title={item.symbol}
          subtitle={item.name}
          accessories={[{ text: item.isTracked ? "Tracked" : "Available" }]}
          actions={
            <ActionPanel>
              <Action
                title={item.isTracked ? "Remove from Demo Watch List" : "Add to Demo Watch List"}
                onAction={() => void showDemoConfigurationToast(item.symbol, item.isTracked)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
