import { cn, getCountdownStrFromTimestamp } from "@/lib/utils";
import { useEffect, useState } from "react";

export function MarketTimestamp({
  resolutionTime,
  status,
  closingTimestamp,
}: {
  resolutionTime?: number;
  status: "open" | "resolved" | "closed";
  closingTimestamp: number;
}) {
  const closingTimestampMs = closingTimestamp * 1000;
  const [timeLeft, setTimeLeft] = useState(
    getCountdownStrFromTimestamp(closingTimestampMs)
  );

  const formatter = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  useEffect(() => {
    if (status === "resolved" && resolutionTime) {
      // Show resolution time if the market has already resolved
      setTimeLeft(`ENDED ${formatter(new Date(resolutionTime))}`);
    } else if (closingTimestampMs < Date.now()) {
      // Show closing if the market has already closed but not resolved
      setTimeLeft(`ENDED ${formatter(new Date(closingTimestampMs))}`);
    } else if (closingTimestampMs - Date.now() > 24 * 60 * 60 * 1000) {
      // If > 24 hours til closing show date instead of countdown
      setTimeLeft(
        `ENDS ON ${new Date(closingTimestampMs).toLocaleString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        })}`
      );
    } else {
      // Update countdown every second
      const timer = setInterval(() => {
        setTimeLeft(getCountdownStrFromTimestamp(closingTimestampMs));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [closingTimestampMs]);

  return (
    <div className="p-2 border border-neutral-250 border-dashed items-center flex gap-2.5">
      <div
        className={cn(
          "w-2 h-2 bg-rose-500 rounded-full",
          closingTimestampMs > Date.now() &&
            status === "open" &&
            "animate-pulse"
        )}
      />
      <div className="text-white text-xs font-medium" suppressHydrationWarning>
        {timeLeft}
      </div>
    </div>
  );
}
