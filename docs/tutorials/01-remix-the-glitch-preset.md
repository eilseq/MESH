# Tutorial 01: Remix the Glitch Preset

This walkthrough guides you through modifying the built-in glitch sketch, dialing in custom parameters, and capturing a shareable frame.

## 1. Load the editor

1. Run `pnpm dev` and open `http://localhost:3000` in a desktop browser.
2. Confirm auto-run is enabled (the lightning icon in the footer is highlighted). If you prefer manual control, toggle it off now.

## 2. Reduce pixelation for finer detail

1. Locate the `pixelate` entry near the top of the sketch.
2. Change the `size` parameter from `50` to `18`:

   ```js
   { name:'pixelate', params:{ size: 18 } },
   ```

3. Run the sketch. The canvas should reveal more of the source image while retaining blocky geometry.

## 3. Reorder the RGB offset

1. Move the `{ name:'rgbOffset', ... }` line so it appears **after** the slice effects (`hSliceShift` and `vSliceTear`).
2. Re-run or allow auto-run to trigger. Offsetting after the tears preserves more texture and yields saturated overlays.

## 4. Add a custom burn-in pass

1. Scroll down to the `effectFunctions` object and append a new function definition:

   ```js
   burnIn({ alpha = 30 }) {
     blendMode(ADD);
     tint(255, 90, 0, alpha);
     image(img, 0, 0);
     noTint();
     blendMode(BLEND);
   },
   ```

2. Insert the effect into the chain right before `ghosting`:

   ```js
   { name:'burnIn', params:{ alpha: 45 } },
   { name:'ghosting', params:{ alpha:60 } },
   ```

3. Run again. The canvas now blooms with warm highlights before the ghost buffer settles the frame.

## 5. Explore quick variations

1. Disable auto-run temporarily.
2. Wrap the adjustable numbers in a `controls` object:

   ```js
   const controls = {
     pixelateSize: 18,
     burnInAlpha: 45,
     quantizeLevels: 12,
   };
   ```

3. Replace literals with the control values. Example:

   ```js
   { name:'pixelate', params:{ size: controls.pixelateSize } },
   ...
   burnIn({ alpha = controls.burnInAlpha }) {
   ```

4. Change multiple values, then click **Run** once to compare batches of variations without overloading the runner.
5. Log your favorites via `console.log('Preset A', controls);` so the console panel records them.

## 6. Capture and publish

1. When a frame resonates, open the share panel.
2. Add a caption noting the variation (e.g., `pixelate=18 burnIn=45 quantize=6`).
3. Enable the CC-BY-SA switch if you intend to submit the work to the zine.
4. Publish to Bluesky. Once the status reads `Posted`, use the provided link to view the entry live.

## 7. Save your remix

- Copy the final sketch into a new gist or commit.
- Optionally paste the remix into the editor's code block for the next collaborator.
- Jot down insights in `docs/tutorials/notes.md` (create if needed) so others can build on your approach.

You now have a personalized glitch aesthetic ready for further iteration or performance.
