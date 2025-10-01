import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type EditorControls = {
  run: () => Promise<void>;
  stop: () => void;
};

export type EditorState = {
  code: string;
  autoRun: boolean;
  logs: string[];
  canvas: HTMLCanvasElement | null;
  controls?: EditorControls;
};

const DEFAULT_SKETCH = `// @EILSEQ 2024
// Code and Assets License: https://unsplash.com/license$0

let img, ghostBuf, config;

function preload() {
  img = loadImage('https://picsum.photos/600');
};

const preset = {
    effectChain: [
      { name:'pixelate',     params:{ size: 50 } },

      { name:'rgbOffset',    params:{ maxOffset:15, alpha:150 } },
      { name:'hSliceShift',  params:{ bands:16, maxShift:30 } },
      { name:'vSliceTear',   params:{ slices:8, maxShift:20 } },
      
      { name:'noise',        params:{ strength: 15 } },
      { name:'quantize',     params:{ levels:16 } },
      { name:'dithering',    params:{} },
      { name:'scanlines',    params:{ spacing:2, alpha:30 } },
      { name:'ghosting',     params:{ alpha:60 } },

      { name:'invertColors', params:{}},
      { name:'posterize',    params:{ level: 12 }},
    ]
};

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  noStroke();
  noLoop();
  ghostBuf = createGraphics(width, height);
  ghostBuf.pixelDensity(2);
  ghostBuf.clear();

    config = preset;
    ghostBuf.clear();
    console.log('Loaded preset:', name, '->', config.effectChain.map(e=>e.name).join(' -> '));
}

const effectFunctions = {
  rgbOffset({ maxOffset, alpha }) {
    blendMode(ADD);
    tint(255,0,0,alpha); image(img, random(-maxOffset,maxOffset), random(-maxOffset,maxOffset));
    tint(0,255,0,alpha); image(img, random(-maxOffset,maxOffset), random(-maxOffset,maxOffset));
    tint(0,0,255,alpha); image(img, random(-maxOffset,maxOffset), random(-maxOffset,maxOffset));
    noTint(); blendMode(BLEND);
  },
  hSliceShift({ bands, maxShift }) {
    const h = height/bands;
    for (let i=0; i<bands; i++){
      let y0 = i*h + random(-h*0.3, h*0.3);
      copy(0,y0,width,h, random(-maxShift,maxShift), i*h, width,h);
    }
  },
  vSliceTear({ slices, maxShift }) {
    const w = width/slices;
    for (let i=0; i<slices; i++){
      let x0 = i*w + random(-w*0.3,w*0.3);
      copy(x0,0,w,height, i*w, random(-maxShift,maxShift), w,height);
    }
  },
  pixelate({ size }) {
    loadPixels();
    for (let y=0; y<height; y+=size)
      for (let x=0; x<width; x+=size){
        let i=(y*width+x)*4;
        fill(pixels[i],pixels[i+1],pixels[i+2]);
        rect(x,y,size,size);
      }
  },
  noise({ strength }) {
    loadPixels();
    for (let i=0; i<pixels.length; i+=4){
      let n = random(-strength,strength);
      pixels[i]+=n; pixels[i+1]+=n; pixels[i+2]+=n;
    }
    updatePixels();
  },
  waveDistort({ amplitude, frequency }) {
    let buf=get();
    for (let y=0; y<height; y++){
      let dx = sin(y*frequency + frameCount*0.1)*amplitude;
      copy(buf,0,y,width,1, dx,y,width,1);
    }
  },
  quantize({ levels }) {
    loadPixels();
    for (let i=0; i<pixels.length; i+=4)
      for (let c=0; c<3; c++){
        let v=pixels[i+c];
        pixels[i+c]=floor(v*levels/256)*(256/levels);
      }
    updatePixels();
  },
  dithering() {
    loadPixels();
    const w=width;
    for (let y=0; y<height; y++){
      for (let x=0; x<width; x++){
        let idx=(y*w+x)*4;
        for (let c=0; c<3; c++){
          let oldv=pixels[idx+c];
          let newv=round(oldv/255)*255;
          let err=oldv-newv;
          pixels[idx+c]=newv;
          if (x+1<width) pixels[idx+4+c]+=err*0.5;
          if (y+1<height) pixels[((y+1)*w+x)*4+c]+=err*0.5;
        }
      }
    }
    updatePixels();
  },
  invertColors() {
    loadPixels();
    for (let i=0; i<pixels.length; i+=4){
      pixels[i]=255-pixels[i];
      pixels[i+1]=255-pixels[i+1];
      pixels[i+2]=255-pixels[i+2];
    }
    updatePixels();
  },
  posterize({ levels=8 }) {
    loadPixels();
    for (let i=0; i<pixels.length; i+=4)
      for (let c=0; c<3; c++){
        pixels[i+c]=floor(pixels[i+c]/255*levels)/levels*255;
      }
    updatePixels();
  },
  scanlines({ spacing, alpha }) {
    fill(0,alpha);
    for (let y=0; y<height; y+=spacing) rect(0,y,width,1);
  },
  ghosting({ alpha }) {
    image(ghostBuf,0,0);
    fill(0,alpha);
    rect(0,0,width,height);
    ghostBuf.image(get(),0,0);
  },
  blur({ radius }) {
    filter(BLUR, radius);
  },
  shuffleRGB() {
    loadPixels();
    for (let i=0; i<pixels.length; i+=4){
      let r=pixels[i], g=pixels[i+1], b=pixels[i+2];
      // random swap
      if (random()<0.5) [pixels[i],pixels[i+1]]=[g,r];
      if (random()<0.5) [pixels[i],pixels[i+2]]=[b,r];
      if (random()<0.5) [pixels[i+1],pixels[i+2]]=[b,g];
    }
    updatePixels();
  },
  edgeDetect({ threshold=0.2 }) {
    // simple Sobel-like
    loadPixels();
    let buf=pixels.slice();
    const w=width, h=height;
    for (let y=1; y<h-1; y++){
      for (let x=1; x<w-1; x++){
        let i=(y*w+x)*4;
        let sum=0;
        // neighbors difference
        for (let dy=-1; dy<=1; dy++){
          for (let dx=-1; dx<=1; dx++){
            let j=((y+dy)*w + (x+dx))*4;
            sum += abs(buf[j] - buf[i]);
          }
        }
        let val = sum/9>threshold*255 ? 255:0;
        pixels[i]=pixels[i+1]=pixels[i+2]=val;
      }
    }
    updatePixels();
  }
};

function draw() {
  // If first effect is ghosting, do it here
  if (config.effectChain[0].name === 'ghosting') {
    effectFunctions.ghosting(config.effectChain[0].params);
    // then draw base image for subsequent effects
    image(img, 0, 0);
  } else {
    background(0);
    image(img, 0, 0);
  }
  // Apply all other effects in order
  for (let eff of config.effectChain) {
    if (eff.name === 'ghosting' && config.effectChain[0].name==='ghosting') continue;
    effectFunctions[eff.name](eff.params);
  }
};
`;

const initialState: EditorState = {
  code: DEFAULT_SKETCH,
  autoRun: true,
  logs: [],
  canvas: null,
  controls: undefined,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode(state, action: PayloadAction<string>) {
      state.code = action.payload;
    },
    toggleAutoRun(state) {
      state.autoRun = !state.autoRun;
    },
    appendLog(state, action: PayloadAction<string>) {
      state.logs.push(action.payload);
    },
    clearLogs(state) {
      state.logs = [];
    },
    setCanvas(state, action: PayloadAction<HTMLCanvasElement | null>) {
      return { ...state, canvas: action.payload };
    },
    registerControls(state, action: PayloadAction<EditorControls>) {
      return { ...state, controls: action.payload };
    },
  },
});

export const {
  setCode,
  toggleAutoRun,
  appendLog,
  clearLogs,
  setCanvas,
  registerControls,
} = editorSlice.actions;

export default editorSlice.reducer;
