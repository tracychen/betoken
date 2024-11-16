"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";
import { Attestation, getAttestations } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

const COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID =
  "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9" as `0x${string}`;
const attestationsOptions = {
  schemas: [COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID],
};

export const useUserAttestations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const { user } = usePrivy();

  const fetchVerifiedAccountAttestations = useCallback(async () => {
    if (!user?.linkedAccounts) {
      return;
    }
    setIsLoading(true);
    try {
      for (const wallet of user.linkedAccounts.filter(
        (account) => account.type === "wallet"
      ) || []) {
        const attestations = await getAttestations(
          wallet.address as `0x${string}`,
          base,
          attestationsOptions
        );
        if (attestations.length > 0) {
          setAttestations((prev) => [...prev, ...attestations]);
        }
      }
    } catch (error) {
      console.error("Error fetching user attestations", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.linkedAccounts]);

  useEffect(() => {
    fetchVerifiedAccountAttestations();
  }, [fetchVerifiedAccountAttestations]);

  return { isLoading, attestations };
};
