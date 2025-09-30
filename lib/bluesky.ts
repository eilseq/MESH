// Minimal Bluesky client used by a hook/component. Lives in lib, not the UI.

export type BlueskySession = { accessJwt: string; did: string };

export class BlueskyClient {
  private session: BlueskySession | null = null;
  static readonly HASHTAG_REGEX = /#[A-Za-z0-9_]+/g;

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

  async createPost(did: string, record: Record<string, unknown>) {
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

  async postImageFromCanvas(canvas: HTMLCanvasElement, text = "MESH Archive") {
    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b!), "image/png")
    );
    const { blob: uploaded } = await this.uploadBlob(blob);
    const { did } = this.requireSession();

    const record = {
      $type: "app.bsky.feed.post",
      createdAt: new Date().toISOString(),
      text,
      ...buildFacetField(text),
      embed: {
        $type: "app.bsky.embed.images",
        images: [{ image: uploaded, alt: "MESH Archive" }],
      },
    };

    return this.createPost(did, record);
  }
}

function buildFacetField(text: string) {
  const facets = buildHashtagFacets(text);
  return facets.length > 0 ? { facets } : {};
}

function buildHashtagFacets(text: string) {
  const matches = Array.from(text.matchAll(BlueskyClient.HASHTAG_REGEX));
  if (matches.length === 0) return [];

  const encoder = new TextEncoder();

  return matches
    .map((match) => {
      const hashtag = match[0];
      const tag = hashtag.slice(1);
      if (!tag) return null;

      const textBefore = text.slice(0, match.index);
      const byteStart = encoder.encode(textBefore).length;
      const byteEnd = byteStart + encoder.encode(hashtag).length;

      return {
        $type: "app.bsky.richtext.facet",
        features: [
          {
            $type: "app.bsky.richtext.facet#tag",
            tag,
          },
        ],
        index: {
          byteStart,
          byteEnd,
        },
      };
    })
    .filter(
      (
        value
      ): value is {
        $type: "app.bsky.richtext.facet";
        features: { $type: string; tag: string }[];
        index: { byteStart: number; byteEnd: number };
      } => value !== null
    );
}
