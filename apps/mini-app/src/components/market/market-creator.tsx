import Link from "next/link";
import { UserAvatar } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function VerifiedBadge() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CheckCircle size={16} className="text-accent" />
      </TooltipTrigger>
      <TooltipContent>Verified creator</TooltipContent>
    </Tooltip>
  );
}

export function MarketCreator({
  creator,
  className,
}: {
  creator: any;
  className?: string;
}) {
  const encodedUsername = encodeURIComponent(creator.username || "");

  return (
    <Link
      href={`/profile/${encodedUsername}`}
      className={cn("flex items-center gap-2", className)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <UserAvatar size="sm" src={creator?.photo_url} alt={creator?.username} />
      <div className="flex items-center gap-1">
        <div className="text-accent text-sm truncate">{creator?.username}</div>
        {creator?.creatorVerified && <VerifiedBadge />}
      </div>
    </Link>
  );
}
