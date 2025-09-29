"use client";

import { useEditor } from "@/context/EditorContext";
import { useId } from "react";

export default function Editor() {
  const { code, setCode } = useEditor();
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        Sketch code
      </label>
      <textarea
        id={id}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-[60vh] lg:h-[75vh] rounded-xl bg-zinc-900 border border-zinc-800 p-3 font-mono text-sm outline-none"
        spellCheck={false}
      />
    </div>
  );
}
