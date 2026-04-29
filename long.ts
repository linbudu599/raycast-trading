import { Config, QuoteContext, OAuth } from "longbridge";
import { config } from "dotenv";

config();

const appKey = process.env.LONGBRIDGE_APP_KEY!;
const appSecret = process.env.LONGBRIDGE_APP_SECRET!;
const accessToken = process.env.LONGBRIDGE_ACCESS_TOKEN!;

async function main() {
  const config = Config.fromApikey(appKey, appSecret, accessToken);

  const ctx = QuoteContext.new(config);

  const resp = await ctx.quote(["QQQ.US"]);
  // const resp = await ctx.quote(["NSDX.US", "700.HK", "HSI.HK", "HSTECH.HK"]);

  for (const obj of resp) {
    console.log(obj.toString());
  }
}

(async () => {
  await main();
})();
