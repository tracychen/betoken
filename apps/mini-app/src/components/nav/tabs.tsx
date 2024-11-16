"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { cn } from "@/lib/utils";
import { Gear, Pencil, Ranking, Storefront } from "@phosphor-icons/react";

export const mobileTabs = [
  {
    name: "MARKETS",
    href: "/",
    icon: Storefront,
    requiresAuth: false,
  },
  {
    name: "CREATE",
    href: "/create-market",
    icon: Pencil,
    requiresAuth: false,
  },
  {
    name: "LEADERBOARD",
    href: "/leaderboard",
    icon: Ranking,
    requiresAuth: false,
  },
  {
    name: "SETTINGS",
    href: "/settings",
    icon: Gear,
    requiresAuth: true,
  },
];

export function Tabs({ className }: { className?: string }) {
  const { authenticated } = usePrivy();
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "sticky w-full bottom-0 left-0 right-0 p-4 flex justify-between bg-background border-t z-40",
        className
      )}
    >
      {mobileTabs.map((tab) => {
        if (tab.requiresAuth && !authenticated) {
          return null;
        }
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex-col flex gap-1 items-center flex-1 text-xs",
              pathname === tab.href ? "text-accent" : "text-muted-foreground"
            )}
          >
            {tab.icon && <tab.icon size={24} className="w-6 h-6" />}
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
