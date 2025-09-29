"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Post to Bluesky</CardTitle>
        <CardDescription>Share a canvas snapshot directly to your Bluesky feed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bluesky-handle">Handle</Label>
            <Input
              id="bluesky-handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="user.bsky.social"
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bluesky-password">App password</Label>
            <Input
              id="bluesky-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="xxxx-xxxx-xxxx-xxxx"
              type="password"
              autoComplete="current-password"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bluesky-caption">Caption</Label>
          <Textarea
            id="bluesky-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="p5.js sketch snapshot"
            rows={2}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={post} className="w-full sm:w-auto">
          Post Canvas Snapshot
        </Button>
        <p className="text-xs text-muted-foreground sm:text-right">
          {status || ""}
        </p>
      </CardFooter>
      <CardContent className="pt-0">
        <p className="text-[11px] text-muted-foreground">
          Use a Bluesky <span className="font-medium">App Password</span>, not your main account
          password. Credentials are never stored.
        </p>
      </CardContent>
    </Card>
  );
}
