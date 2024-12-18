"use client";

import { retrieveLaunchParams } from "@tma.js/sdk";

export function Me() {
  const { initData: data } = retrieveLaunchParams();
  const user = data?.user;

  if (!user) {
    return null;
  }

  return (
    <div className="text-sm font-mono">
      <div>Welcome back </div>
      <code className="font-mono font-bold">@{user.username}</code>
    </div>
  );
}
