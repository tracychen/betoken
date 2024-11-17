"use client";

import { useEffect, useState } from "react";
import { getMarkets } from "../actions/markets";
import { Card } from "@/components/ui/card";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { MarketCard } from "@/components/market/market-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [markets, setMarkets] = useState<any>([]);

  const fetchMarkets = async () => {
    setIsLoading(true);
    try {
      const markets = await getMarkets();
      setMarkets(markets);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2>Markets</h2>
        <div onClick={() => fetchMarkets()} className="hover:cursor-pointer">
          <ArrowsClockwise className="w-4 h-4" />
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="w-full h-48" />
      ) : (
        markets.map((market: any) => (
          // <Card
          //   key={market.id}
          //   className="px-4 py-2.5 rounded-md flex flex-col gap-2"
          // >
          //   <h2>{market.title}</h2>
          //   <div className="text-sm text-muted-foreground">
          //     <p>Description: {market.description}</p>
          //     <p>Options: {market.options.join(", ")}</p>
          //     <p>Creator: {market.creator}</p>
          //     <p>Tx hash: {market.transactionHash}</p>
          //   </div>
          // </Card>
          <MarketCard market={market} key={market.id} />
        ))
      )}
    </div>
  );
}
