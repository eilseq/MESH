"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEditor } from "@/context/EditorContext";
import { BlueskyClient } from "@/lib/bluesky";
import { Switch } from "@/components/ui/switch";
import {
  DockPanel,
  DockPanelContent,
  DockForm,
  DockFormGrid,
  DockFormField,
  DockFormFooter,
  DockFormStatus,
  DockFormNote,
} from "@/components/ui/dock-panel";
import Link from "next/link";

const LICENSE_SUFFIX = "#meshArchive CC-BY-SA";

const ensureLicenseSuffix = (text: string) => {
  const trimmed = text.replace(/\s+$/g, "");
  if (!trimmed) {
    return LICENSE_SUFFIX;
  }
  if (trimmed.endsWith(LICENSE_SUFFIX)) {
    return trimmed;
  }
  return `${trimmed} ${LICENSE_SUFFIX}`;
};

const stripLicenseSuffix = (text: string) => {
  const trimmed = text.replace(/\s+$/g, "");
  if (!trimmed.endsWith(LICENSE_SUFFIX)) {
    return text;
  }
  const withoutSuffix = trimmed.slice(
    0,
    trimmed.length - LICENSE_SUFFIX.length
  );
  return withoutSuffix.replace(/\s+$/g, "");
};

export default function BlueskyPost() {
  const { canvas } = useEditor();
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("");
  const [includeLicense, setIncludeLicense] = useState(false);

  const handleCaptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setCaption(includeLicense ? ensureLicenseSuffix(value) : value);
  };

  const handleLicenseToggle = (checked: boolean) => {
    setIncludeLicense(checked);
    setCaption((prev) =>
      checked ? ensureLicenseSuffix(prev) : stripLicenseSuffix(prev)
    );
  };

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
      const captionToPost = includeLicense
        ? ensureLicenseSuffix(caption)
        : caption;
      await client.postImageFromCanvas(canvas, captionToPost);

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
              <Label htmlFor="bluesky-password">App Password</Label>
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
              onChange={handleCaptionChange}
              placeholder="Post on Bluesky with caption using the tag #meshArchive to submit artwork..."
              rows={3}
            />
          </DockFormField>
          <DockFormFooter>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button onClick={post}>Publish</Button>
              <div className="flex items-center gap-2">
                <Switch
                  id="bluesky-license-toggle"
                  checked={includeLicense}
                  onCheckedChange={handleLicenseToggle}
                  aria-label="Toggle CC-BY-SA license"
                />
                <Label
                  htmlFor="bluesky-license-toggle"
                  className="text-xs sm:text-sm font-normal leading-tight text-muted-foreground"
                >
                  Add{" "}
                  <Link
                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                    className="underline hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    CC-BY-SA
                  </Link>{" "}
                  license to apply for{" "}
                  <Link href="#about" className="underline hover:text-primary">
                    MESH Zine
                  </Link>
                </Label>
              </div>
            </div>
            <DockFormStatus>{status || ""}</DockFormStatus>
          </DockFormFooter>
          <DockFormNote>
            We recommend use a Bluesky
            <Link
              href="https://bsky.app/settings/app-passwords"
              className="ml-1 underline hover:text-primary"
              target="_blank"
              rel="noreferrer"
            >
              App Password
            </Link>
            , not your main account password. Credentials are never stored.
          </DockFormNote>
        </DockForm>
      </DockPanelContent>
    </DockPanel>
  );
}
