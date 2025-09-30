# Tutorial 02: Animate and Perform a Sketch

Transform the static glitch preset into a live piece that responds to time and pointer movement.

## 1. Prepare the canvas for animation

1. In `setup()`, remove `noLoop();` or comment it out so p5 keeps calling `draw()`.
2. At the top of the file, add a flag that lets you pause later:

   ```js
   let isFrozen = false;
   ```

3. Inside `draw()`, exit early when frozen:

   ```js
   if (isFrozen) {
     image(img, 0, 0);
     return;
   }
   ```

Now the sketch continuously refreshes, ready for dynamic effects.

## 2. Add frame-driven modulation

1. Before iterating over `config.effectChain`, stash `frameCount` into a helper:

   ```js
   const t = frameCount * 0.02;
   ```

2. Replace the `rgbOffset` parameters with animated values:

   ```js
   { name:'rgbOffset', params:{
       maxOffset: 10 + sin(t) * 8,
       alpha: 120 + sin(t * 0.5) * 60
   } },
   ```

3. Adjust `noise` strength over time:

   ```js
   { name:'noise', params:{ strength: 10 + abs(sin(t * 1.8)) * 25 } },
   ```

The image now breathes, wobbling in sync with the time variable.

## 3. Respond to pointer movement

1. Add a module-scope variable for mouse influence:

   ```js
   let pointerShift = 0;
   ```

2. Implement `mouseMoved()` (or `touchMoved()` for trackpads):

   ```js
   function mouseMoved() {
     pointerShift = map(mouseX, 0, width, 0, 40);
   }
   ```

3. Feed `pointerShift` into the slice effects:

   ```js
   { name:'hSliceShift', params:{ bands: 16, maxShift: 15 + pointerShift } },
   { name:'vSliceTear', params:{ slices: 8, maxShift: 8 + pointerShift * 0.6 } },
   ```

Sweeping across the canvas now intensifies the tearing.

## 4. Toggle performance modes from the keyboard

1. Add a `keyPressed()` handler:

   ```js
   function keyPressed() {
     if (key === ' ') {
       isFrozen = !isFrozen;
       if (!isFrozen) {
         loop();
       } else {
         noLoop();
       }
     }
     if (key === 's') {
       saveCanvas('mesh-frame', 'png');
     }
   }
   ```

2. With this in place, tap the space bar to freeze and resume. Press `s` to save a PNG snapshot locally.

## 5. Clean up the ghost buffer

Because the ghosting effect relies on storing previous frames, add a reset when unfreezing:

```js
if (!isFrozen) {
  ghostBuf.clear();
  loop();
}
```

Call this snippet right after toggling `isFrozen` to prevent stale trails when resuming.

## 6. Rehearse the performance

- Disable auto-run; you now control timing through the keyboard.
- Practice a sequence: tweak the pointer to push the slice offsets, freeze, adjust parameters, unfreeze, repeat.
- Consider assigning each major variation to a caption in the console so you can document the show later.

## 7. Publish a highlight frame

When you capture a compelling moment with the `s` shortcut, open the share panel and post the most striking still to Bluesky. Note the live performance context in the caption so viewers know it is part of a moving piece.

You now have a sketch that can be performed in real time during workshops or streaming sessions.
