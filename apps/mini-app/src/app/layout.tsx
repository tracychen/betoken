import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TmaSDKProvider } from "@/components/tma";
import { ThemeProvider } from "@/components/theme-provider";
import { Tabs } from "@/components/nav/tabs";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrainsmono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-spacegrotesk",
});

export const metadata: Metadata = {
  title: "BETOKEN",
  description: "BETOKEN: Community-based event tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetBrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TmaSDKProvider>{children}</TmaSDKProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
