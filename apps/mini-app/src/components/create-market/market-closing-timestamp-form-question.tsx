import { useRef, useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { MarketFormValues } from "./types";
import { Button } from "../ui/button";
import { cn, getCurrentDate } from "@/lib/utils";
import { CaretDown } from "@phosphor-icons/react";
import { TimePicker } from "../ui/time-picker";

class PeriodSelectOption {
  static TWO_DAYS = "48 hours";
  static ONE_WEEK = "1 week";
  static TWO_WEEKS = "2 weeks";
  static ONE_MONTH = "1 month";
}

const periodDisplays = {
  [PeriodSelectOption.TWO_DAYS]: {
    default: "48 hours",
    short: "48hrs",
  },
  [PeriodSelectOption.ONE_WEEK]: {
    default: "1 week",
    short: "1wk",
  },
  [PeriodSelectOption.TWO_WEEKS]: {
    default: "2 weeks",
    short: "2wks",
  },
  [PeriodSelectOption.ONE_MONTH]: {
    default: "1 month",
    short: "1mo",
  },
};

export function ClosingTimestampFormQuestion({
  form,
  maxClosingTimestamp,
}: {
  form: UseFormReturn<MarketFormValues>;
  maxClosingTimestamp: Date;
}) {
  const [periodSelect, setPeriodSelect] = useState();

  const getUpdatedPeriodTimestamp = (period?: string) => {
    let updatedClosingTimestamp = new Date();
    switch (period) {
      case PeriodSelectOption.TWO_DAYS:
        updatedClosingTimestamp.setDate(updatedClosingTimestamp.getDate() + 2);
        break;
      case PeriodSelectOption.ONE_WEEK:
        updatedClosingTimestamp.setDate(updatedClosingTimestamp.getDate() + 7);
        break;
      case PeriodSelectOption.TWO_WEEKS:
        updatedClosingTimestamp.setDate(updatedClosingTimestamp.getDate() + 14);
        break;
      case PeriodSelectOption.ONE_MONTH:
        updatedClosingTimestamp.setMonth(
          updatedClosingTimestamp.getMonth() + 1
        );
        break;
    }
    return updatedClosingTimestamp;
  };

  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={form.control}
      name="closingTimestamp"
      render={({ field }: { field: any }) => (
        <FormItem>
          <div className="space-y-2">
            <FormLabel>EXPIRATION TIME</FormLabel>
            <FormDescription>
              Listed in your local timezone:{" "}
              {Intl.DateTimeFormat().resolvedOptions().timeZone}. Market must
              resolve within 48 hours post deadline.
            </FormDescription>
          </div>
          <FormControl>
            <div className="flex gap-4 flex-wrap md:flex-nowrap">
              <div className="w-full p-2 bg-background border rounded-[10px] justify-between items-center md:gap-2 inline-flex">
                {Object.values(PeriodSelectOption).map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={periodSelect !== option ? "ghost" : "default"}
                    className={cn(
                      "h-[50px] text-sm",
                      periodSelect !== option && "text-muted-foreground"
                    )}
                    onClick={() => {
                      field.onChange(getUpdatedPeriodTimestamp(option));
                      setPeriodSelect(option);
                      form.trigger("closingTimestamp");
                    }}
                  >
                    <div className="hidden sm:flex">
                      {periodDisplays[option].default}
                    </div>
                    <div className="sm:hidden">
                      {periodDisplays[option].short}
                    </div>
                  </Button>
                ))}
              </div>
              <div className="flex gap-4 justify-between w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "bg-background text-sm h-[66px] flex-1 w-full"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "MM/dd/yyyy")
                      ) : (
                        <span>Select day</span>
                      )}
                      <CaretDown className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-none shadow-lg shadow-accent/45 rounded-[10px]">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(e: any) => {
                        field.onChange(e);
                        setPeriodSelect(undefined);
                        form.trigger("closingTimestamp");
                      }}
                      initialFocus
                      disabled={(date: Date) =>
                        date < getCurrentDate() ||
                        date > new Date(maxClosingTimestamp)
                      }
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex items-center gap-1">
                  <TimePicker
                    className={cn(
                      "bg-background text-sm h-[66px] flex-1 w-full px-2 border"
                    )}
                    picker="hours"
                    date={field.value}
                    setDate={(e: any) => {
                      field.onChange(e);
                      setPeriodSelect(undefined);
                      form.trigger("closingTimestamp");
                    }}
                    ref={hourRef}
                    onRightFocus={() => minuteRef.current?.focus()}
                  />
                  :
                  <TimePicker
                    className={cn(
                      "bg-background text-sm h-[66px] flex-1 w-full px-2 border"
                    )}
                    picker="minutes"
                    date={field.value}
                    setDate={(e: any) => {
                      field.onChange(e);
                      setPeriodSelect(undefined);
                      form.trigger("closingTimestamp");
                    }}
                    ref={minuteRef}
                    onLeftFocus={() => hourRef.current?.focus()}
                  />
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
