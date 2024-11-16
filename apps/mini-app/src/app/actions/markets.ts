"use server";

import prisma from "@/lib/db";
import { MarketStatus } from "@betoken/database";

export async function saveMarket({
  id,
  title,
  description,
  creatorDID,
  options,
  closesAt,
  transactionHash,
  status,
}: {
  id: number;
  title: string;
  description: string;
  creatorDID: string;
  options: string[];
  closesAt: Date;
  transactionHash: string;
  status: MarketStatus;
}) {
  const market = await prisma.market.create({
    data: {
      id,
      title,
      description,
      creatorDID,
      options,
      closesAt,
      transactionHash,
      status,
    },
  });
  return market;
}

export async function getMarkets() {
  const markets = await prisma.market.findMany();
  return markets;
}
