# Creative Remix Playbook

This playbook outlines a repeatable process for remixing the bundled glitch sketch and crafting new pieces inside MESH. Adapt the steps to suit your own prompts, collaborators, or exhibition deadlines.

## 1. Read the preset

Start by skimming the preset definitions in `store/editorSlice.ts:16`:

- `preset.effectChain` is an ordered list of filters executed in `draw()`.
- `effectFunctions` contains the implementation for each named effect.
- The sketch pulls an image from `https://picsum.photos/600` during `preload()`.

Write a short summary of how energy flows through the chain. For example: pixelate -> split RGB -> tear slices -> add noise -> quantize -> dither -> scanlines -> ghost buffer -> invert -> posterize. The order matters; swapping items can yield radically different results.

## 2. Set an iteration goal

Pick a constraint before editing:

- **Color study**: keep structure intact but add tints, gradients, or palette swaps.
- **Motion study**: re-enable a continuous loop (remove `noLoop()`) and experiment with temporal effects like `frameCount` driven shifts.
- **Structural remix**: remove half the chain, reorder effects, or insert new ones inspired by analog texture workflows.

Document the question you want the remix to answer. Having a statement keeps the experiment from becoming noise.

## 3. Isolate parameters

Create a scratchpad near the top of the sketch:

```js
const controls = {
  pixelate: 34,
  rgbOffset: { maxOffset: 12, alpha: 110 },
  quantizeLevels: 10,
};
```

Reference this object inside the relevant effect calls. Now you can run quick parameter sweeps by editing one number at a time. Combine this with auto-run disabled so you can edit multiple knobs before triggering a render.

## 4. Fork an effect

Copy one of the functions in `effectFunctions` and rename it. For example, duplicate `scanlines` into `scanlinesWide` and adjust its loop:

```js
effectFunctions.scanlinesWide = ({ spacing, alpha }) => {
  fill(0, alpha);
  for (let y = 0; y < height; y += spacing * 2) {
    rect(0, y, width, spacing);
  }
};
```

Add the new entry to `preset.effectChain`. The runner will pick it up on the next execution because of the wrapper inside `lib/p5runner.ts` that rebinds lifecycle hooks each run.

## 5. Swap the source material

Drop a file into `public/`. Example: `public/assets/mesh-portrait.jpg`. Replace the loader call:

```js
img = loadImage('/assets/mesh-portrait.jpg');
```

If you want to audition several sources, build a small list and use keyboard input:

```js
const sources = ['/assets/a.jpg', '/assets/b.jpg'];
let sourceIndex = 0;

function keyPressed() {
  if (key === ' ') {
    sourceIndex = (sourceIndex + 1) % sources.length;
    loadImage(sources[sourceIndex], (next) => {
      img = next;
      redraw();
    });
  }
}
```

Remember to call `redraw()` if you've disabled auto-run.

## 6. Capture variations

- Use `console.log` to note parameter combos as you discover sweet spots.
- Click the share icon and publish to Bluesky with a caption that records the variation (e.g., `pixelate=24, quantize=4`).
- Tag iterated frames with `#meshArchive` so they land in the Archive page for later reference.

## 7. Reflect and package

After a session, answer these prompts to synthesize the work:

1. What did the original chain do well? Where did it resist modification?
2. Which new effect or ordering produced the biggest surprise?
3. How would you explain the remix to another artist in two sentences?
4. What reusable snippets should live in an external gist or template sketch?

Add the strongest variations to your personal library or zine submission. Keep your notes in the repository alongside the sketch so the next collaborator can trace your intent.

## 8. Reset for the next collaborator

When you are ready to hand off:

- Export or capture the final canvas.
- Clear noisy logs via the console panel.
- Decide whether to leave the remix in-place (so the next artist builds on it) or paste the original preset back into the editor.
- Write a short README entry or commit message summarizing the session.

Building this rhythm ensures MESH remains a living studio instead of a static demo.
