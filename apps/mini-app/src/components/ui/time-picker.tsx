import { Input } from "./input";
import { forwardRef } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { TimePickerInput, TimePickerInputProps } from "./time-picker-input";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "rounded-[10px] text-white border-0 text-sm font-medium placeholder:text-neutral-500",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 ring-accent focus-visible:ring-offset-0",
        inactive: "bg-neutral-800 ring-accent focus-visible:ring-offset-0",
      },
      size: {
        default: "h-14 p-6 rounded-[10px]",
        sm: "h-10 px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TimePickerProps
  extends VariantProps<typeof inputVariants>,
    TimePickerInputProps {}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <TimePickerInput
        ref={ref}
        className={cn(inputVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
TimePicker.displayName = "TimePicker";

export { TimePicker };
