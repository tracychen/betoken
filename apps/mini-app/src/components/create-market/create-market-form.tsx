"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormDescription, FormLabel } from "../ui/form";
import { ClosingTimestampFormQuestion } from "./market-closing-timestamp-form-question";
import { MarketOptionsFormQuestion } from "./market-options-form-question";
import { Spinner } from "../ui/spinner";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import Link from "next/link";
import { MarketDescriptionFormQuestion } from "./market-description-form-question";
import { MarketTitleFormQuestion } from "./market-title-form-question";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { CopyWrapper } from "../copy-wrapper";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { MarketCard } from "../market/market-card";
import {
  Stepper,
  Step,
  StepBody,
  StepFooter,
  StepLabel,
  StepNextButton,
  StepPrevButton,
} from "../ui/stepper";
import { Market, MarketStatus } from "@betoken/database";
import { MarketFormValues } from "./types";
import { parseEther } from "viem";
import { useMarketActions } from "@/app/hooks/useMarketActions";
import { saveMarket } from "@/app/actions/markets";
import { MarketInitialLiquidityFormQuestion } from "./market-initial-liquidity-form-question";

const maxClosingTimestamp = new Date(1733011200000); // BE API body validation also needs to be updated if this changes
const maxOptions = 6;

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Market question must be at least 5 characters")
    .max(100, "Market question must be less than 100 characters"),
  options: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, "No option provided")
          .max(12)
          // Only allow uppercase alphanumeric characters
          .regex(/^[A-Z0-9\s]+$/, "Invalid character(s)"),
      })
    )
    .min(2, "You need at least 2 options to form a market")
    .max(maxOptions),
  description: z
    .string()
    .min(5, "Resolution criteria must be at least 5 characters")
    .max(1000, "Resolution criteria must be less than 1000 characters"),
  closingTimestamp: z
    .date()
    .refine(
      (date: Date) => {
        return date > new Date();
      },
      {
        message: "Closing time must be in the future",
      }
    )
    .refine(
      (date: Date) => {
        return date < maxClosingTimestamp;
      },
      {
        message: `Closing time must be before ${formatInTimeZone(
          maxClosingTimestamp,
          "UTC",
          "M/d/yy, hh:mm a zzz"
        )} (Local Time: ${format(maxClosingTimestamp, "M/d/yy, hh:mm a zzz")})`,
      }
    ),
  initialLiquidity: z.string().refine((val) => !Number.isNaN(parseFloat(val)), {
    message: "Expected number, received a string",
  }),
  // image: z
  //   .string({
  //     message: "Image is required",
  //   })
  //   .min(1, {
  //     message: "Image is required",
  //   }),
});

export function CreateMarketForm() {
  const { toast } = useToast();
  const { createManualMarket, loading, error } = useMarketActions();
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = usePrivy();
  const [isSavingMarket, setIsSavingMarket] = useState(false);
  const [market, setMarket] = useState<Market | null>(null);
  const form = useForm<MarketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      options: [
        {
          name: "",
        },
      ],
      closingTimestamp: new Date(),
      title: "",
      description: "",
      initialLiquidity: 0,
      // image: "",
    },
    mode: "onBlur",
  });

  async function onMarketCreateSuccess(data: {
    id: number;
    title: string;
    description: string;
    options: string[];
    closingTimestamp: Date;
    transactionHash: string;
  }) {
    setIsSavingMarket(true);
    try {
      const market = await saveMarket({
        id: data.id,
        title: data.title,
        description: data.description,
        creatorDID: user!.id,
        options: data.options,
        closesAt: data.closingTimestamp,
        transactionHash: data.transactionHash,
        status: MarketStatus.OPEN,
      });
      setMarket(market);
    } catch (error: any) {
      console.error(error);
      toast({
        title: error?.message || "Failed to complete market creation",
      });
    } finally {
      setIsSavingMarket(false);
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 sm:gap-2 sm:flex-row justify-start sm:justify-between items-start sm:items-center">
        <div className="font-spacegrotesk text-xl font-normal">
          CREATE MARKET
        </div>
      </div>
      <Form {...form}>
        <form className="space-y-8">
          <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep}>
            <Step>
              <StepLabel>MARKET DETAILS</StepLabel>
              <StepBody className="grid gap-4">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <MarketTitleFormQuestion form={form} />
                    <MarketOptionsFormQuestion
                      form={form}
                      maxOptions={maxOptions}
                    />
                  </div>
                  <MarketDescriptionFormQuestion form={form} />
                  <ClosingTimestampFormQuestion
                    form={form}
                    maxClosingTimestamp={maxClosingTimestamp}
                  />
                  <MarketInitialLiquidityFormQuestion form={form} />
                </div>
              </StepBody>
              <StepFooter>
                <StepNextButton
                  onClick={async () => {
                    const isValid = await form.trigger([
                      "options",
                      "closingTimestamp",
                      "title",
                      "description",
                    ]);
                    if (!isValid) {
                      throw new Error("Invalid form data");
                    }
                  }}
                  className="max-w-sm mx-auto"
                />
              </StepFooter>
            </Step>
            <Step>
              <StepLabel>REVIEW MARKET</StepLabel>
              <StepBody>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="text-accent">MARKET DETAILS</div>
                      <Button size="sm" onClick={() => setCurrentStep(0)}>
                        EDIT
                      </Button>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div>MARKET QUESTION</div>
                        <div className="text-sm">{form.getValues("title")}</div>
                      </div>
                      <div className="space-y-2">
                        <div>OPTIONS</div>
                        <div className="text-sm">
                          {form
                            .getValues("options")
                            .map((option) => `$${option.name}`)
                            .join(", ")}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>RESOLUTION CRITERIA</div>
                        <div className="text-sm">
                          {form.getValues("description")}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>EXPIRATION TIME</div>
                        <div className="text-sm">
                          {form.getValues("closingTimestamp") &&
                            new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true, // AM/PM format
                              timeZoneName: "long",
                            }).format(form.getValues("closingTimestamp"))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>INITIAL LIQUIDITY</div>
                        <div className="text-sm">
                          {form.getValues("initialLiquidity")}
                          <span className="text-neutral-500"> ETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StepBody>
              <StepFooter>
                <StepPrevButton />
                <StepNextButton
                  onClick={async () => {
                    // Validate all fields
                    const isValid = await form.trigger();
                    if (!isValid) {
                      throw new Error("Invalid form data");
                    }
                    // Prepare payload
                    const payload = {
                      title: form.getValues("title"),
                      description: form.getValues("description"),
                      options: form.getValues("options").map((option) => {
                        return option.name
                          .replace(/^\$/, "")
                          .trim()
                          .toUpperCase();
                      }),
                      closingTimestamp: new Date(
                        form.getValues("closingTimestamp")
                      ),
                      initialLiquidity: form.getValues("initialLiquidity"),
                      // image: form.getValues("image"),
                    };
                    // Trigger market creation
                    try {
                      const data = await createManualMarket({
                        title: payload.title,
                        options: payload.options,
                        closingTimestamp: payload.closingTimestamp,
                        initialLiquidity: parseEther(
                          payload.initialLiquidity.toString()
                        ),
                      });
                      if (data) {
                        onMarketCreateSuccess({
                          id: data.id,
                          title: data.title,
                          description: payload.description,
                          options: data.options,
                          closingTimestamp: payload.closingTimestamp,
                          transactionHash: data.transactionHash,
                        });
                      } else {
                        toast({
                          title: "Failed to create market",
                        });
                      }
                    } catch (error: any) {
                      console.error(error);
                      toast({
                        title: error?.message || "Failed to create market",
                      });
                    }
                  }}
                >
                  {loading && (
                    <Spinner className="text-primary-foreground" size="small" />
                  )}
                  CREATE MARKET
                </StepNextButton>
              </StepFooter>
            </Step>
            <Step>
              <StepLabel>CREATING MARKET</StepLabel>
              <StepBody>
                {isSavingMarket || !market ? (
                  <div className="flex flex-col items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <FormLabel className="text-center">
                        MARKET CREATION IN PROGRESS
                      </FormLabel>
                      <FormDescription className="text-center">
                        Please do not close this tab, we&apos;re creating this
                        market onchain!
                      </FormDescription>
                    </div>
                    <Spinner size="large" />
                    {/* {saveMarketError && (
                      <div className="text-rose-500 text-sm text-ellipsis line-clamp-5">
                        {saveMarketError}
                      </div>
                    )}
                    {marketError && (
                      <div className="text-rose-500 text-sm text-ellipsis line-clamp-5">
                        {marketError}
                      </div>
                    )} */}
                    {error && (
                      <div className="text-rose-500 text-sm text-ellipsis line-clamp-5 w-full">
                        {error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <FormLabel className="text-center">
                        LFG YOUR MARKET IS LIVE!
                      </FormLabel>
                      <FormDescription className="text-center">
                        Let&apos;s go, you&apos;ve created your market. Get your
                        skin in the game and inject liquidity in the market.
                      </FormDescription>
                    </div>
                    <MarketCard
                      market={market}
                      showProgress={false}
                      showCopyButton={false}
                    />
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                      <CopyWrapper
                        className="flex-1"
                        text={`${window.location.origin}/markets/${market.id}`}
                        toastTitle="Market link copied"
                      >
                        <Button type="button" className="w-full">
                          COPY LINK
                        </Button>
                      </CopyWrapper>
                      <Link
                        href={`/markets/${market.id}`}
                        className="flex-1 order-first sm:order-last"
                      >
                        <Button className="w-full">VIEW MARKET</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </StepBody>
            </Step>
          </Stepper>
        </form>
      </Form>
    </div>
  );
}
