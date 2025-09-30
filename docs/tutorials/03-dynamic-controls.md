# Tutorial 03: Build Live Controls

Create a controllable version of the glitch sketch by wiring keyboard shortcuts and lightweight UI overlays. The goal is to nudge parameters in real time without digging back into the code each time.

## 1. Define a control state object

1. Near the top of the sketch add a `controls` object and expose it on `window` for debugging:

   ```js
   const controls = {
     pixelateSize: 24,
     rgbOffsetMax: 12,
     noiseStrength: 18,
     showHud: true,
   };
   window.controls = controls;
   ```

2. Replace hard-coded values with references to `controls`. Example:

   ```js
   { name:'pixelate', params:{ size: controls.pixelateSize } },
   { name:'rgbOffset', params:{ maxOffset: controls.rgbOffsetMax, alpha: 140 } },
   { name:'noise', params:{ strength: controls.noiseStrength } },
   ```

## 2. Add keyboard shortcuts for parameter nudges

1. Implement `keyPressed()` and listen for sensible keys:

   ```js
   function keyPressed() {
     if (key === '1') controls.pixelateSize = max(4, controls.pixelateSize - 4);
     if (key === '2') controls.pixelateSize += 4;
     if (key === '3') controls.rgbOffsetMax = max(0, controls.rgbOffsetMax - 2);
     if (key === '4') controls.rgbOffsetMax += 2;
     if (key === '5') controls.noiseStrength = max(0, controls.noiseStrength - 2);
     if (key === '6') controls.noiseStrength += 2;
     if (key === 'H' || key === 'h') controls.showHud = !controls.showHud;
     redraw();
   }
   ```

2. Remove `noLoop()` in `setup()` or call `redraw()` explicitly (as shown) so the canvas refreshes when parameters change.

## 3. Render a heads-up display (HUD)

1. After applying the effect chain in `draw()`, overlay the current settings:

   ```js
   if (controls.showHud) {
     push();
     fill(0, 160);
     rect(12, 12, 220, 90, 12);
     fill(255);
     textSize(12);
     textAlign(LEFT, TOP);
     const lines = [
       `Pixelate: ${controls.pixelateSize}`,
       `RGB Offset: ${controls.rgbOffsetMax}`,
       `Noise: ${controls.noiseStrength}`,
       '1/2,3/4,5/6 adjust params',
       'H toggles HUD',
     ];
     lines.forEach((line, idx) => text(line, 24, 24 + idx * 16));
     pop();
   }
   ```

2. Use `push()`/`pop()` to avoid leaking text styling into the rest of the sketch.

## 4. Persist custom settings between runs

1. Before exporting or sharing, capture the current configuration with `console.log('controls', JSON.stringify(controls));`.
2. Copy the JSON output into a new constant:

   ```js
   const savedPreset = { pixelateSize: 12, rgbOffsetMax: 18, noiseStrength: 28 };
   Object.assign(controls, savedPreset);
   ```

3. On load, the sketch uses your saved numbers. Keep the log in the console for future sessions.

## 5. Optional: mouse drag for continuous control

1. Track horizontal drag distance while the mouse button is held:

   ```js
   let dragStartX = null;

   function mousePressed() {
     dragStartX = mouseX;
   }

   function mouseDragged() {
     if (dragStartX !== null) {
       const delta = mouseX - dragStartX;
       controls.rgbOffsetMax = constrain(12 + delta * 0.05, 0, 40);
       redraw();
     }
   }

   function mouseReleased() {
     dragStartX = null;
   }
   ```

2. This gives you an intuitive slider mapped to the canvas width.

You now have a sketch that behaves like a mini instrument - quick tweaks happen through both keys and pointer gestures. Capture settings in console logs so collaborators can replay your performance.
