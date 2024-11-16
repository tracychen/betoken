"use client";

import { encodeFunctionData } from "viem";
import { usePrivyWallet } from "./usePrivyWallet";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { chain, publicClient } from "@/lib/chain";
import { convertDateToTimestampSeconds } from "@/lib/utils";
import {
  betokenMarketsABI,
  betokenMarketsContractAddress,
} from "@/lib/contracts/betoken-markets";

export const useMarketActions = () => {
  const { authenticated, sendTransaction } = usePrivy();
  const { privyWallet } = usePrivyWallet();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const validateAction = () => {
    let validationError;
    if (!privyWallet || !authenticated) {
      validationError = "You must be logged in to perform this action";
    }
    setError(validationError);
    return !validationError;
  };

  const resolveMarket = async (marketIndex: number, selectedOption: number) => {
    setError(undefined);
    setLoading(true);
    try {
      if (!validateAction()) {
        throw Error(error);
      }

      const receipt = await sendTransaction(
        {
          to: betokenMarketsContractAddress[chain.id],
          chainId: chain.id,
          data: encodeFunctionData({
            abi: betokenMarketsABI,
            functionName: "resolveMarket",
            args: [marketIndex, selectedOption],
          }),
        },
        {
          header: "Settle market",
          buttonText: "Settle",
        }
      );

      if (receipt.status !== 1) {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      setError(error?.message || "Failed to settle market");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createManualMarket = async ({
    title,
    options,
    closingTimestamp,
    initialLiquidity,
  }: {
    title: string;
    options: string[];
    closingTimestamp: Date;
    initialLiquidity: bigint;
  }) => {
    if (!validateAction()) {
      throw Error(error);
    }
    setLoading(true);
    try {
      const formattedClosingTimestamp =
        convertDateToTimestampSeconds(closingTimestamp);

      const args = [title, options, formattedClosingTimestamp];
      const value = BigInt(initialLiquidity);

      const { result } = await publicClient.simulateContract({
        address: betokenMarketsContractAddress[chain.id] as `0x${string}`,
        abi: betokenMarketsABI,
        functionName: "createManualMarket",
        args: args,
        account: privyWallet?.address as `0x${string}`,
        value: value,
      });

      const receipt = await sendTransaction(
        {
          to: betokenMarketsContractAddress[chain.id] as `0x${string}`,
          chainId: chain.id,
          data: encodeFunctionData({
            abi: betokenMarketsABI,
            functionName: "createManualMarket",
            args: args,
          }),
          value: value,
        },
        {
          header: "Creating Market",
          buttonText: "Create Market",
        }
      );

      if (receipt.status !== 1) {
        throw new Error("Transaction failed");
      }

      return {
        id: Number(result),
        address: privyWallet?.address,
        title,
        closingTimestamp: formattedClosingTimestamp,
        options,
        transactionHash: receipt.transactionHash,
      };
    } catch (error: any) {
      console.error("Failed to create market:", error);
      setError(error?.message || "Failed to create market");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createManualMarket,
    resolveMarket,
    error,
    loading,
  };
};
