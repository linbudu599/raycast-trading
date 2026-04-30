import { List } from "@raycast/api";

import {
  calculateFundDailyEarningsPerTenThousand,
  formatDailyEarnings,
  formatFundNav,
  formatPercent,
  formatQueryTime,
} from "./lib/demo-data";
import { getLanguage, t } from "./lib/i18n";
import { fetchWatchFunds } from "./lib/mock-api";
import { useMockRequest } from "./lib/use-mock-request";

export default function DisplayWatchFunds() {
  const language = getLanguage();
  const snapshot = useMockRequest(fetchWatchFunds);
  const queriedAt = snapshot.data ? formatQueryTime(snapshot.data.queriedAt) : "";

  return (
    <List isLoading={snapshot.isLoading} isShowingDetail navigationTitle={t("watchFunds", language)}>
      {snapshot.data?.items.map((fund) => {
        const dailyIncome = formatDailyEarnings(calculateFundDailyEarningsPerTenThousand(fund.dailyChangePercent));

        return (
          <List.Item
            key={fund.code}
            title={fund.name}
            subtitle={fund.code}
            accessories={[
              { text: formatFundNav(fund.nav), tooltip: t("latestNav", language) },
              { text: dailyIncome, tooltip: t("valuePerTenThousand", language) },
              { text: formatPercent(fund.dailyChangePercent), tooltip: t("changePercentTooltip", language) },
            ]}
            detail={
              <List.Item.Detail
                markdown={[
                  `# ${fund.name}`,
                  "",
                  `- ${t("fundCode", language)}: ${fund.code}`,
                  `- ${t("latestNav", language)}: ${formatFundNav(fund.nav)}`,
                  `- ${t("changePercentTooltip", language)}: ${formatPercent(fund.dailyChangePercent)}`,
                  `- ${t("valuePerTenThousand", language)}: \`${dailyIncome}\``,
                  `- ${t("latestQueryTime", language)}: ${queriedAt}`,
                  `- ${t("riskLevel", language)}: ${fund.riskLevel}`,
                ].join("\n")}
              />
            }
          />
        );
      })}
      {snapshot.error ? (
        <List.EmptyView title={t("failedToLoadWatchedFunds", language)} description={snapshot.error.message} />
      ) : null}
    </List>
  );
}
