"use client";

import { useId } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldStack } from "@/components/ui/field";
import { useEditor } from "@/context/EditorContext";

export default function Editor() {
  const { code, setCode } = useEditor();
  const id = useId();

  return (
    <FieldStack gap="sm" grow>
      <Label htmlFor={id} variant="srOnly">
        Sketch code
      </Label>
      <Textarea
        id={id}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        size="grow"
        spellCheck={false}
      />
    </FieldStack>
  );
}
