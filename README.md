# MESH Creative Coding Studio

MESH is a browser-native p5.js playground designed for collaborative, remix-driven creative coding. The workspace pairs a Monaco code editor with a live canvas, built-in console logging, and publishing tools that post sketches straight to Bluesky. An archive view aggregates every `#meshArchive` post so the community can keep riffing on each other's discoveries.

- **Zero-setup studio**: open the editor, tweak the sketch, and see the canvas update instantly thanks to a custom p5 runner.
- **Creative remix kit**: start from the included glitch preset or load your own assets, iterate with auto-run, and capture happy accidents.
- **Publishing pipeline**: push the output canvas to Bluesky without leaving the app; add CC-BY-SA licensing in one switch.
- **Community archive**: explore the live feed of `#meshArchive` experiments pulled from Bluesky and documented for future zines.
- **Thoughtful UX**: responsive layout, theme toggle, keyboard-friendly controls, and console mirroring for easy debugging.

## Getting started (development)

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to open the workspace.

### Prerequisites

- Node.js 22.x (enforced via the repository's Volta pin)
- pnpm 9+

### Environment variables

Create a `.env.local` file to enable the archive feed to authenticate against Bluesky's APIs:

```ini
BLUESKY_IDENTIFIER=you.bsky.social
BLUESKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

Without these values the archive will gracefully degrade, but authenticated credentials improve reliability. Use a Bluesky _app password_, not your main login.

## Development workflow

- `pnpm dev`: install dependencies (idempotent) and launch the Next.js development server
- `pnpm build`: create an optimized production build
- `pnpm start`: build and run the production server
- `pnpm lint`: run ESLint with the Next.js config

Recommended flow:

1. `pnpm install`
2. Create a feature branch
3. Build or run locally (`pnpm dev`)
4. Run `pnpm lint` (and any manual smoke tests) before opening a pull request

We run a zero-trust policy for credentials. Never commit `.env*` files or hard-coded secrets.

## Architecture overview

| Path          | Purpose                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `app/`        | Next.js routes, including the editor workspace (`page.tsx`) and archive API.                           |
| `components/` | UI building blocks: Monaco editor wrapper, canvas, console, Bluesky form, and shared workspace shells. |
| `hooks/`      | Client hooks: `useEditor` exposes Redux-backed editor state; `useP5` wraps the custom runner.          |
| `lib/`        | Platform utilities: theme helpers, Bluesky client, console bridge, and the `P5Runner`.                 |
| `store/`      | Redux store configuration and slice powering the editor.                                               |
| `docs/`       | End-user documentation published via GitHub Pages.                                                     |

Key files to know:

- `store/editorSlice.ts`: default sketch source and editor state machine
- `lib/p5runner.ts`: wraps p5 instance mode, handling logs and error reporting
- `components/Canvas.tsx`: binds the runner to the live preview
- `app/api/archive/route.ts`: serverless route that fetches `#meshArchive` posts

## Quality gates

- `pnpm lint`: ensure ESLint passes before pushing
- Manual smoke test: verify the editor runs and the preview responds to changes
- Optional: capture canvas screenshots or screen recordings for UI-focused PRs

## Documentation for users

End-user documentation lives in `docs/`, which can be published with GitHub Pages (`Settings -> Pages -> Source: Deploy from docs/`). The entry point is [`docs/index.md`](docs/index.md), which links to:

- [`docs/ide-guide.md`](docs/ide-guide.md): interface tour, shortcuts, troubleshooting
- [`docs/creative-remix-playbook.md`](docs/creative-remix-playbook.md): remix methodology
- [`docs/tutorials/01-remix-the-glitch-preset.md`](docs/tutorials/01-remix-the-glitch-preset.md): guided preset remix
- [`docs/tutorials/02-live-interaction.md`](docs/tutorials/02-live-interaction.md): animate and perform a sketch
- [`docs/tutorials/03-dynamic-controls.md`](docs/tutorials/03-dynamic-controls.md): build keyboard and pointer controls
- [`docs/tutorials/04-archive-ready-export.md`](docs/tutorials/04-archive-ready-export.md): manage Picsum feeds and custom image assets

When GitHub Pages is enabled, share the published URL (for example `https://<org>.github.io/mesh/`) with participants and link it from community announcements.

## Contributing

- Fork or branch from `main`
- Follow the development workflow above
- Submit a pull request with context, screenshots when visual changes apply, and links to any relevant GitHub Pages updates
- Ensure automated checks pass before requesting review
