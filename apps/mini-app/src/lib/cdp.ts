import { Coinbase } from "@coinbase/coinbase-sdk";

const coinbase = Coinbase.configure({
  apiKeyName: process.env.CDP_API_KEY_NAME!,
  privateKey: process.env.PRIVATE_KEY!,
});
