"use client";
import { useWallets } from "@privy-io/react-auth";
import { useMemo, useState } from "react";

export function usePrivyWallet() {
  const { ready, wallets } = useWallets();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const privyWallet = useMemo(() => {
    if (ready) {
      const wallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );
      if (!wallet) {
        setLoading(false);
        setError("No Privy wallet found");
      }
      setLoading(false);
      return wallet;
    } else {
      setLoading(true);
      return null;
    }
  }, [ready, wallets]);

  return {
    error,
    loading: ready || loading,
    privyWallet,
  };
}
