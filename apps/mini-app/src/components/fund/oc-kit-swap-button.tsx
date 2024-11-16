import { Avatar, Name } from "@coinbase/onchainkit/identity";
import {
  Swap,
  SwapAmountInput,
  SwapToggleButton,
  SwapButton,
  SwapMessage,
  SwapToast,
} from "@coinbase/onchainkit/swap";
import { Wallet, ConnectWallet } from "@coinbase/onchainkit/wallet";
import type { Token } from "@coinbase/onchainkit/token";
import { usePrivyWallet } from "@/app/hooks/usePrivyWallet";
import { chain } from "@/lib/chain";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function OnchainKitSwapButton() {
  const { privyWallet } = usePrivyWallet();

  const ETHToken: Token = {
    address: "",
    chainId: chain.id,
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
    image:
      "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
  };

  const USDCToken: Token = {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    chainId: chain.id,
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
    image:
      "https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png",
  };

  // add other tokens here to display them as options in the swap
  const swappableTokens: Token[] = [ETHToken, USDCToken];

  return (
    <Card className="rounded-md px-4 py-2.5">
      <Swap className="p-0" title="Swap">
        <SwapAmountInput
          className="p-0 py-2"
          label="Sell"
          swappableTokens={swappableTokens}
          token={USDCToken}
          type="from"
        />
        <SwapToggleButton />
        <SwapAmountInput
          className="p-0 py-2"
          label="Buy"
          swappableTokens={swappableTokens}
          token={ETHToken}
          type="to"
        />
        <SwapButton className="rounded-md px-4 py-2 text-sm font-normal bg-primary text-primary-foreground shadow hover:bg-primary/90" />
        <SwapMessage className="py-2 text-muted-foreground" />
        <SwapToast />
      </Swap>
    </Card>
  );
}
