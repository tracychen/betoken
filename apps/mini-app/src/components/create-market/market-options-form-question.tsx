import { useFieldArray, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Trash } from "@phosphor-icons/react";
import { Input } from "../ui/input";
import { MarketFormValues } from "./types";

export function MarketOptionsFormQuestion({
  form,
  maxOptions = 6,
}: {
  form: UseFormReturn<MarketFormValues>;
  maxOptions?: number;
}) {
  const { fields, append, remove } = useFieldArray<MarketFormValues>({
    control: form.control,
    name: "options",
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            defaultValue=""
            control={form.control}
            name={`options.${index}.name`}
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      icon={<div className="text-neutral-500 text-sm">$</div>}
                      placeholder={`OPTION${index + 1}`}
                      {...field}
                      onChange={(e: any) => {
                        e.target.value = e.target.value.toUpperCase();
                        field.onChange(e);
                      }}
                    />
                    <Button
                      size="icon"
                      type="button"
                      variant="ghost"
                      disabled={fields.length <= 2}
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <Trash className="w-6 h-6" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      {form.formState.errors?.options && (
        <FormField
          control={form.control}
          name={"options"}
          render={({ field, fieldState, formState }) => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {form.watch("options").length < maxOptions ? (
        <Button
          type="button"
          className="w-fit"
          size="sm"
          onClick={() => append({ name: "" })}
        >
          ADD MORE
        </Button>
      ) : (
        <div className="text-green-750 text-sm font-medium">
          You&apos;ve reached the maximum amount of options
        </div>
      )}
    </div>
  );
}
