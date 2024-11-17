import Link from "next/link";
import { UserAvatar } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react";
import { cn, truncateMiddle } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { getPrivyUser } from "@/app/actions/users";
import { User } from "@privy-io/server-auth";
import { getUserScore } from "@/app/actions/user-verifications";
import { Skeleton } from "../ui/skeleton";
import { chain, explorerEndpoints } from "@/lib/chain";
import { Button } from "../ui/button";

function VerifiedBadge({ score }: { score?: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <CheckCircle size={16} className="text-accent" />
        </TooltipTrigger>
        <TooltipContent>Rep Score: {score}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function MarketCreator({
  creatorDID,
  className,
}: {
  creatorDID: string;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [creator, setCreator] = useState<User>();
  const [score, setScore] = useState<number>();

  const getUserInfo = async () => {
    setIsLoading(true);
    try {
      const user = await getPrivyUser(creatorDID);
      setCreator(user);
      const score = await getUserScore(creatorDID);
      setScore(score?.score);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [creatorDID]);

  const walletAddress = useMemo(() => {
    return creator?.linkedAccounts
      .filter((account) => account.type === "wallet")
      .filter((account) => account.walletClientType === "privy")[0].address;
  }, [creator]);

  return (
    <div className="flex items-center justify-between w-full">
      <Link
        href={`https://t.me/${creator?.telegram?.username}`}
        className={cn("flex items-center gap-2", className)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <UserAvatar
          size="sm"
          src={creator?.telegram?.photoUrl}
          alt={creator?.telegram?.firstName}
        />
        {isLoading ? (
          <Skeleton className="w-12 h-4" />
        ) : (
          <div className="flex items-center gap-1">
            <div className="text-accent text-sm truncate">
              {creator?.telegram?.username}
            </div>
            {score && <VerifiedBadge score={score} />}
          </div>
        )}
      </Link>
      <Link
        href={`${explorerEndpoints[chain.id]}/address/${walletAddress}`}
        target="_blank"
        className="text-sm"
      >
        <Button variant="link">
          {truncateMiddle(walletAddress || "")}
          <ArrowUpRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
