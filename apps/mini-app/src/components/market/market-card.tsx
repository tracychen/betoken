"use client";
import { useMemo } from "react";
import Image from "next/image";
import { CopyWrapper } from "../copy-wrapper";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { defaultEther } from "@/lib/utils";
import { CurrencyEth, Share } from "@phosphor-icons/react";
import { MarketTimestamp } from "./market-timestamp";
import { MarketCreator } from "./market-creator";

export function MarketCard({
  market,
  label,
  showCopyButton = true,
  showProgress = true,
}: {
  market: any;
  label?: string;
  showCopyButton?: boolean;
  showProgress?: boolean;
}) {
  const { percentages, liquidity } = useMemo(() => {
    const numOptions = market?.options?.length;
    const ethBalances = market?.ethBalances;
    if (!ethBalances || ethBalances.length <= 0 || !numOptions) {
      const percentages = market?.options.map(() => 0);
      return { percentages, liquidity: BigInt(0) };
    }
    const liquidity = ethBalances.reduce(
      (acc: bigint, balance: bigint) => acc + BigInt(balance),
      BigInt(0)
    );
    if (liquidity === BigInt(0)) {
      const percentages = market?.options.map(() =>
        parseFloat((100 / numOptions).toFixed(2))
      );
      return { percentages, liquidity: BigInt(0) };
    }
    // Calculate all except last option to avoid rounding errors on the last one
    const percentages = market?.options.map((_: any, index: number) => {
      if (index === numOptions - 1) return 0;
      return (
        Number((BigInt(ethBalances[index]) * BigInt(10000)) / liquidity) / 100
      );
    });
    // Calculate last option
    percentages[numOptions - 1] = parseFloat(
      (
        100 -
        percentages.reduce((acc: number, percent: number) => acc + percent, 0)
      ).toFixed(2)
    );

    return { percentages, liquidity };
  }, [market?.ethBalances, market?.options]);

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="self-stretch justify-between items-start sm:items-center inline-flex gap-4 flex-col sm:flex-row">
          <MarketCreator creator={market?.creator} />
          <div className="flex gap-2">
            <MarketTimestamp
              status={market?.status}
              closingTimestamp={market?.closingTimestamp}
              resolutionTime={market?.resolutionTime}
            />
            <div className="p-2 border border-neutral-250 border-dashed flex items-center self-stretch">
              <div className="text-white text-xs uppercase font-medium">
                {market.status || "Loading"}
              </div>
            </div>
            {showCopyButton && (
              <Tooltip>
                <TooltipTrigger>
                  <CopyWrapper
                    text={window.location.href}
                    toastTitle="Market link copied"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                      <Share className="w-7 h-7" size={28} />
                    </div>
                  </CopyWrapper>
                </TooltipTrigger>
                <TooltipContent>Copy market link</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="items-start sm:items-center gap-4 inline-flex flex-col sm:flex-row">
          <Image
            className="aspect-square object-cover w-[107px] h-[107px] relative rounded-2xl hidden sm:flex"
            src={market?.image}
            alt={market?.title}
            width={107}
            height={107}
          />
          <Image
            className="object-cover w-full h-[100px] relative rounded-2xl sm:hidden"
            src={market?.image}
            alt={market?.title}
            width={400}
            height={100}
          />
          <div className="grow shrink basis-0 flex-col justify-center items-start gap-2 sm:gap-4 inline-flex">
            {label && <div className="text-accent text-sm">{label}</div>}
            <div className="text-white text-base">{market?.title}</div>
            <div className="gap-4 inline-flex">
              <div className="text-accent text-sm flex items-center">
                LIQUIDITY: {defaultEther(liquidity)}
                <CurrencyEth className="ml-1 h-3.5 w-3.5 inline-flex" />
              </div>
              <div className="text-neutral-500 text-sm">
                TRADES: {market?.trades}
              </div>
            </div>
          </div>
        </div>
        {showProgress && market?.options && market?.options.length == 2 && (
          <Progress
            value={Number(percentages[0])}
            // className=
            //   "h-6 sm:h-8 bg-gradient-to-t from-neutral-850 to-neutral-550"
          />
        )}
      </div>
      {showProgress &&
        (market?.options && market?.options.length == 2 ? (
          <div className="grid grid-cols-2">
            <div className="grid gap-2 place-items-start">
              <div className="flex items-center gap-2 text-base">
                {defaultEther(market?.ethBalances[0] || 0)}
                <div className="hidden sm:inline-flex">ETH</div>
                <CurrencyEth className="inline-flex w-4 h-4" size={16} />
              </div>
              <div className="text-white text-sm uppercase">
                {percentages[0]}% ${market?.options[0]?.name}
              </div>
            </div>

            <div className="grid gap-2 place-items-end text-right">
              <div className="flex items-center gap-2 text-base">
                {defaultEther(market?.ethBalances[1] || 0)}
                <div className="hidden sm:inline-flex">ETH</div>
                <CurrencyEth className="inline-flex w-4 h-4" size={16} />
              </div>
              <div className="text-white text-sm uppercase">
                {percentages[1]}% ${market?.options[1]?.name}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-2 sm:gap-y-4">
            {market?.options.map(
              (
                option: {
                  name: string;
                },
                index: number
              ) => (
                <div
                  key={index}
                  className="flex justify-between items-center flex-wrap gap-x-2"
                >
                  <div className="uppercase flex gap-2 items-center">
                    ${option?.name}
                    <div className="text-neutral-500 text-sm">
                      {percentages[index]}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {defaultEther(market?.ethBalances[index] || 0)}
                    <div className="hidden sm:inline-flex">ETH</div>
                    <CurrencyEth className="inline-flex w-4 h-4" size={16} />
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      <div className="flex justify-between items-center flex-wrap mt-4">
        <div className="flex flex-wrap gap-2">
          {market?.categories &&
            market.categories.length > 0 &&
            market.categories.map((category: string, index: number) => (
              <div
                key={index}
                className="z-10 text-[14px] flex-shrink-0 rounded-[10px] bg-[#1B1B1B] text-white px-3 py-2 uppercase"
              >
                {category.toUpperCase()}
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}
