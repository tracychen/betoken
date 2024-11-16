"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { chain } from "@/lib/chain";
import { OnchainKitProvider } from "@coinbase/onchainkit";

const config = createConfig({
  chains: [chain],
  transports: {
    [chain.id]: http(),
  },
});
const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <OnchainKitProvider
      chain={chain}
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      projectId={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </OnchainKitProvider>
  );
}
