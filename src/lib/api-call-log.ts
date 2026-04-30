import { LocalStorage } from "@raycast/api";

export type ApiCallStatus = "success" | "failure";

export interface ApiCallLogEntry {
  args: readonly string[];
  command: string;
  durationMs: number;
  errorMessage: string | undefined;
  id: string;
  startedAt: string;
  status: ApiCallStatus;
  stderr: string | undefined;
  stdout: string | undefined;
  stdoutBytes: number;
  stdoutTruncated: boolean | undefined;
}

interface ApiCallLogInput {
  args: readonly string[];
  command: string;
  durationMs: number;
  errorMessage?: string;
  startedAt: Date;
  status: ApiCallStatus;
  stderr?: string;
  stdout: string;
  stdoutBytes: number;
}

const API_CALL_LOG_STORAGE_KEY = "longbridge.api-call-log.v1";
const MAX_API_CALL_LOGS = 200;
const MAX_ERROR_TEXT_LENGTH = 1_000;
const MAX_STDOUT_TEXT_LENGTH = 50_000;

let writeQueue = Promise.resolve();

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object";

const truncateText = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  return value.length > MAX_ERROR_TEXT_LENGTH ? `${value.slice(0, MAX_ERROR_TEXT_LENGTH)}...` : value;
};

const truncateStdout = (value: string) => {
  if (value.length <= MAX_STDOUT_TEXT_LENGTH) {
    return { stdout: value, stdoutTruncated: false };
  }

  return { stdout: value.slice(0, MAX_STDOUT_TEXT_LENGTH), stdoutTruncated: true };
};

const isApiCallStatus = (value: unknown): value is ApiCallStatus => value === "success" || value === "failure";

const isApiCallLogEntry = (value: unknown): value is ApiCallLogEntry => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value.args) &&
    value.args.every((arg) => typeof arg === "string") &&
    typeof value.command === "string" &&
    typeof value.durationMs === "number" &&
    (value.errorMessage === undefined || typeof value.errorMessage === "string") &&
    typeof value.id === "string" &&
    typeof value.startedAt === "string" &&
    isApiCallStatus(value.status) &&
    (value.stderr === undefined || typeof value.stderr === "string") &&
    (value.stdout === undefined || typeof value.stdout === "string") &&
    typeof value.stdoutBytes === "number" &&
    (value.stdoutTruncated === undefined || typeof value.stdoutTruncated === "boolean")
  );
};

const parseApiCallLogs = (value: string | undefined): readonly ApiCallLogEntry[] => {
  if (!value) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    return [];
  }

  return Array.isArray(parsed) ? parsed.filter(isApiCallLogEntry) : [];
};

export const getApiCallLogs = async (): Promise<readonly ApiCallLogEntry[]> => {
  const storedValue = await LocalStorage.getItem<string>(API_CALL_LOG_STORAGE_KEY);
  return parseApiCallLogs(storedValue);
};

export const clearApiCallLogs = () => LocalStorage.removeItem(API_CALL_LOG_STORAGE_KEY);

export const recordApiCall = (input: ApiCallLogInput) => {
  const { stdout, stdoutTruncated } = truncateStdout(input.stdout);
  const entry: ApiCallLogEntry = {
    args: [...input.args],
    command: input.command,
    durationMs: input.durationMs,
    errorMessage: truncateText(input.errorMessage),
    id: `${input.startedAt.getTime()}-${Math.random().toString(36).slice(2)}`,
    startedAt: input.startedAt.toISOString(),
    status: input.status,
    stderr: truncateText(input.stderr),
    stdout,
    stdoutBytes: input.stdoutBytes,
    stdoutTruncated,
  };

  writeQueue = writeQueue
    .then(async () => {
      const logs = await getApiCallLogs();
      await LocalStorage.setItem(
        API_CALL_LOG_STORAGE_KEY,
        JSON.stringify([entry, ...logs].slice(0, MAX_API_CALL_LOGS)),
      );
    })
    .catch(() => undefined);

  return writeQueue;
};
