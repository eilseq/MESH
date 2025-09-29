// Minimal Bluesky client used by a hook/component. Lives in lib, not the UI.

export type BlueskySession = { accessJwt: string; did: string };

export class BlueskyClient {
  private session: BlueskySession | null = null;

  async login(identifier: string, password: string): Promise<BlueskySession> {
    const r = await fetch(
      "https://bsky.social/xrpc/com.atproto.server.createSession",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      }
    );
    if (!r.ok) throw new Error("Login failed");
    const { accessJwt, did } = await r.json();
    this.session = { accessJwt, did };
    return this.session;
  }

  requireSession(): BlueskySession {
    if (!this.session) throw new Error("Not logged in");
    return this.session;
  }

  async uploadBlob(blob: Blob) {
    const { accessJwt } = this.requireSession();
    const r = await fetch(
      "https://bsky.social/xrpc/com.atproto.repo.uploadBlob",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessJwt}` },
        body: blob,
      }
    );
    if (!r.ok) throw new Error("Upload failed");
    return r.json(); // { blob: { $type, ref, mimeType, size } }
  }

  async createPost(did: string, record: any) {
    const { accessJwt } = this.requireSession();
    const r = await fetch(
      "https://bsky.social/xrpc/com.atproto.repo.createRecord",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessJwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repo: did,
          collection: "app.bsky.feed.post",
          record,
        }),
      }
    );
    if (!r.ok) throw new Error("Post failed");
    return r.json();
  }

  async postImageFromCanvas(
    canvas: HTMLCanvasElement,
    text = "p5.js sketch snapshot"
  ) {
    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b!), "image/png")
    );
    const { blob: uploaded } = await this.uploadBlob(blob);
    const { did } = this.requireSession();

    const record = {
      $type: "app.bsky.feed.post",
      createdAt: new Date().toISOString(),
      text,
      embed: {
        $type: "app.bsky.embed.images",
        images: [{ image: uploaded, alt: "Canvas snapshot" }],
      },
    };

    return this.createPost(did, record);
  }
}
