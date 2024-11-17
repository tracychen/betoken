"use server";

import { chain, publicClient } from "@/lib/chain";
import {
  betokenMarketsABI,
  betokenMarketsContractAddress,
} from "@/lib/contracts/betoken-markets";
import prisma from "@/lib/db";
import { MarketStatus } from "@betoken/database";
import { getContract } from "viem";

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

  // for each market get onchain
  let results = [];
  for (const market of markets) {
    const contract = getContract({
      address: betokenMarketsContractAddress[chain.id] as `0x${string}`,
      abi: betokenMarketsABI,
      client: {
        public: publicClient,
      },
    });
    // {

    //   struct Market {
    //     string title;
    //     uint256 createdAt;
    //     uint256 resolutionTime;
    //     address creator;
    //     address[] tokens;
    //     string[] options;
    //     bool resolved;
    //     MarketType marketType;
    //     IMarketResolver resolver;
    //     mapping(uint256 => LiquidityPool) pools;
    //     uint256 totalLiquidity;
    // }
    //   @betoken/mini-app:dev:   title: 'Test test',
    //   @betoken/mini-app:dev:   createdAt: 1731799728n,
    //   @betoken/mini-app:dev:   resolutionTime: 1732404506n,
    //   @betoken/mini-app:dev:   creator: '0xd0b3A668cA8F8d9aD33bDDcD73C9Ef70aBdA9026',
    //   @betoken/mini-app:dev:   tokens: false,
    //   @betoken/mini-app:dev:   options: 0,
    //   @betoken/mini-app:dev:   resolved: '0x0000000000000000000000000000000000000000',
    //   @betoken/mini-app:dev:   marketType: 2000000000000000n,
    //   @betoken/mini-app:dev:   resolver: undefined,
    //   @betoken/mini-app:dev:   pools: undefined,
    //   @betoken/mini-app:dev:   totalLiquidity: undefined
    //   @betoken/mini-app:dev: }
    const result = (await contract.read.markets([market.id])) as [
      string, // title
      number, // createdAt
      number, // resolutionTime
      string, // creator
      boolean, // resolved
      number, // marketType
      string, // resolver
      number, // totalLiquidity
      any, // tokens
      any, // options
      any, // pools
    ];
    const [
      title,
      createdAt,
      resolutionTime,
      creator,
      resolved,
      marketType,
      resolver,
      totalLiquidity,
      tokens,
      options,
      pools,
    ] = result;

    results.push({
      ...market,
      title,
      createdAt,
      resolutionTime,
      creator,
      // tokens,
      // options,
      resolved,
      marketType,
      resolver,
      // pools,
      totalLiquidity,
    });
  }
  console.log({ results });
  return results;
}
