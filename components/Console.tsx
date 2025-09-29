"use client";

import { useEditor } from "@/context/EditorContext";

export default function Console() {
  const { logs } = useEditor();

  return (
    <div className="mt-3 p-3 rounded-xl bg-zinc-900 text-xs">
      <div className="font-semibold mb-1 text-zinc-300">Console</div>
      <pre className="whitespace-pre-wrap text-zinc-400">{logs.join("\n")}</pre>
    </div>
  );
}
