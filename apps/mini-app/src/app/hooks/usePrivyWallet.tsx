"use client";
import { getEmbeddedConnectedWallet, useWallets } from "@privy-io/react-auth";

export function usePrivyWallet() {
  const { ready, wallets } = useWallets();
  const embeddedWallet = getEmbeddedConnectedWallet(wallets);

  return {
    loading: !ready,
    privyWallet: embeddedWallet,
  };
}
