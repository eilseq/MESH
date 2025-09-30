"use client";

import { useCallback, useEffect, useState } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";

import { FieldStack } from "@/components/ui/field";
import { useEditor } from "@/hooks/useEditor";
import {
  THEME_CHANGE_EVENT,
  getDocumentTheme,
  type ThemePreference,
} from "@/lib/theme";

export default function Editor() {
  const { code, setCode } = useEditor();

  const [monacoTheme, setMonacoTheme] = useState(() => {
    if (typeof document !== "undefined") {
      const theme = getDocumentTheme();
      return theme === "dark" ? "vs-dark" : "vs-light";
    }
    return "vs-dark";
  });

  useEffect(() => {
    const syncTheme = () => {
      const theme = getDocumentTheme();
      setMonacoTheme(theme === "dark" ? "vs-dark" : "vs-light");
    };

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme?: ThemePreference }>;
      const next = customEvent.detail?.theme;
      if (next === "dark" || next === "light") {
        setMonacoTheme(next === "dark" ? "vs-dark" : "vs-light");
      } else {
        syncTheme();
      }
    };

    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, []);

  const handleChange = useCallback(
    (value?: string) => {
      setCode(value ?? "");
    },
    [setCode]
  );

  return (
    <FieldStack gap="sm" grow>
      <div className="flex min-h-0 flex-1 overflow-hidden pt-2 border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <MonacoEditor
          path="sketch.js"
          language="javascript"
          value={code}
          onChange={handleChange}
          options={{
            ariaLabel: "Sketch code editor",
            automaticLayout: true,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            wordWrap: "on",
          }}
          theme={monacoTheme}
          loading={
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Loading editor…
            </div>
          }
          height="100%"
          width="100%"
        />
      </div>
    </FieldStack>
  );
}
