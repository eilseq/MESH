"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEditor } from "@/context/EditorContext";
import { BlueskyClient } from "@/lib/bluesky";
import {
  DockPanel,
  DockPanelHeader,
  DockPanelContent,
  DockForm,
  DockFormGrid,
  DockFormField,
  DockFormFooter,
  DockFormStatus,
  DockFormNote,
} from "@/components/ui/dock-panel";

export default function BlueskyPost() {
  const { canvas } = useEditor();
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [caption, setCaption] = useState("");
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
    <DockPanel>
      <DockPanelContent>
        <DockForm className="flex flex-col justify-between p-1">
          <DockFormGrid>
            <DockFormField>
              <Label htmlFor="bluesky-handle">Handle</Label>
              <Input
                id="bluesky-handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="user.bsky.social"
                autoComplete="username"
              />
            </DockFormField>
            <DockFormField>
              <Label htmlFor="bluesky-password">App password</Label>
              <Input
                id="bluesky-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="xxxx-xxxx-xxxx-xxxx"
                type="password"
                autoComplete="current-password"
              />
            </DockFormField>
          </DockFormGrid>
          <DockFormField className="h-60">
            <Label htmlFor="bluesky-caption">Caption</Label>
            <Textarea
              id="bluesky-caption"
              className="rounded-lg border h-60"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Post on Bluesky with caption using the tag #meshArchive to submit artwork..."
              rows={3}
            />
          </DockFormField>
          <DockFormFooter>
            <Button onClick={post}>Post Canvas Snapshot</Button>
            <DockFormStatus>{status || ""}</DockFormStatus>
          </DockFormFooter>
          <DockFormNote>
            Use a Bluesky <strong>App Password</strong>, not your main account
            password. Credentials are never stored.
          </DockFormNote>
        </DockForm>
      </DockPanelContent>
    </DockPanel>
  );
}
