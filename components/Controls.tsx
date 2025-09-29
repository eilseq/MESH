"use client";

import { useEditor } from "@/context/EditorContext";

export default function Controls() {
  const { autoRun, toggleAutoRun, run, stop } = useEditor();

  return (
    <div className="flex items-center gap-2 mt-3">
      <label className="text-sm text-zinc-400 flex items-center gap-2">
        <input
          type="checkbox"
          className="accent-pink-500"
          checked={autoRun}
          onChange={toggleAutoRun}
        />
        Auto-run
      </label>
      <button
        onClick={() => run && run()}
        className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm"
      >
        Run ▶
      </button>
      <button
        onClick={() => stop && stop()}
        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm"
      >
        Stop ⏹
      </button>
    </div>
  );
}
