import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CircleNotch } from "@phosphor-icons/react";

const spinnerVariants = cva("flex-col items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      small: "size-4",
      medium: "size-8",
      large: "size-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export function Spinner({
  size,
  show,
  children,
  className,
}: {
  size?: "small" | "medium" | "large";
  show?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={spinnerVariants({ show })}>
      <CircleNotch className={cn(loaderVariants({ size }), className)} />
      {children}
    </span>
  );
}
