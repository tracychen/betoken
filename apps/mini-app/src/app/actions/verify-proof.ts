"use server";

import { ISuccessResult } from "@worldcoin/idkit";

export const verifyProof = async (successResult: ISuccessResult) => {
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
    return verified;
  } else {
    const { code, detail } = await response.json();
    throw new Error(`Error Code ${code}: ${detail}`);
  }
};
