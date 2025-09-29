import { NextResponse } from "next/server";

const HASHTAG_QUERY = "#meshArchive";
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 50;

const IDENTIFIER = process.env.BLUESKY_IDENTIFIER;
const APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD;

const LEXICON_ENDPOINTS = [
  "https://bsky.social/xrpc/app.bsky.feed.searchPosts",
  "https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts",
] as const;

const SEARCH_API_ENDPOINT =
  "https://search.bsky.social/api/v1/search/posts";

const COMMON_HEADERS = {
  Accept: "application/json",
  "User-Agent":
    "Mozilla/5.0 (compatible; MeshArchiveBot/1.0; +https://github.com/eilseq/p5js-editor)",
} as const;

type SearchPostsResponse = {
  cursor?: string;
  posts?: unknown[];
};

type SearchApiResponse = {
  cursor?: string;
  hits?: unknown[];
};

type BlueskyPostView = {
  uri: string;
  cid: string;
  author: {
    handle: string;
    displayName?: string;
    avatar?: string;
    [key: string]: unknown;
  };
  record: Record<string, unknown>;
  embed?: unknown;
  indexedAt?: string;
  [key: string]: unknown;
};

type ProviderResult = {
  posts: BlueskyPostView[];
  cursor: string | null;
};

type ErrorResponse = {
  error: string;
  details?: string;
};

type Provider = {
  name: string;
  buildUrl: (limit: number, cursor?: string) => URL;
  transform: (data: unknown) => ProviderResult;
  requiresAuth?: boolean;
};

type BlueskySession = {
  accessJwt: string;
  did: string;
  expiresAt: number;
};

let sessionCache: BlueskySession | null = null;

const PROVIDERS: Provider[] = [
  ...LEXICON_ENDPOINTS.map((endpoint) => ({
    name: endpoint,
    requiresAuth: endpoint.startsWith("https://bsky.social"),
    buildUrl: (limit: number, cursor?: string) => {
      const url = new URL(endpoint);
      url.searchParams.set("q", HASHTAG_QUERY);
      url.searchParams.set("limit", String(limit));
      if (cursor) {
        url.searchParams.set("cursor", cursor);
      }
      return url;
    },
    transform: (data: unknown): ProviderResult => {
      const typed = data as SearchPostsResponse;
      const posts = (Array.isArray(typed.posts) ? typed.posts : []).filter(
        isBlueskyPostView
      );
      const cursor = typeof typed.cursor === "string" ? typed.cursor : null;
      return { posts, cursor };
    },
  })),
  {
    name: SEARCH_API_ENDPOINT,
    buildUrl: (limit: number, cursor?: string) => {
      const url = new URL(SEARCH_API_ENDPOINT);
      url.searchParams.set("q", HASHTAG_QUERY);
      url.searchParams.set("sort", "latest");
      url.searchParams.set("count", String(limit));
      if (cursor) {
        url.searchParams.set("cursor", cursor);
      }
      return url;
    },
    transform: (data: unknown): ProviderResult => {
      const typed = data as SearchApiResponse;
      const hits = Array.isArray(typed.hits) ? typed.hits : [];
      const posts = hits
        .map(extractPostFromSearchHit)
        .filter(isBlueskyPostView);
      const cursor = typeof typed.cursor === "string" ? typed.cursor : null;
      return { posts, cursor };
    },
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const limitParam = Number.parseInt(searchParams.get("limit") ?? "", 10);
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  const errors: { status: number; body: string; provider: string }[] = [];

  for (const provider of PROVIDERS) {
    let attempt = 0;
    const maxAttempts = provider.requiresAuth ? 2 : 1;

    while (attempt < maxAttempts) {
      attempt += 1;

      try {
        const url = provider.buildUrl(limit, cursor);
        const init = await buildRequestInit(provider);
        const response = await fetch(url.toString(), init);

        if (!response.ok) {
          const details = await safeReadText(response);

          if (
            provider.requiresAuth &&
            attempt < maxAttempts &&
            shouldInvalidateSession(response.status)
          ) {
            invalidateSession();
            continue;
          }

          errors.push({
            status: response.status,
            body: details,
            provider: provider.name,
          });
          break;
        }

        const data = await response.json();
        const { posts, cursor: nextCursor } = provider.transform(data);

        return NextResponse.json(
          {
            cursor: nextCursor,
            posts,
          },
          { headers: { "Cache-Control": "no-store" } }
        );
      } catch (error) {
        if (provider.requiresAuth && attempt < maxAttempts) {
          invalidateSession();
          continue;
        }

        errors.push({
          status: 502,
          body:
            error instanceof Error
              ? error.message
              : "Unknown provider failure",
          provider: provider.name,
        });
        break;
      }
    }
  }

  const lastError = errors[errors.length - 1];
  const body: ErrorResponse = {
    error: "Failed to retrieve archive posts",
    details: formatErrorDetails(errors),
  };
  const status = lastError?.status ?? 502;
  return NextResponse.json(body, { status });
}

function extractPostFromSearchHit(hit: unknown): BlueskyPostView | null {
  if (!hit || typeof hit !== "object") return null;
  const value = (hit as Record<string, unknown>).post ??
    (hit as Record<string, unknown>).value ??
    hit;
  return isBlueskyPostView(value) ? value : null;
}

function isBlueskyPostView(value: unknown): value is BlueskyPostView {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  if (typeof data.uri !== "string" || typeof data.cid !== "string") return false;

  const author = data.author;
  if (!author || typeof author !== "object") return false;
  if (typeof (author as Record<string, unknown>).handle !== "string") return false;

  const record = data.record;
  if (!record || typeof record !== "object") return false;

  return true;
}

async function buildRequestInit(provider: Provider): Promise<RequestInit> {
  const headers = new Headers(COMMON_HEADERS);

  if (provider.requiresAuth) {
    const session = await ensureSession();
    headers.set("Authorization", `Bearer ${session.accessJwt}`);
  }

  return {
    headers,
    cache: "no-store",
  };
}

async function ensureSession(): Promise<BlueskySession> {
  if (!IDENTIFIER || !APP_PASSWORD) {
    throw new Error(
      "Missing BLUESKY_IDENTIFIER or BLUESKY_APP_PASSWORD environment variables"
    );
  }

  if (sessionCache && sessionCache.expiresAt > Date.now()) {
    return sessionCache;
  }

  const response = await fetch(
    "https://bsky.social/xrpc/com.atproto.server.createSession",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...COMMON_HEADERS,
      },
      body: JSON.stringify({ identifier: IDENTIFIER, password: APP_PASSWORD }),
    }
  );

  if (!response.ok) {
    const details = await safeReadText(response);
    throw new Error(`Session creation failed (${response.status}): ${details}`);
  }

  const data = (await response.json()) as {
    accessJwt: string;
    did: string;
    expiresAt?: string;
  };

  const ttl = data.expiresAt ? Date.parse(data.expiresAt) - Date.now() : null;
  const expiresAt = Date.now() + (ttl && Number.isFinite(ttl) ? ttl : 1000 * 60 * 30);

  sessionCache = {
    accessJwt: data.accessJwt,
    did: data.did,
    expiresAt,
  };

  return sessionCache;
}

function invalidateSession() {
  sessionCache = null;
}

function shouldInvalidateSession(status: number) {
  return status === 401 || status === 403 || status === 404;
}

async function safeReadText(response: Response) {
  try {
    return await response.text();
  } catch (error) {
    return error instanceof Error ? error.message : "";
  }
}

function formatErrorDetails(errors: { status: number; body: string; provider: string }[]) {
  return errors
    .map(({ status, body, provider }) =>
      `provider=${provider}; status=${status}; body=${truncate(body, 200)}`
    )
    .join(" | ");
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}…`;
}
