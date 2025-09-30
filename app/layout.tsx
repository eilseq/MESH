import "./globals.css";

import { Inter, JetBrains_Mono } from "next/font/google";

import { cn } from "@/lib/utils";
import { appBodyClass } from "@/components/ui/app-body";

export const metadata = {
  title: "MESH",
  description: "Creative Coding Zine",
};

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const themeInitScript = `(() => {
  const storageKey = "p5js-editor-theme";
  const eventName = "p5js-theme-change";
  try {
    const stored = window.localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored ?? (prefersDark ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.dispatchEvent(new CustomEvent(eventName, { detail: { theme } }));
  } catch (error) {
    document.documentElement.classList.add("dark");
    window.dispatchEvent(new CustomEvent(eventName, { detail: { theme: "dark" } }));
  }
})();`;

const ignoreMonacoCancelScript = `(() => {
  const shouldIgnore = (reason) => {
    if (!reason) return false;
    if (reason === "Canceled") return true;
    if (typeof reason === "object") {
      if (reason?.message === "Canceled") return true;
      if (reason?.type === "cancelation") return true;
    }
    return false;
  };
  const handleRejection = (event) => {
    if (shouldIgnore(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  const handleError = (event) => {
    if (shouldIgnore(event.error)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  window.addEventListener("unhandledrejection", handleRejection);
  window.addEventListener("error", handleError);
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(appBodyClass, fontSans.variable, fontMono.variable)}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          dangerouslySetInnerHTML={{ __html: ignoreMonacoCancelScript }}
        />
        {children}
      </body>
    </html>
  );
}
