"use client";

import { NavBar } from "@/components/nav/navbar";
import { Tabs } from "@/components/nav/tabs";
import { chain } from "@/lib/chain";
import { PrivyProvider } from "@privy-io/react-auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["telegram"],
        defaultChain: chain,
        supportedChains: [chain],
        appearance: {
          loginMessage:
            "Please login with your existing account or create a new account.",
          theme: "dark",
        },
      }}
    >
      <main className="flex min-h-screen flex-col">
        <NavBar />
        <div className="min-h-[calc(100vh-146px)] px-6 py-4">{children}</div>
        <Tabs />
      </main>
    </PrivyProvider>
  );
}
