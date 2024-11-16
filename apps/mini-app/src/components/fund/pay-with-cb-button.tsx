import { usePrivyWallet } from "@/app/hooks/usePrivyWallet";
import { CBPayInstanceType, initOnRamp } from "@coinbase/cbpay-js";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowSquareOut } from "@phosphor-icons/react";

export const PayWithCoinbaseButton: React.FC = () => {
  const { privyWallet } = usePrivyWallet();
  const [onrampInstance, setOnrampInstance] =
    useState<CBPayInstanceType | null>();

  useEffect(() => {
    if (!privyWallet) {
      return;
    }
    initOnRamp(
      {
        appId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID!,
        widgetParameters: {
          // Specify the addresses and which networks they support
          addresses: { [privyWallet.address]: ["base"] },
          // (Optional) Filter the available assets on the above networks to just these ones
          //   assets: ["ETH", "USDC", "BTC"],
        },
        onSuccess: () => {
          console.log("success");
        },
        onExit: () => {
          console.log("exit");
        },
        onEvent: (event: any) => {
          console.log("event", event);
        },
        experienceLoggedIn: "popup",
        experienceLoggedOut: "popup",
        closeOnExit: true,
        closeOnSuccess: true,
      },
      (_: Error | null, instance: CBPayInstanceType | null) => {
        setOnrampInstance(instance);
      }
    );

    // When button unmounts destroy the instance
    return () => {
      onrampInstance?.destroy();
    };
  }, [onrampInstance, privyWallet]);

  const handleClick = () => {
    onrampInstance?.open();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!onrampInstance}
      className="flex items-center gap-2"
    >
      Buy with Coinbase
      <ArrowSquareOut size={16} />
    </Button>
  );
};
