import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { MarketFormValues } from "./types";
import { Input } from "../ui/input";

export function MarketInitialLiquidityFormQuestion({
  form,
}: {
  form: UseFormReturn<MarketFormValues>;
}) {
  return (
    <FormField
      control={form.control}
      defaultValue={0.005}
      name="initialLiquidity"
      render={({ field }: { field: any }) => (
        <FormItem>
          <div className="space-y-2">
            <FormLabel>MARKET INITIAL LIQUIDITY</FormLabel>
            <FormDescription>
              How much liquidity will you provide to this market?
            </FormDescription>
          </div>
          <FormControl>
            <Input type="number" step={0.001} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
