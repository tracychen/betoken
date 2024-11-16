import { createPublicClient, http } from "viem";
import { base, baseSepolia } from "viem/chains";

export const chain = baseSepolia;

export const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
});
