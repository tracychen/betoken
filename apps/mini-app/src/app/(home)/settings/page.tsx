"use client";

import { verifyProof } from "@/app/actions/verify-proof";
import { useUserVerifications } from "@/app/hooks/useUserVerifications";
import { WorldCoinIcon } from "@/components/custom-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { chain } from "@/lib/chain";
import { VerificationType } from "@betoken/database";
import { Profile as CirclesProfile } from "@circles-sdk/profiles";
import {
  Address,
  Avatar,
  Badge,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import { ArrowSquareOut, Wallet } from "@phosphor-icons/react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCirclesAvatarProfile } from "@/app/actions/circles";

export default function SettingsPage() {
  const { user, linkWallet } = usePrivy();
  const { isLoading, verifications } = useUserVerifications();
  const { wallets } = useWallets();
  const [circlesAvatarProfile, setCirclesAvatarProfile] =
    useState<CirclesProfile>();

  const hasWorldID = verifications.some(
    (v) => v.type === VerificationType.WORLD_ID
  );

  const externalWallet = wallets.find(
    (wallet) => wallet.walletClientType !== "privy"
  );

  useEffect(() => {
    if (externalWallet) {
      getCirclesAvatarProfile(externalWallet.address).then((profile) => {
        setCirclesAvatarProfile(profile);
      });
    }
  }, [externalWallet]);

  if (!user) {
    return null;
  }

  // TODO: Functionality after verifying
  const onSuccess = () => {
    console.log("Success");
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2">
        <h2>
          Welcome back,{" "}
          <b>{user.telegram?.username || user.telegram?.firstName}</b>
        </h2>
        <p className="text-muted-foreground text-sm">Total Score: 5</p>
      </div>

      <div className="flex flex-col gap-2">
        <h2>Linked External Wallets</h2>
        {user.linkedAccounts
          .filter((account) => account.type === "wallet")
          .filter((account) => account.walletClientType !== "privy")
          .map((wallet) => (
            <Card
              key={wallet.address}
              className="flex items-center justify-between rounded-md px-4 py-2.5"
            >
              <Identity address={wallet.address as `0x${string}`} chain={chain}>
                <Avatar className="mr-2" />
                <Name>
                  <Badge />
                </Name>
                <Address />
              </Identity>
            </Card>
          ))}
        <Button onClick={linkWallet}>
          <Wallet size={32} className="w-8 h-8" weight="fill" />
          {externalWallet ? "Add Linked Wallet" : "Link a Wallet"}
        </Button>
      </div>
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
            <Button disabled={isLoading || hasWorldID} onClick={open}>
              <WorldCoinIcon className="w-8 h-8" />
              {hasWorldID
                ? "World ID Verified"
                : isLoading
                ? "Checking..."
                : "Verify with World ID"}
            </Button>
          )}
        </IDKitWidget>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="flex gap-2 items-center justify-between">
          Circles
          <Link
            href="https://docs.aboutcircles.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              Learn more
              <ArrowSquareOut size={16} />
            </p>
          </Link>
        </h2>
        {circlesAvatarProfile ? (
          <div>{circlesAvatarProfile?.imageUrl}</div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Link your Circles avatar wallet above
          </div>
        )}
      </div>
    </div>
  );
}
