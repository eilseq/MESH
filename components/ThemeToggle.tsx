"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  THEME_CHANGE_EVENT,
  applyTheme,
  determineInitialTheme,
  getDocumentTheme,
  type ThemePreference,
} from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>(() => "dark");

  useEffect(() => {
    const initial = getDocumentTheme();
    setTheme(initial);

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme?: ThemePreference }>;
      const detailTheme = customEvent.detail?.theme;
      setTheme(detailTheme ?? getDocumentTheme());
    };

    window.addEventListener(THEME_CHANGE_EVENT, handler);

    // ensure class/ls matches stored preference
    const preferred = determineInitialTheme();
    if (preferred !== initial) {
      applyTheme(preferred);
    }

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handler);
    };
  }, []);

  const handleToggle = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  };

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleToggle}
          aria-label={label}
          aria-pressed={isDark}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
