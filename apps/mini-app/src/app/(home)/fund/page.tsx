"use client";

import { usePrivyWallet } from "@/app/hooks/usePrivyWallet";
import { CopyWrapper } from "@/components/copy-wrapper";
import { PayWithCoinbaseButton } from "@/components/fund/pay-with-cb-button";
import { Card } from "@/components/ui/card";
import { chain } from "@/lib/chain";
import { truncateMiddle } from "@/lib/utils";
import { CopySimple } from "@phosphor-icons/react";
import { usePrivy } from "@privy-io/react-auth";
import { useBalance } from "wagmi";

export default function SettingsPage() {
  const { user } = usePrivy();
  const { privyWallet } = usePrivyWallet();
  const { data: balance } = useBalance({
    address: (privyWallet?.address || "0x0") as `0x${string}`,
    chainId: chain.id,
  });

  if (!user) {
    return null;
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2">
        <h2>Wallet Address</h2>
        <Card className="rounded-md px-4 py-2.5 flex items-center justify-between text-muted-foreground">
          <p className="text-sm">
            {truncateMiddle(privyWallet?.address || "", 18)}
          </p>
          <CopyWrapper
            text={privyWallet?.address || ""}
            toastTitle="Wallet address copied"
          >
            <CopySimple className="w-4 h-4" />
          </CopyWrapper>
        </Card>
      </div>
      <div className="flex flex-col gap-2">
        <h2>Balance</h2>
        <Card className="rounded-md px-4 py-2.5 flex text-muted-foreground">
          <p className="text-sm">{balance?.value || 0} ETH</p>
        </Card>
      </div>
      <PayWithCoinbaseButton />
    </div>
  );
}
