"use client";

import { useId } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEditor } from "@/context/EditorContext";

export default function Editor() {
  const { code, setCode } = useEditor();
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="sr-only">
        Sketch code
      </Label>
      <Textarea
        id={id}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="min-h-[60vh] lg:min-h-[70vh] resize-none font-mono text-sm"
        spellCheck={false}
      />
    </div>
  );
}
