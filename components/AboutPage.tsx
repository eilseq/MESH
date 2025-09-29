import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-3xl space-y-8 px-6 py-12 text-sm md:text-base">
      <div className="space-y-3 md:space-y-4">
        <Badge
          variant="secondary"
          className="rounded-full px-3 py-1 text-xs uppercase tracking-wide"
        >
          <Link
            href="https://eilseq.com"
            className="ml-1 underline hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            A project by EILSEQ
          </Link>
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl text-left">
          Collective Archive for Creative Coding
        </h1>
        <p className="text-muted-foreground md:text-lg text-left">
          MESH is a browser-based p5.js studio that welcomes artists to bend
          pixels, remix sketches, and share results to build a corpus of works.
          This editor pairs creative coding with intentional community
          publishing.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Why MESH exists</h2>
          <p className="text-muted-foreground">
            We built MESH for artists who thrive in constraint. The editor loads
            a curated p5.js environment and example sketches so you can start
            glitching photographs, remixing each other's code, or writing
            generative systems from scratch without leaving the browser.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">
            Made for shared experimentation
          </h2>
          <p className="text-muted-foreground">
            Every session is an invitation to iterate together. Swap snippets,
            fork workflows, and lean into accidents&mdash;the goal is to surface
            new textures through a collective process rather than polished final
            pieces.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/20 p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Archive in motion</h2>
        <p className="text-muted-foreground">
          Finished sketches and happy accidents alike can be published straight
          to Bluesky. Tag your post with{" "}
          <span className="font-mono text-xs uppercase tracking-wide">
            #meshArchive
          </span>{" "}
          to drop it into the shared feed. Our collective curates each wave of
          uploads into a printed zine series, celebrating the latest rhythms
          emerging from the archive with respect for the identity and
          individuality of each work.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Your next move</h2>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            Load one of the starter sketches and push it until it breaks in a
            beautiful way.
          </li>
          <li>Swap in a found image and explore glitch-driven textures.</li>
          <li>
            Share your experiment on Bluesky with{" "}
            <span className="font-mono text-xs uppercase tracking-wide">
              #meshArchive
            </span>
            .
          </li>
          <li>
            Check back when the next SSH zine drops to see the latest printed
            collection.
          </li>
        </ul>
      </div>
    </section>
  );
}
