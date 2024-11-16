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

export function MarketTitleFormQuestion({
  form,
}: {
  form: UseFormReturn<MarketFormValues>;
}) {
  return (
    <FormField
      control={form.control}
      defaultValue=""
      name="title"
      render={({ field }: { field: any }) => (
        <FormItem>
          <div className="space-y-2">
            <FormLabel>MARKET TITLE</FormLabel>
            <FormDescription>
              Ask a question about a future event outcome - include 2 to 4
              options
            </FormDescription>
          </div>
          <FormControl>
            <Input
              placeholder="Who will Trump appoint as SEC chair?"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
