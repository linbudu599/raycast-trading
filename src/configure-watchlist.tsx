import { Action, ActionPanel, Form, Icon, Keyboard, List, popToRoot, showToast, Toast } from "@raycast/api";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getLanguage, t, translateWatchlistCategory } from "./lib/i18n";
import {
  buildValidatedWatchlistItem,
  getWatchlistDisplayName,
  getWatchlistItems,
  normalizeWatchlistSymbol,
  saveWatchlistItems,
  WATCHLIST_CATEGORY_ORDER,
} from "./lib/watchlist";
import type { WatchlistCategory, WatchlistItem } from "./lib/watchlist";

interface AddWatchlistFormValues {
  symbol: string;
  name: string;
}

interface AddWatchlistFormProps {
  existingSymbols: readonly string[];
  onAdd: (item: WatchlistItem) => Promise<void>;
}

const buildSections = (items: readonly WatchlistItem[]) =>
  WATCHLIST_CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((section) => section.items.length > 0);

const replaceItems = async (
  nextItems: readonly WatchlistItem[],
  setItems: (items: readonly WatchlistItem[]) => void,
) => {
  await saveWatchlistItems(nextItems);
  setItems(nextItems);
};

const moveItemWithinCategory = (
  items: readonly WatchlistItem[],
  symbol: string,
  direction: "up" | "down",
): readonly WatchlistItem[] => {
  const item = items.find((candidate) => candidate.symbol === symbol);

  if (!item) {
    return items;
  }

  const categoryItems = items.filter((candidate) => candidate.category === item.category);
  const categoryIndex = categoryItems.findIndex((candidate) => candidate.symbol === symbol);
  const swapWithCategoryIndex = direction === "up" ? categoryIndex - 1 : categoryIndex + 1;
  const swapWith = categoryItems[swapWithCategoryIndex];

  if (!swapWith) {
    return items;
  }

  const symbolIndex = items.findIndex((candidate) => candidate.symbol === symbol);
  const swapWithIndex = items.findIndex((candidate) => candidate.symbol === swapWith.symbol);
  const nextItems = [...items];
  nextItems[symbolIndex] = swapWith;
  nextItems[swapWithIndex] = item;

  return nextItems;
};

function AddWatchlistForm({ existingSymbols, onAdd }: AddWatchlistFormProps) {
  const language = getLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const existingSymbolSet = useMemo(() => new Set(existingSymbols), [existingSymbols]);

  const handleSubmit = async (values: AddWatchlistFormValues) => {
    const symbol = normalizeWatchlistSymbol(values.symbol);

    if (!symbol) {
      await showToast({
        style: Toast.Style.Failure,
        title: t("symbolNotFound", language),
        message: t("enterAnotherSymbol", language),
      });
      return;
    }

    if (existingSymbolSet.has(symbol)) {
      await showToast({
        style: Toast.Style.Failure,
        title: t("duplicateSymbol", language),
        message: t("duplicateSymbolMessage", language),
      });
      return;
    }

    setIsLoading(true);

    try {
      const item = await buildValidatedWatchlistItem(symbol, language, values.name);

      if (!item) {
        await showToast({
          style: Toast.Style.Failure,
          title: t("symbolNotFound", language),
          message: t("symbolNotFoundMessage", language),
        });
        return;
      }

      await onAdd(item);
      await showToast({
        style: Toast.Style.Success,
        title: t("updatedWatchlist", language),
        message: item.symbol,
      });
      await popToRoot();
    } catch (error: unknown) {
      await showToast({
        style: Toast.Style.Failure,
        title: t("failedToAddSymbol", language),
        message: error instanceof Error ? error.message : t("enterAnotherSymbol", language),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      isLoading={isLoading}
      navigationTitle={t("addSymbol", language)}
      actions={
        <ActionPanel>
          <Action.SubmitForm title={t("addToWatchlist", language)} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="symbol"
        title={t("stockSymbol", language)}
        placeholder={t("symbolPlaceholder", language)}
        info={t("symbolHelp", language)}
      />
      <Form.TextField
        id="name"
        title={`${t("name", language)} (${t("optional", language)})`}
        placeholder={t("namePlaceholder", language)}
      />
    </Form>
  );
}

export default function ConfigureWatchList() {
  const language = getLanguage();
  const [items, setItems] = useState<readonly WatchlistItem[]>([]);
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(true);
  const sections = buildSections(items);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    void getWatchlistItems(language)
      .then((watchlistItems) => {
        if (isActive) {
          setItems(watchlistItems);
          setError(undefined);
        }
      })
      .catch((caughtError: unknown) => {
        if (isActive) {
          setError(caughtError instanceof Error ? caughtError : new Error("Failed to load watch list"));
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [language]);

  const addItem = useCallback(
    async (item: WatchlistItem) => {
      await replaceItems([...items, item], setItems);
    },
    [items],
  );

  const removeItem = useCallback(
    async (symbol: string) => {
      await replaceItems(
        items.filter((item) => item.symbol !== symbol),
        setItems,
      );
      await showToast({ style: Toast.Style.Success, title: t("removedFromWatchlist", language), message: symbol });
    },
    [items, language],
  );

  const moveItem = useCallback(
    async (symbol: string, direction: "up" | "down") => {
      const nextItems = moveItemWithinCategory(items, symbol, direction);

      if (nextItems === items) {
        return;
      }

      await replaceItems(nextItems, setItems);
    },
    [items],
  );

  const renderActions = (item?: WatchlistItem) => (
    <ActionPanel>
      <Action.Push
        title={t("addSymbol", language)}
        target={<AddWatchlistForm existingSymbols={items.map((candidate) => candidate.symbol)} onAdd={addItem} />}
        icon={Icon.Plus}
      />
      {item ? (
        <ActionPanel.Section>
          <Action
            title={t("moveUp", language)}
            shortcut={Keyboard.Shortcut.Common.MoveUp}
            icon={Icon.ArrowUp}
            onAction={() => void moveItem(item.symbol, "up")}
          />
          <Action
            title={t("moveDown", language)}
            shortcut={Keyboard.Shortcut.Common.MoveDown}
            icon={Icon.ArrowDown}
            onAction={() => void moveItem(item.symbol, "down")}
          />
          <Action
            title={t("removeFromWatchlist", language)}
            style={Action.Style.Destructive}
            icon={Icon.Trash}
            onAction={() => void removeItem(item.symbol)}
          />
          <Action.CopyToClipboard title={t("copySymbol", language)} content={item.symbol} />
        </ActionPanel.Section>
      ) : null}
    </ActionPanel>
  );

  return (
    <List isLoading={isLoading} navigationTitle={t("configureWatchlist", language)} actions={renderActions()}>
      {error ? (
        <List.EmptyView
          title={t("failedToLoadWatchlist", language)}
          description={error.message}
          icon={Icon.ExclamationMark}
        />
      ) : null}
      {!isLoading && !error && sections.length === 0 ? (
        <List.EmptyView
          title={t("noWatchlistItems", language)}
          description={t("noWatchlistItemsDescription", language)}
          icon={Icon.Star}
          actions={renderActions()}
        />
      ) : null}
      {sections.map((section: { category: WatchlistCategory; items: readonly WatchlistItem[] }) => (
        <List.Section key={section.category} title={translateWatchlistCategory(section.category, language)}>
          {section.items.map((item) => (
            <List.Item
              key={item.symbol}
              title={getWatchlistDisplayName(item, language)}
              subtitle={item.symbol}
              accessories={[{ text: t("tracked", language) }]}
              actions={renderActions(item)}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
