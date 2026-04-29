import { Detail } from "@raycast/api";

import { MARKET_STATUS_MARKDOWN } from "./demo-data";

export default function DisplayMarkets() {
  return <Detail navigationTitle="Markets Status" markdown={MARKET_STATUS_MARKDOWN} />;
}
