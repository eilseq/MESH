"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 30;

const ARCHIVE_ENDPOINT = "/api/archive";

type BlueskyAuthor = {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
};

type BlueskyRecord = {
  text?: string;
  createdAt?: string;
};

type BlueskyImage = {
  thumb?: string;
  fullsize?: string;
  alt?: string;
};

type BlueskyImageEmbed = {
  $type: "app.bsky.embed.images";
  images: BlueskyImage[];
};

type BlueskyPostView = {
  uri: string;
  cid: string;
  author: BlueskyAuthor;
  record: BlueskyRecord;
  embed?: { $type: string } | BlueskyImageEmbed;
  indexedAt?: string;
};

type ArchiveResponse = {
  cursor: string | null;
  posts: unknown[];
};

const relativeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

export default function ArchivePage() {
  const [posts, setPosts] = useState<BlueskyPostView[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [haltAutoFetch, setHaltAutoFetch] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const initialisedRef = useRef(false);

  const loadMore = useCallback(
    async ({
      source = "auto",
    }: {
      source?: "auto" | "manual";
    } = {}) => {
      if (isLoading) return;
      if (!hasMore && initialisedRef.current) return;
      if (source === "auto" && haltAutoFetch) return;

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
        if (cursor) {
          params.set("cursor", cursor);
        }

        const response = await fetch(
          `${ARCHIVE_ENDPOINT}?${params.toString()}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const data = (await response.json()) as ArchiveResponse;
        const newPosts = (Array.isArray(data.posts) ? data.posts : []).filter(
          isBlueskyPostView
        );

        setPosts((prev) => [...prev, ...newPosts]);
        setCursor(data.cursor);
        setHasMore(Boolean(data.cursor));
        if (source === "manual") {
          setHaltAutoFetch(false);
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load archive posts right now."
        );
        if (source === "auto") {
          setHaltAutoFetch(true);
        }
      } finally {
        initialisedRef.current = true;
        setIsLoading(false);
      }
    },
    [cursor, haltAutoFetch, hasMore, isLoading]
  );

  useEffect(() => {
    if (!initialisedRef.current) {
      initialisedRef.current = true;
      loadMore({ source: "auto" });
    }
  }, [loadMore]);

  useEffect(() => {
    if (!hasMore || haltAutoFetch) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore({ source: "auto" });
        }
      },
      { rootMargin: "400px 0px 400px 0px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [haltAutoFetch, hasMore, loadMore]);

  const headerCopy = useMemo(
    () => ({
      title: "MESH Feed",
      description:
        "Every Bluesky post tagged with #meshArchive lands here. Keep scrolling to explore work-in-progress sketches, glitch studies, and finished experiments from across the community.",
    }),
    []
  );

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 space-y-8">
      <header className="space-y-3">
        <Badge
          variant="secondary"
          className="rounded-full px-3 py-1 text-xs uppercase tracking-wide"
        >
          Live archive stream
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {headerCopy.title}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
          {headerCopy.description}
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load the archive.</p>
          <p className="mt-1 text-muted-foreground">
            {error}. Try again or open the feed directly on Bluesky.
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setError(null);
                setHaltAutoFetch(false);
                loadMore({ source: "manual" });
              }}
            >
              Retry loading
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a
                href="https://bsky.app/search?q=%23meshArchive"
                target="_blank"
                rel="noreferrer"
              >
                View on Bluesky
              </a>
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <ArchivePostCard key={post.cid} post={post} />
        ))}
        <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
      </div>

      <div className="flex items-center justify-center gap-3 py-8 text-sm text-muted-foreground">
        {isLoading && <span>Loading posts…</span>}
        {!isLoading && posts.length === 0 && !error && (
          <span>Archive is warming up. Check back soon.</span>
        )}
        {!isLoading && !hasMore && posts.length > 0 && (
          <span>That&apos;s everything for now.</span>
        )}
      </div>
    </section>
  );
}

function isBlueskyPostView(value: unknown): value is BlueskyPostView {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  if (typeof data.uri !== "string" || typeof data.cid !== "string")
    return false;
  const author = data.author as Record<string, unknown> | undefined;
  if (!author || typeof author.handle !== "string") return false;
  const record = data.record as Record<string, unknown> | undefined;
  if (!record || typeof record !== "object") return false;
  return true;
}

function ArchivePostCard({ post }: { post: BlueskyPostView }) {
  const { author, record, embed, indexedAt } = post;
  const createdAt = record?.createdAt ?? indexedAt ?? null;
  const images = extractImages(embed);
  const postUrl = buildPostUrl(post);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex items-start gap-3 border-b px-5 py-4">
        <Avatar author={author} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-semibold md:text-base">
              {author.displayName || `@${author.handle}`}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              @{author.handle}
            </span>
          </div>
          {createdAt && (
            <time
              dateTime={createdAt}
              className="mt-1 block text-xs text-muted-foreground"
              title={formatAbsoluteTime(createdAt)}
            >
              {formatRelativeTime(createdAt)}
            </time>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 px-5 py-4">
        {record?.text && (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {record.text}
          </p>
        )}
        {images.length > 0 && (
          <div
            className={cn(
              "grid gap-3",
              images.length > 1 ? "grid-cols-2" : "grid-cols-1"
            )}
          >
            {images.map((image, index) => (
              <img
                key={image.fullsize || image.thumb || index}
                src={image.thumb || image.fullsize}
                alt={image.alt || "Bluesky attachment"}
                loading="lazy"
                className="max-h-72 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto border-t px-5 py-3 text-xs text-muted-foreground">
        <a
          href={postUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary hover:underline"
        >
          View on Bluesky ↗
        </a>
      </div>
    </article>
  );
}

function Avatar({ author }: { author: BlueskyAuthor }) {
  const initials = (author.displayName || author.handle || "?")
    .slice(0, 2)
    .toUpperCase();

  if (author.avatar) {
    return (
      <img
        src={author.avatar}
        alt={author.displayName || author.handle}
        loading="lazy"
        className="size-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
      {initials}
    </div>
  );
}

function extractImages(embed: BlueskyPostView["embed"]) {
  if (!embed) return [] as BlueskyImage[];
  if (isImageEmbed(embed)) {
    return embed.images.filter((img) => Boolean(img.fullsize || img.thumb));
  }
  return [] as BlueskyImage[];
}

function isImageEmbed(
  embed: BlueskyPostView["embed"]
): embed is BlueskyImageEmbed {
  if (!embed || typeof embed !== "object") return false;
  if (!("$type" in embed) || embed.$type !== "app.bsky.embed.images") {
    return false;
  }
  if (!("images" in embed)) return false;
  const maybeImages = (embed as { images?: unknown }).images;
  return Array.isArray(maybeImages);
}

function buildPostUrl(post: BlueskyPostView) {
  const handle = post.author?.handle;
  if (!handle) return "https://bsky.app";
  const segments = post.uri.split("/");
  const rkey = segments[segments.length - 1];
  if (!rkey) return `https://bsky.app/profile/${handle}`;
  return `https://bsky.app/profile/${handle}/post/${rkey}`;
}

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = Date.now();
  const diff = date.getTime() - now;

  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["week", 1000 * 60 * 60 * 24 * 7],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  for (const [unit, ms] of divisions) {
    const delta = diff / ms;
    if (Math.abs(delta) >= 1) {
      return relativeFormatter.format(Math.round(delta), unit);
    }
  }

  return "just now";
}

function formatAbsoluteTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
