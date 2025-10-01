# MESH IDE Guide

This guide walks through the workspace layout, controls, and best practices for working inside the MESH creative coding studio.

## Workspace layout

- **Header bar**: Switch between the Editor, Archive, and About pages using the menu in the top right. The header also exposes the theme toggle.
- **Editor column**: Shows the Monaco editor bound to `sketch.js`. The Redux store (`store/editorSlice.ts`) keeps the code in sync so you never lose changes during navigation.
- **Preview column**: Runs the active sketch in an embedded p5 canvas. The dock attached to the bottom of this column hosts the console and publishing tools.
- **Footer bar**: Contains five actions (run, stop, auto-run toggle, console panel, publishing panel). Hover any icon to see its tooltip.

The layout requires a desktop-class viewport (`min-width: 1024px`). On smaller screens the About page renders instead of the editor.

## Editing code

- Monaco provides syntax highlighting, bracket matching, linting, and JavaScript intellisense.
- The editor path is fixed to `sketch.js`; helper files must live inside the sketch string itself or be loaded at runtime (for example via `loadImage`).
- Use standard Monaco shortcuts: `Cmd`/`Ctrl`+`F` to find in file, `Alt`+`Arrow` to move lines, and `Cmd`/`Ctrl`+`Enter` to run the current statement in the console (when focused).
- The default sketch lives in `store/editorSlice.ts:16` and loads a glitch processing pipeline. Refreshing the page resets the editor to this preset.

## Running sketches

- **Auto-run**: Enabled by default. Any edit to the code triggers a recompile and re-run. Toggle the lightning icon in the footer to disable auto execution when debugging.
- **Manual run**: Click the play icon or press `Cmd`/`Ctrl`+`Shift`+`Enter` (Monaco's run shortcut) to execute the latest version.
- **Stop**: Use the square icon to call `noLoop()` on the current p5 instance. This is helpful when a sketch animates indefinitely.

The custom runner (`lib/p5runner.ts`) wraps your sketch in instance mode, mirrors console output, and preserves global-mode idioms such as `setup` or `draw`.

## Console and logging

- Open the console panel via the terminal icon. Logs stream from `console.log`, `console.warn`, `console.error`, and `window.onerror` through the bridge defined in `lib/consoleBridge.ts`.
- Messages are prefixed with `[log]`, `[warn]`, or `[error]` for quick scanning.
- Click **Clear** to reset the buffer. The panel remains attached to the preview column to keep logs near the canvas.

## Publishing to Bluesky

1. Run your sketch and confirm the canvas shows the frame you want to publish.
2. Open the publishing panel from the share icon. This mounts `components/BlueskyPost.tsx`.
3. Enter your Bluesky handle and an _app password_ (create one at `https://bsky.app/settings/app-passwords`).
4. Write a caption. Enable the CC-BY-SA switch if you want the helper text `#meshArchive CC-BY-SA` appended automatically.
5. Click **Publish**. The client captures the current canvas, uploads it, and posts through Bluesky's upload API.
6. Watch the inline status indicator for success or error messages.

Credentials are never persisted. Refresh the page to clear the form entirely.

## Archive view

Select **Archive** in the header to load the feed at `/api/archive`. The route aggregates recent posts tagged `#meshArchive` via Bluesky search endpoints. Infinite scroll attempts to prefetch in batches of 30. Use **Retry** if a provider throttles the request.

To enable authenticated lookup (which improves reliability), set `BLUESKY_IDENTIFIER` and `BLUESKY_APP_PASSWORD` in `.env.local` before running the dev server.

## Working with assets

- Remote assets: use `loadImage`, `loadJSON`, or other p5 loaders with full URLs. For example, `loadImage('https://picsum.photos/600')` in the default sketch.
- Local assets: place files in `public/` and reference them by path (`/assets/texture.png`). Remember that hot reloading might not trigger if the file cache persists; reload the page if necessary.
- Generated buffers such as `createGraphics` are preserved between frames. Store them in module-scope variables to maintain state, as shown with `ghostBuf` in the preset.

## Troubleshooting

- **Blank canvas**: Check the console panel for runtime errors. Syntax errors log as `[error] Unexpected identifier` with the relevant line.
- **Stuck sketch**: Click the stop icon to cancel the draw loop, or toggle auto-run off before editing heavier sketches.
- **No canvas detected for publishing**: Ensure the sketch executed at least once. If the publish form still reports `No canvas`, click **Run** to regenerate the frame.
- **Archive errors**: Missing environment variables or upstream rate limiting will show in the alert banner. Retry or open the Bluesky search link directly.

## Keyboard cheat sheet

| Action                | Shortcut                                                               |
| --------------------- | ---------------------------------------------------------------------- |
| Run sketch            | `Cmd`/`Ctrl`+`Shift`+`Enter`                                           |
| Toggle sidebar panels | Click the terminal or share icons in the footer (tooltips show labels) |
| Quick command palette | `F1` or `Cmd`/`Ctrl`+`Shift`+`P`                                       |
| Duplicate line        | `Shift`+`Alt`+`Arrow Down`                                             |
| Move line             | `Alt`+`Arrow Up/Down`                                                  |
| Multi-cursor          | `Cmd`/`Ctrl`+`Click`                                                   |

The Monaco command palette exposes many more bindings; press `F1` while focused in the editor to explore.
