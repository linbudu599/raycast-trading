import { Action, ActionPanel, Color, Detail, getPreferenceValues, Icon, List } from "@raycast/api";
import { useCallback } from "react";

import { formatMarketDetailMarkdown, formatMarketQuoteValue, formatPercent, formatQueryTime } from "./lib/demo-data";
import { fetchMarketQuoteDetail, fetchMarketSnapshot } from "./lib/longbridge-api";
import type { MarketQuoteSection, TradingSession } from "./lib/mock-api";
import { useMockRequest } from "./lib/use-mock-request";

type ChangeColorStyle = "green-up-red-down" | "red-up-green-down";

interface MarketDetailProps {
  symbol: string;
}

interface DisplayMarketsPreferences {
  changeColorStyle: ChangeColorStyle;
  showTradingOnly: boolean;
}

const getChangeColor = (value: number, style: ChangeColorStyle) => {
  if (value > 0) {
    return style === "green-up-red-down" ? Color.Green : Color.Red;
  }

  if (value < 0) {
    return style === "green-up-red-down" ? Color.Red : Color.Green;
  }

  return Color.SecondaryText;
};

const isTradingSession = (session: TradingSession | undefined) =>
  session === "盘前" || session === "盘中" || session === "盘后" || session === "全天交易";

const getSectionPriority = (section: MarketQuoteSection) => {
  if (section.session && isTradingSession(section.session)) {
    return 0;
  }

  if (section.category === "Crypto") {
    return 1;
  }

  if (section.category === "Commodities") {
    return 2;
  }

  return 3;
};

const getSectionSubtitle = (section: MarketQuoteSection) => {
  return section.session;
};

function MarketDetail({ symbol }: MarketDetailProps) {
  const requestDetail = useCallback(() => fetchMarketQuoteDetail(symbol), [symbol]);
  const { data: detail, error, isLoading } = useMockRequest(requestDetail, [requestDetail]);

  const markdown = (() => {
    if (error) {
      return `# Failed to load market detail\n\n${error.message}`;
    }

    if (detail) {
      return formatMarketDetailMarkdown(detail);
    }

    return isLoading
      ? "Loading market detail..."
      : `# Market detail not found\n\nNo Longbridge quote found for ${symbol}.`;
  })();

  return <Detail isLoading={isLoading} markdown={markdown} navigationTitle={detail?.quote.name ?? symbol} />;
}

export default function DisplayMarkets() {
  const preferences = getPreferenceValues<DisplayMarketsPreferences>();
  const { data: snapshot, error, isLoading } = useMockRequest(fetchMarketSnapshot, []);
  const queriedAt = snapshot ? formatQueryTime(snapshot.queriedAt) : "";
  const sections =
    snapshot?.sections
      .filter((section) => !preferences.showTradingOnly || !section.session || isTradingSession(section.session))
      .sort((section, nextSection) => getSectionPriority(section) - getSectionPriority(nextSection)) ?? [];

  return (
    <List isLoading={isLoading} navigationTitle="Markets Status">
      {error ? (
        <List.EmptyView title="Failed to load markets" description={error.message} icon={Icon.ExclamationMark} />
      ) : null}
      {isLoading && sections.length === 0 ? (
        <List.EmptyView
          title="正在查询 Longbridge 行情"
          description="请稍候，正在批量获取市场报价..."
          icon={Icon.Clock}
        />
      ) : null}
      {queriedAt ? (
        <List.Section title="查询时间">
          <List.Item
            title={queriedAt}
            accessories={isLoading ? [{ icon: Icon.Clock, tooltip: "正在刷新行情" }] : undefined}
          />
        </List.Section>
      ) : null}
      {sections.map((section) => (
        <List.Section key={section.title} title={section.title} subtitle={getSectionSubtitle(section)}>
          {section.items.map((quote) => {
            return (
              <List.Item
                key={quote.symbol}
                title={quote.name}
                subtitle={quote.symbol}
                accessories={[
                  { text: formatMarketQuoteValue(quote), tooltip: "查询值" },
                  ...(isLoading ? [{ icon: Icon.Clock, tooltip: "正在刷新行情" }] : []),
                  {
                    tag: {
                      color: getChangeColor(quote.changePercent, preferences.changeColorStyle),
                      value: formatPercent(quote.changePercent),
                    },
                    tooltip: "当日涨跌幅",
                  },
                ]}
                actions={
                  <ActionPanel>
                    <Action.Push title="View Details" target={<MarketDetail symbol={quote.symbol} />} />
                  </ActionPanel>
                }
              />
            );
          })}
        </List.Section>
      ))}
    </List>
  );
}
