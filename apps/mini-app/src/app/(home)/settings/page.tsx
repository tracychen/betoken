"use client";

import { verifyProof } from "@/app/actions/verify-proof";
import { useUserVerifications } from "@/app/hooks/useUserVerifications";
import { WorldCoinIcon } from "@/components/custom-icons";
import { Button } from "@/components/ui/button";
import { VerificationType } from "@betoken/database";
import { usePrivy } from "@privy-io/react-auth";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";

export default function SettingsPage() {
  const { user } = usePrivy();
  const { isLoading, verifications } = useUserVerifications();

  if (!user) {
    return null;
  }

  // TODO: Functionality after verifying
  const onSuccess = () => {
    console.log("Success");
  };

  const hasWorldID = verifications.some(
    (v) => v.type === VerificationType.WORLD_ID
  );

  return (
    <div className="grid gap-4">
      {/* <div className="flex flex-col gap-2">
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
      </div> */}
      <div className="flex flex-col gap-2">
        <h2>User Verifications</h2>
        <IDKitWidget
          app_id="app_staging_fb4ff0d388439e8e285f93350a40df78"
          action="validate-world-id"
          autoClose={true}
          verification_level={VerificationLevel.Device}
          handleVerify={(successResult) => verifyProof(successResult, user.id)}
          onSuccess={onSuccess}
        >
          {({ open }) => (
            <Button
              disabled={isLoading || hasWorldID}
              onClick={open}
              className="flex gap-2 items-center"
            >
              <WorldCoinIcon className="w-8 h-8" />
              {hasWorldID ? "World ID Verified" : "Verify with World ID"}
            </Button>
          )}
        </IDKitWidget>
      </div>
    </div>
  );
}
