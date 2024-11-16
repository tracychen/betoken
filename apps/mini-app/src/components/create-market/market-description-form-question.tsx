import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { MarketFormValues } from "./types";

export function MarketDescriptionFormQuestion({
  form,
}: {
  form: UseFormReturn<MarketFormValues>;
}) {
  return (
    <FormField
      control={form.control}
      defaultValue=""
      name="description"
      render={({ field }) => (
        <FormItem>
          <div className="space-y-2">
            <FormLabel>RESOLUTION CRITERIA</FormLabel>
            <FormDescription>
              Write down description and the conditions the market will resolve.
            </FormDescription>
          </div>
          <FormControl>
            <Textarea placeholder="Lorem ipsum" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
