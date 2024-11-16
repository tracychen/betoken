"use server";

import prisma from "@/lib/db";
import { VerificationType } from "@betoken/database";
import { ISuccessResult } from "@worldcoin/idkit";

export const verifyProof = async (
  successResult: ISuccessResult,
  did: string
) => {
  console.log("proof", successResult);
  const response = await fetch(
    "https://developer.worldcoin.org/api/v2/verify/app_staging_fb4ff0d388439e8e285f93350a40df78",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...successResult, action: "validate-world-id" }),
    }
  );
  if (response.ok) {
    const { verified } = await response.json();
    console.log({ did });
    // Store in db
    const userVerification = await prisma.userVerification.upsert({
      where: { did: did },
      update: { data: JSON.stringify(successResult) },
      create: {
        did: did,
        data: JSON.stringify(successResult),
        type: VerificationType.WORLD_ID,
      },
    });
    console.log("userVerification", userVerification);
    return verified;
  } else {
    const { code, detail } = await response.json();
    throw new Error(`Error Code ${code}: ${detail}`);
  }
};
