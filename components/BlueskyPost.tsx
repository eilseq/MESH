"use client";

import { useState } from "react";
import { useEditor } from "@/context/EditorContext";
import { BlueskyClient } from "@/lib/bluesky";

export default function BlueskyPost() {
  const { canvas } = useEditor();
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [caption, setCaption] = useState("p5.js sketch snapshot");
  const [status, setStatus] = useState("");

  async function post() {
    try {
      if (!canvas) {
        setStatus("❌ No canvas to capture.");
        return;
      }
      setStatus("🔑 Logging in…");
      const client = new BlueskyClient();
      const { did } = await client.login(handle.trim(), password.trim());

      setStatus("⬆️ Uploading & posting…");
      await client.postImageFromCanvas(canvas, caption);

      setStatus("✅ Posted to Bluesky!");
    } catch (e: any) {
      setStatus(`❌ ${e?.message || e}`);
    }
  }

  return (
    <div>
      <div className="font-semibold mb-2 text-zinc-300">Post to Bluesky</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="Handle (e.g. user.bsky.social)"
          className="px-3 py-2 rounded bg-zinc-800 text-sm outline-none"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="App Password"
          type="password"
          className="px-3 py-2 rounded bg-zinc-800 text-sm outline-none"
        />
      </div>
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption"
        className="w-full mt-2 px-3 py-2 rounded bg-zinc-800 text-sm outline-none"
      />
      <button
        onClick={post}
        className="mt-2 w-full px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm"
      >
        Post Canvas Snapshot
      </button>
      <p className="text-xs text-zinc-400 mt-2">{status}</p>
      <p className="text-[10px] text-zinc-500 mt-1">
        Use a Bluesky <em>App Password</em>, not your main account password.
        Credentials are not stored.
      </p>
    </div>
  );
}
