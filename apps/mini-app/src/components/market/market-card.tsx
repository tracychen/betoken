"use client";

import { CopyWrapper } from "../copy-wrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Card } from "../ui/card";
import { defaultEther, truncateMiddle } from "@/lib/utils";
import { ArrowUpRight, CopySimple, CurrencyEth } from "@phosphor-icons/react";
import { MarketTimestamp } from "./market-timestamp";
import { MarketCreator } from "./market-creator";
import Link from "next/link";
import { chain, explorerEndpoints } from "@/lib/chain";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function MarketCard({
  market,
  label,
  showCopyButton = true,
}: {
  market: any;
  label?: string;
  showCopyButton?: boolean;
  showProgress?: boolean;
}) {
  const router = useRouter();

  return (
    <Card
      className="px-4 py-4 grid gap-4 cursor-pointer hover:opacity-90 rounded-md"
      onClick={() => {
        router.push(`/markets/${market.id}`);
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="self-stretch justify-between items-start inline-flex gap-4 flex-col">
          <MarketCreator creatorDID={market?.creatorDID} />

          <div className="flex gap-2">
            <MarketTimestamp
              status={market?.status}
              closingTimestamp={market?.closesAt}
              resolutionTime={market?.resolutionTime}
            />
            <div className="p-2 border border-neutral-250 border-dashed flex items-center self-stretch">
              <div className="text-white text-xs uppercase font-medium">
                {market.status || "Loading"}
              </div>
            </div>
            {showCopyButton && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CopyWrapper
                      text={`${window.location.origin}/markets/${market.id}`}
                      toastTitle="Market link copied"
                    >
                      <Button size="icon" variant="outline">
                        <CopySimple className="w-4 h-4" size={16} />
                      </Button>
                    </CopyWrapper>
                  </TooltipTrigger>
                  <TooltipContent>Copy market link</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="items-start sm:items-center gap-4 inline-flex flex-col sm:flex-row">
          <div className="grow shrink basis-0 flex-col justify-center items-start gap-2 sm:gap-4 inline-flex">
            {label && <div className="text-accent text-sm">{label}</div>}
            <div className="text-white text-base">{market?.title}</div>
            <div className="gap-4 inline-flex">
              <div className="text-accent text-sm flex items-center">
                LIQUIDITY: {defaultEther(market.totalLiquidity)}
                <CurrencyEth className="ml-1 h-3.5 w-3.5 inline-flex" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {market.options.map((option: any, index: number) => (
          <Button key={index} variant="outline" className="w-full">
            ${option}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Creation tx:
        <Link
          href={`${explorerEndpoints[chain.id]}/tx/${market.transactionHash}`}
          target="_blank"
          className="text-sm"
        >
          <Button variant="link" className="text-muted-foreground">
            {truncateMiddle(market.transactionHash)}
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
