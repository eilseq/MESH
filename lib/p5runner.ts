// Tiny runner that owns: p5 lifecycle, console bridging, and code wrapping.
// Consumed by useP5() hook so components stay declarative.

import type { LogFn } from "./consoleBridge";
import { hijackConsole } from "./consoleBridge";

type P5Instance = {
  remove?: () => void;
  noLoop?: () => void;
  // Allow lifecycle bindings via index signature
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type P5Ctor = new (
  sketch: (p: P5Instance) => void,
  node?: Element | undefined
) => P5Instance;

export class P5Runner {
  private p5mod: P5Ctor | null = null;
  private instance: P5Instance | null = null;
  private undoConsole: (() => void) | null = null;
  private container: HTMLElement;
  private onLog: LogFn;

  constructor(container: HTMLElement, onLog: LogFn) {
    this.container = container;
    this.onLog = onLog;
  }

  async initIfNeeded() {
    if (!this.p5mod) {
      const m = await import("p5");
      this.p5mod = m.default || m;
    }
  }

  /** Wrap user code to behave like "global mode" inside instance mode. */
  private buildSketchFactory(code: string): (p: P5Instance) => void {
    const lifecycleFns = [
      "preload",
      "setup",
      "draw",
      "mouseClicked",
      "mousePressed",
      "mouseReleased",
      "mouseMoved",
      "mouseDragged",
      "mouseWheel",
      "doubleClicked",
      "keyPressed",
      "keyReleased",
      "keyTyped",
      "touchStarted",
      "touchMoved",
      "touchEnded",
      "deviceMoved",
      "deviceTurned",
      "deviceShaken",
      "windowResized",
    ];

    const declarations = lifecycleFns
      .map((name) => `let __${name} = null;`)
      .join("\n");
    const captures = lifecycleFns
      .map(
        (name) => `if (typeof ${name} === 'function') __${name} = ${name};`
      )
      .join("\n");
    const assignments = lifecycleFns
      .map(
        (name) =>
          `if (__${name}) { p.${name} = __${name}; } else { delete p.${name}; }`
      )
      .join("\n");

    const wrapped = `
      return function(p){
        with(p){
          ${declarations}
          (function(){
            ${code}
            ${captures}
          })();
          ${assignments}
        }
      }
    `;
     
    return new Function(wrapped)() as (p: P5Instance) => void;
  }

  /** Run a new sketch; replaces any previous instance. */
  async run(code: string) {
    await this.initIfNeeded();
    const previousInstance = this.instance;

    this.restoreConsole();
    this.undoConsole = hijackConsole(this.onLog);

    let factory: (p: P5Instance) => void;
    try {
      factory = this.buildSketchFactory(code);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      this.onLog(`[error] ${msg}`);
      this.restoreConsole();
      return;
    }

    let nextInstance: P5Instance | null = null;
    try {
      nextInstance = new (this.p5mod as P5Ctor)(factory, this.container);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      this.onLog(`[error] ${msg}`);
      this.restoreConsole();
      return;
    }

    if (previousInstance && previousInstance !== nextInstance) {
      try {
        previousInstance.remove?.();
      } catch {
        /* allow empty */
      }
    }

    this.instance = nextInstance;
  }

  /** Stop and dispose current sketch. */
  stop() {
    if (this.instance && typeof this.instance.noLoop === "function") {
      try {
        this.instance.noLoop();
      } catch {
        /* allow empty */
      }
    }
    this.restoreConsole();
  }

  private restoreConsole() {
    if (this.undoConsole) {
      this.undoConsole();
      this.undoConsole = null;
    }
  }

  getCanvasEl(): HTMLCanvasElement | null {
    return (
      (this.container.querySelector("canvas") as HTMLCanvasElement) || null
    );
  }
}
