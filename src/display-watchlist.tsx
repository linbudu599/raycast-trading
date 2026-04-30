import { Action, ActionPanel, Color, Detail, Icon, List } from "@raycast/api";
import { useCallback } from "react";

import { formatMarketQuoteValue, formatPercent, formatQueryTime } from "./lib/demo-data";
import { getLanguage, t, translateSession, translateWatchlistCategory } from "./lib/i18n";
import { useMockRequest } from "./lib/use-mock-request";
import { fetchWatchlistSnapshot, getWatchlistDisplayName } from "./lib/watchlist";
import type { WatchlistQuote } from "./lib/watchlist";

const getChangeColor = (value: number) => {
  if (value > 0) {
    return Color.Green;
  }

  if (value < 0) {
    return Color.Red;
  }

  return Color.SecondaryText;
};

const formatWatchlistDetailMarkdown = (quote: WatchlistQuote, language: ReturnType<typeof getLanguage>) =>
  [
    `# ${getWatchlistDisplayName(quote, language)}`,
    "",
    `- ${t("stockSymbol", language)}: ${quote.symbol}`,
    `- ${t("latestPrice", language)}: ${formatMarketQuoteValue(quote)}`,
    `- ${t("changePercentTooltip", language)}: ${formatPercent(quote.changePercent)}`,
    `- ${t("currentStatus", language)}: ${translateSession(quote.session, language)}`,
    `- ${t("latestQueryTime", language)}: ${formatQueryTime(quote.queriedAt)}`,
    ...(quote.extendedSession
      ? [
          "",
          `## ${t("usExtendedSession", language)}`,
          `- ${translateSession(quote.extendedSession.session, language)}: ${formatMarketQuoteValue({
            unit: quote.unit,
            value: quote.extendedSession.value,
          })} / ${formatPercent(quote.extendedSession.changePercent)}`,
        ]
      : []),
  ].join("\n");

interface WatchlistDetailProps {
  quote: WatchlistQuote;
}

function WatchlistDetail({ quote }: WatchlistDetailProps) {
  const language = getLanguage();

  return (
    <Detail
      markdown={formatWatchlistDetailMarkdown(quote, language)}
      navigationTitle={getWatchlistDisplayName(quote, language)}
    />
  );
}

export default function DisplayWatchList() {
  const language = getLanguage();
  const requestSnapshot = useCallback(() => fetchWatchlistSnapshot(language), [language]);
  const { data: snapshot, error, isLoading } = useMockRequest(requestSnapshot, [requestSnapshot]);
  const queriedAt = snapshot ? formatQueryTime(snapshot.queriedAt) : "";
  const sections = snapshot?.sections ?? [];

  return (
    <List isLoading={isLoading} navigationTitle={t("displayWatchlist", language)}>
      {error ? (
        <List.EmptyView
          title={t("failedToLoadWatchlist", language)}
          description={error.message}
          icon={Icon.ExclamationMark}
        />
      ) : null}
      {isLoading && sections.length === 0 ? (
        <List.EmptyView
          title={t("loadWatchlistTitle", language)}
          description={t("loadWatchlistDescription", language)}
          icon={Icon.Clock}
        />
      ) : null}
      {!isLoading && !error && sections.length === 0 ? (
        <List.EmptyView
          title={t("noWatchlistItems", language)}
          description={t("noWatchlistItemsDescription", language)}
          icon={Icon.Star}
        />
      ) : null}
      {queriedAt ? (
        <List.Section title={t("queryTime", language)}>
          <List.Item title={queriedAt} />
        </List.Section>
      ) : null}
      {sections.map((section) => (
        <List.Section key={section.category} title={translateWatchlistCategory(section.category, language)}>
          {section.items.map((quote) => (
            <List.Item
              key={quote.symbol}
              title={getWatchlistDisplayName(quote, language)}
              subtitle={quote.symbol}
              accessories={[
                { text: formatMarketQuoteValue(quote), tooltip: t("priceTooltip", language) },
                {
                  tag: {
                    color: getChangeColor(quote.changePercent),
                    value: formatPercent(quote.changePercent),
                  },
                  tooltip: t("changePercentTooltip", language),
                },
                { text: translateSession(quote.session, language), tooltip: t("currentStatus", language) },
              ]}
              actions={
                <ActionPanel>
                  <Action.Push title={t("watchlistDetail", language)} target={<WatchlistDetail quote={quote} />} />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ))}
      {snapshot && snapshot.missingSymbols.length > 0 ? (
        <List.Section title={t("missingSymbols", language)}>
          {snapshot.missingSymbols.map((symbol) => (
            <List.Item key={symbol} title={symbol} icon={Icon.ExclamationMark} />
          ))}
        </List.Section>
      ) : null}
    </List>
  );
}
