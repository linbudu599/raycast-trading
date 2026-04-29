import { List } from "@raycast/api";

import { fetchWatchFunds } from "./mock-api";
import { formatFundNav, formatPercent, formatQueryTime } from "./demo-data";
import { useMockRequest } from "./use-mock-request";

export default function DisplayWatchFunds() {
  const snapshot = useMockRequest(fetchWatchFunds);
  const queriedAt = snapshot.data ? formatQueryTime(snapshot.data.queriedAt) : "";

  return (
    <List isLoading={snapshot.isLoading} navigationTitle="Watch Funds">
      {snapshot.data?.items.map((fund) => (
        <List.Item
          key={fund.code}
          title={fund.name}
          subtitle={fund.code}
          accessories={[
            { text: formatFundNav(fund.nav), tooltip: "当日净值" },
            { text: formatPercent(fund.dailyChangePercent), tooltip: "当日涨跌幅" },
            { text: queriedAt, tooltip: "最新查询时间" },
            { text: fund.riskLevel, tooltip: "风险等级" },
          ]}
        />
      ))}
    </List>
  );
}
