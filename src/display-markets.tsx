import { Detail } from "@raycast/api";

export default function DisplayMarkets() {
  return (
    <Detail
      navigationTitle="Markets Status"
      markdown={`# Markets Status\n\nMarkets data will appear here.`}
    />
  );
}
