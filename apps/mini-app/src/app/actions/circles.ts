"use server";

import { PrivateKeyContractRunner } from "@circles-sdk/adapter-ethers";
import { Sdk } from "@circles-sdk/sdk";
import { ethers } from "ethers";
import { gnosis } from "viem/chains";

let circlesSdk: Sdk;

const getCirclesSdk = async () => {
  if (!circlesSdk) {
    const provider = new ethers.JsonRpcProvider(gnosis.rpcUrls.default.http[0]);
    const contractRunner = new PrivateKeyContractRunner(
      provider,
      process.env.CIRCLES_CONTRACT_RUNNER_PK!
    );

    await contractRunner.init();

    circlesSdk = new Sdk(contractRunner);
  }
  return circlesSdk;
};

export async function getCirclesAvatarProfile(walletAddress: string) {
  if (!walletAddress) {
    return;
  }

  const circlesSdk = await getCirclesSdk();

  try {
    const avatar = await circlesSdk.getAvatar(walletAddress);
    const profile = await avatar.getProfile();
    console.log({ profile });
    return profile;
  } catch (error) {
    console.error(error);
  }
}
