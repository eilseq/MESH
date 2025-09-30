# Tutorial 04: Curate Online Source Images

This tutorial assumes you are using the hosted MESH editor in the browser. You will learn how to control Picsum seeds, curate a reusable image set, and load your own online assets without touching the project filesystem.

## 1. Inspect the default image loader

Open the editor and look near the top of the sketch for:

```js
img = loadImage('https://picsum.photos/600');
```

The Picsum service returns a random square photo every time the URL is requested. That is perfect for quick experiments, but it can make it hard to reproduce a remix later.

## 2. Lock Picsum to a specific seed

Update the `loadImage` call so the URL contains a seed. All edits happen in the browser editor.

```js
const picsumSeed = 'mesh-zine-01';
const picsumSize = 600;
img = loadImage(`https://picsum.photos/seed/${picsumSeed}/${picsumSize}/${picsumSize}`);
```

Refreshing or rerunning the sketch now pulls the same photo. Change `picsumSeed` whenever you want a new base image. Add `console.log('seed', picsumSeed);` so friends can recreate your setup.

### Optional Picsum tweaks

Append query parameters directly in the template string:

```js
`https://picsum.photos/seed/${picsumSeed}/${picsumSize}/${picsumSize}?grayscale&blur=2`
```

## 3. Cycle through a curated seed list

Keep a short array of meaningful seeds and switch between them with a key press.

```js
const picsumSeeds = ['mesh-neon', 'mesh-dust', 'mesh-forest'];
let seedIndex = 0;

function preload() {
  loadSeed(seedIndex);
}

function keyPressed() {
  if (key === 'n') {
    seedIndex = (seedIndex + 1) % picsumSeeds.length;
    loadSeed(seedIndex);
  }
}

function loadSeed(index) {
  const seed = picsumSeeds[index];
  loadImage(`https://picsum.photos/seed/${seed}/600/600`, (next) => {
    img = next;
    redraw();
    console.log('Loaded seed', seed);
  });
}
```

Press `n` to move through the set. The console log doubles as a session journal.

## 4. Use your own online images

If you want to work from personal material, upload the files to an image host (for example, an S3 bucket, Supabase storage, Dropbox direct link, or an artist portfolio site) and copy the direct URL. Then load it from within the editor.

```js
const sources = [
  'https://example-bucket.s3.amazonaws.com/mesh/collage-01.jpg',
  'https://example-bucket.s3.amazonaws.com/mesh/collage-02.jpg',
];
let sourceIndex = 0;

function preload() {
  loadSource(sourceIndex);
}

function keyPressed() {
  if (key === 'm') {
    sourceIndex = (sourceIndex + 1) % sources.length;
    loadSource(sourceIndex);
  }
}

function loadSource(index) {
  loadImage(sources[index], (next) => {
    img = next;
    redraw();
    console.log('Loaded custom asset', sources[index]);
  }, (err) => {
    console.error('Failed to load asset', sources[index], err);
  });
}
```

Make sure the host serves the image over HTTPS and allows hotlinking. Some providers require you to create expiring signed URLs instead of public links.

### Quick way to host a single file

- Drag the image into a GitHub gist, Dropbox, or another service that returns a raw image URL.
- Copy the URL and drop it into the `sources` array.
- If the provider gives you a preview URL that ends with query parameters, look for a `raw` link or the `?raw=1` variant so `loadImage` receives the binary file.

## 5. Reference Bluesky uploads

Already sharing work on Bluesky? Each post attachment is hosted on a stable CDN. Right click the image in your post, copy the image address, and paste that URL into the `sources` array. This is a quick way to remix a previous frame inside MESH.

## 6. Track attribution

Keep metadata next to your code so licensing details travel with the sketch.

```js
const metadata = {
  source: sources[sourceIndex],
  author: '@your-handle',
  license: 'CC-BY-SA',
};

console.log('Source metadata', metadata);
```

Mention credit and licensing in any Bluesky caption you publish through the share panel.

## 7. Troubleshooting remote images

- **CORS error in the console**: the host does not allow cross-origin requests. Re-upload the image somewhere that sets permissive headers or uses a signed URL feature.
- **404 or 403**: double check that the link points directly to the file and, if needed, refresh the signed URL token.
- **Slow loading**: use `loadImage(url, success, error);` with callbacks (as in the snippets above) so you can display placeholders or retry gracefully.

With a reliable image source strategy, you can build collections of seeds or personal assets entirely from the browser and keep your remixes reproducible for everyone visiting the hosted MESH editor.
