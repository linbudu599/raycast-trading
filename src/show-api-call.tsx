import { Action, ActionPanel, Color, Icon, List, showToast, Toast } from "@raycast/api";
import { useCallback, useState } from "react";

import { clearApiCallLogs, getApiCallLogs } from "./lib/api-call-log";
import type { ApiCallLogEntry } from "./lib/api-call-log";
import { formatJsonOutput } from "./lib/formatters";
import { getLanguage, t } from "./lib/i18n";
import { useAsyncRequest } from "./lib/use-async-request";

const dateTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  year: "numeric",
});

const formatRequestTime = (value: string) => dateTimeFormatter.format(new Date(value));

const formatDuration = (durationMs: number) => `${durationMs} ms`;

const formatCommand = (entry: ApiCallLogEntry) => [entry.command, ...entry.args].join(" ");

const formatListTitle = (entry: ApiCallLogEntry) => entry.args[0] ?? entry.command;

const formatListSubtitle = (entry: ApiCallLogEntry) =>
  entry.args
    .slice(1)
    .filter((arg) => arg !== "--format" && arg !== "json")
    .join(" ");

const formatBytes = (value: number) => `${value} B`;

const getStatusText = (entry: ApiCallLogEntry, language: ReturnType<typeof getLanguage>) =>
  entry.status === "success" ? t("apiCallStatusSuccess", language) : t("apiCallStatusFailure", language);

const getStatusColor = (entry: ApiCallLogEntry) => (entry.status === "success" ? Color.Green : Color.Red);

const formatApiCallMarkdown = (entry: ApiCallLogEntry, language: ReturnType<typeof getLanguage>) => {
  const responseBody = formatJsonOutput(entry.stdout);

  return [
    `# ${getStatusText(entry, language)} · ${entry.command}`,
    "",
    `- ${t("requestTime", language)}: ${formatRequestTime(entry.startedAt)}`,
    `- ${t("duration", language)}: ${formatDuration(entry.durationMs)}`,
    `- ${t("stdoutBytes", language)}: ${formatBytes(entry.stdoutBytes)}`,
    "",
    `## ${t("command", language)}`,
    "```shell",
    formatCommand(entry),
    "```",
    "",
    `## ${t("responseJson", language)}`,
    ...(responseBody
      ? [
          ...(entry.stdoutTruncated ? [`> ${t("responseTruncated", language)}`, ""] : []),
          "```json",
          responseBody,
          "```",
        ]
      : [t("noResponseJson", language)]),
    ...(entry.stderr || entry.errorMessage
      ? ["", `## ${t("stderr", language)}`, "```text", entry.stderr ?? entry.errorMessage ?? "", "```"]
      : []),
  ].join("\n");
};

export default function ShowApiCall() {
  const language = getLanguage();
  const [revision, setRevision] = useState(0);
  const requestLogs = useCallback(() => getApiCallLogs(), [revision]);
  const { data: logs = [], error, isLoading } = useAsyncRequest(requestLogs, [requestLogs]);

  const handleClearLogs = async () => {
    await clearApiCallLogs();
    setRevision((current) => current + 1);
    await showToast({ style: Toast.Style.Success, title: t("apiCallLogsCleared", language) });
  };

  return (
    <List isLoading={isLoading} isShowingDetail navigationTitle={t("showApiCall", language)}>
      {error ? <List.EmptyView title={t("failedToLoadApiCallLogs", language)} description={error.message} /> : null}
      {!error && logs.length === 0 && !isLoading ? (
        <List.EmptyView
          title={t("noApiCallLogs", language)}
          description={t("noApiCallLogsDescription", language)}
          icon={Icon.Clock}
        />
      ) : null}
      <List.Section title={t("showApiCall", language)}>
        {logs.map((entry) => (
          <List.Item
            key={entry.id}
            title={formatListTitle(entry)}
            subtitle={formatListSubtitle(entry) || formatRequestTime(entry.startedAt)}
            keywords={[entry.command, ...entry.args, entry.status]}
            accessories={[
              { text: formatRequestTime(entry.startedAt), tooltip: t("requestTime", language) },
              { text: formatDuration(entry.durationMs), tooltip: t("duration", language) },
              {
                tag: {
                  color: getStatusColor(entry),
                  value: getStatusText(entry, language),
                },
              },
            ]}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard title={t("copyCommand", language)} content={formatCommand(entry)} />
                {entry.stdout ? (
                  <Action.CopyToClipboard
                    title={t("copyResponseJson", language)}
                    content={formatJsonOutput(entry.stdout) ?? entry.stdout}
                  />
                ) : null}
                <Action
                  title={t("clearApiCallLogs", language)}
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  onAction={handleClearLogs}
                />
              </ActionPanel>
            }
            detail={<List.Item.Detail markdown={formatApiCallMarkdown(entry, language)} />}
          />
        ))}
      </List.Section>
    </List>
  );
}
