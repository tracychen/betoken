"use server";

import prisma from "@/lib/db";

export async function getUserVerifications(did: string) {
  const verifications = await prisma.userVerification.findMany({
    where: {
      did: did,
    },
  });
  return verifications;
}
