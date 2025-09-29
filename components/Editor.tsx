"use client";

import { useCallback, useId } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";

import { Label } from "@/components/ui/label";
import { FieldStack } from "@/components/ui/field";
import { useEditor } from "@/context/EditorContext";

export default function Editor() {
  const { code, setCode } = useEditor();
  const baseId = useId();
  const labelId = `${baseId}-label`;

  const handleChange = useCallback(
    (value?: string) => {
      setCode(value ?? "");
    },
    [setCode]
  );

  return (
    <FieldStack gap="sm" grow>
      <Label id={labelId} variant="srOnly">
        Sketch code
      </Label>
      <div
        id={baseId}
        aria-labelledby={labelId}
        className="flex min-h-0 flex-1 overflow-hidden pt-2 border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <MonacoEditor
          path="sketch.js"
          language="javascript"
          value={code}
          onChange={handleChange}
          options={{
            ariaLabel: "Sketch code editor",
            automaticLayout: true,
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            wordWrap: "on",
          }}
          theme="vs-light"
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
