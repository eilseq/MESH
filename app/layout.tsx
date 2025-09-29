import "./globals.css";

import { Inter, JetBrains_Mono } from "next/font/google";

import { cn } from "@/lib/utils";
import { appBodyClass } from "@/components/ui/app-body";

export const metadata = {
  title: "p5.js Mini Editor",
  description: "Editor + live p5 canvas + Bluesky post",
};

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(appBodyClass, fontSans.variable, fontMono.variable)}>
        {children}
      </body>
    </html>
  );
}
