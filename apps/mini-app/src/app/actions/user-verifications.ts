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

export async function upsertUserScore(did: string, score: number) {
  const userScore = await prisma.userScore.upsert({
    where: {
      did,
    },
    create: {
      did,
      score,
    },
    update: {
      score,
    },
  });
  return userScore;
}

export async function getUserScore(did: string) {
  const userScore = await prisma.userScore.findUnique({
    where: {
      did,
    },
  });
  return userScore;
}
