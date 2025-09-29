"use client";

import { EditorProvider } from "@/context/EditorContext";
import Editor from "@/components/Editor";
import Canvas from "@/components/Canvas";
import Controls from "@/components/Controls";
import Console from "@/components/Console";
import BlueskyPost from "@/components/BlueskyPost";

export default function Page() {
  return (
    <EditorProvider>
      <main className="grid lg:grid-cols-2 gap-4 p-4 lg:p-6">
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-zinc-400">sketch.js</h2>
            <span className="text-xs text-zinc-500">Autosave</span>
          </div>
          <Editor />
          <p className="mt-2 text-xs text-zinc-500">
            Tip: code is auto-saved in your browser.
          </p>
        </section>
        <section>
          <Canvas />
          <Controls />
          <Console />
          <div className="mt-3 p-3 rounded-xl bg-zinc-900">
            <BlueskyPost />
          </div>
        </section>
      </main>
    </EditorProvider>
  );
}
