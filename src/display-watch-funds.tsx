import { List } from "@raycast/api";

import {
  calculateFundDailyEarningsPerTenThousand,
  formatDailyEarnings,
  formatFundNav,
  formatPercent,
  formatQueryTime,
} from "./lib/demo-data";
import { fetchWatchFunds } from "./lib/mock-api";
import { useMockRequest } from "./lib/use-mock-request";

export default function DisplayWatchFunds() {
  const snapshot = useMockRequest(fetchWatchFunds);
  const queriedAt = snapshot.data ? formatQueryTime(snapshot.data.queriedAt) : "";

  return (
    <List isLoading={snapshot.isLoading} isShowingDetail navigationTitle="Watch Funds">
      {snapshot.data?.items.map((fund) => {
        const dailyIncome = formatDailyEarnings(calculateFundDailyEarningsPerTenThousand(fund.dailyChangePercent));

        return (
          <List.Item
            key={fund.code}
            title={fund.name}
            subtitle={fund.code}
            accessories={[
              { text: formatFundNav(fund.nav), tooltip: "当日净值" },
              { text: dailyIncome, tooltip: "每万元当日收益" },
              { text: formatPercent(fund.dailyChangePercent), tooltip: "当日涨跌幅" },
            ]}
            detail={
              <List.Item.Detail
                markdown={[
                  `# ${fund.name}`,
                  "",
                  `- 基金代码：${fund.code}`,
                  `- 当日净值：${formatFundNav(fund.nav)}`,
                  `- 当日涨跌幅：${formatPercent(fund.dailyChangePercent)}`,
                  `- 每万元当日收益：\`${dailyIncome}\``,
                  `- 最新查询时间：${queriedAt}`,
                  `- 风险等级：${fund.riskLevel}`,
                ].join("\n")}
              />
            }
          />
        );
      })}
      {snapshot.error ? (
        <List.EmptyView title="Failed to load watched funds" description={snapshot.error.message} />
      ) : null}
    </List>
  );
}
