import { Action, ActionPanel, Detail, getPreferenceValues, Icon, List } from "@raycast/api";
import { useCallback } from "react";

import {
  formatMarketDetailMarkdown,
  formatMarketQuoteValue,
  formatPercent,
  formatQueryTime,
  getChangeColor,
} from "./lib/formatters";
import type { ChangeColorStyle } from "./lib/formatters";
import { getLanguage, t, translateMarketCategory, translateMarketName, translateSession } from "./lib/i18n";
import { fetchMarketQuoteDetail, fetchMarketSnapshot } from "./lib/longbridge-api";
import type { MarketQuoteSection, TradingSession } from "./lib/market-types";
import { useAsyncRequest } from "./lib/use-async-request";

interface MarketDetailProps {
  symbol: string;
}

interface DisplayMarketsPreferences {
  changeColorStyle: ChangeColorStyle;
  showTradingOnly: boolean;
}

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
  const language = getLanguage();
  const requestDetail = useCallback(() => fetchMarketQuoteDetail(symbol), [symbol]);
  const { data: detail, error, isLoading } = useAsyncRequest(requestDetail, [requestDetail]);

  const markdown = (() => {
    if (error) {
      return `# ${t("failedToLoadMarketDetail", language)}\n\n${error.message}`;
    }

    if (detail) {
      return formatMarketDetailMarkdown(detail, language);
    }

    return isLoading
      ? `${t("loadMarketsTitle", language)}...`
      : `# ${t("marketDetailNotFound", language)}\n\n${t("marketDetailNotFoundDescription", language)} ${symbol}.`;
  })();

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      navigationTitle={detail ? translateMarketName(detail.quote.symbol, detail.quote.name, language) : symbol}
    />
  );
}

export default function DisplayMarkets() {
  const language = getLanguage();
  const preferences = getPreferenceValues<DisplayMarketsPreferences>();
  const { data: snapshot, error, isLoading } = useAsyncRequest(fetchMarketSnapshot, []);
  const queriedAt = snapshot ? formatQueryTime(snapshot.queriedAt) : "";
  const sections =
    snapshot?.sections
      .filter((section) => !preferences.showTradingOnly || !section.session || isTradingSession(section.session))
      .sort((section, nextSection) => getSectionPriority(section) - getSectionPriority(nextSection)) ?? [];

  return (
    <List isLoading={isLoading} navigationTitle={t("marketStatus", language)}>
      {error ? (
        <List.EmptyView
          title={t("failedToLoadMarkets", language)}
          description={error.message}
          icon={Icon.ExclamationMark}
        />
      ) : null}
      {isLoading && sections.length === 0 ? (
        <List.EmptyView
          title={t("loadMarketsTitle", language)}
          description={t("loadMarketsDescription", language)}
          icon={Icon.Clock}
        />
      ) : null}
      {queriedAt ? (
        <List.Section title={t("queryTime", language)}>
          <List.Item
            title={queriedAt}
            accessories={isLoading ? [{ icon: Icon.Clock, tooltip: t("loadMarketsTitle", language) }] : undefined}
          />
        </List.Section>
      ) : null}
      {sections.map((section) => (
        <List.Section
          key={section.title}
          title={translateMarketCategory(section.category, language)}
          subtitle={translateSession(getSectionSubtitle(section), language)}
        >
          {section.items.map((quote) => {
            return (
              <List.Item
                key={quote.symbol}
                title={translateMarketName(quote.symbol, quote.name, language)}
                subtitle={quote.symbol}
                keywords={[quote.symbol, quote.name, quote.category]}
                accessories={[
                  { text: formatMarketQuoteValue(quote), tooltip: t("priceTooltip", language) },
                  ...(isLoading ? [{ icon: Icon.Clock, tooltip: t("loadMarketsTitle", language) }] : []),
                  {
                    tag: {
                      color: getChangeColor(quote.changePercent, preferences.changeColorStyle),
                      value: formatPercent(quote.changePercent),
                    },
                    tooltip: t("changePercentTooltip", language),
                  },
                ]}
                actions={
                  <ActionPanel>
                    <Action.Push
                      title={t("watchlistDetail", language)}
                      target={<MarketDetail symbol={quote.symbol} />}
                    />
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
