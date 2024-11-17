"use server";

import { chain, publicClient } from "@/lib/chain";
import { betokenMarketsContractAddress } from "@/lib/contracts/betoken-markets";
import { SmartContract } from "@coinbase/coinbase-sdk";

export const getTokensPurchasedEvents = async () => {
  const block = await publicClient.getBlockNumber();
  const events = await SmartContract.listEvents(
    chain.network,
    "public",
    betokenMarketsContractAddress[chain.id],
    "BetokenMarkets",
    "TokensPurchased",
    0,
    Number(block)
  );
  console.log({ events });
  return events;
};

export const getTokensSoldEvents = async () => {
  const block = await publicClient.getBlockNumber();
  const events = await SmartContract.listEvents(
    chain.network,
    "public",
    betokenMarketsContractAddress[chain.id],
    "BetokenMarkets",
    "TokensSold",
    0,
    Number(block)
  );
  console.log({ events });
  return events;
};

export const getMarketCreatedEvents = async () => {
  const block = await publicClient.getBlockNumber();
  const events = await SmartContract.listEvents(
    chain.network,
    "public",
    betokenMarketsContractAddress[chain.id],
    "BetokenMarkets",
    "MarketCreated",
    0,
    Number(block)
  );
  console.log({ events });
  return events;
};
