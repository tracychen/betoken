import { createPublicClient, http } from "viem";
import { baseSepolia, mantleSepoliaTestnet } from "viem/chains";

export const chain =
  process.env.NEXT_PUBLIC_CHAIN === "mantle"
    ? mantleSepoliaTestnet
    : baseSepolia;

export const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
});

export const explorerEndpoints = {
  [baseSepolia.id]: "https://base-sepolia.blockscout.com",
  [mantleSepoliaTestnet.id]: "https://explorer.sepolia.mantle.xyz",
};
