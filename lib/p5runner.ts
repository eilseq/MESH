// Tiny runner that owns: p5 lifecycle, console bridging, and code wrapping.
// Consumed by useP5() hook so components stay declarative.

import type { LogFn } from "./consoleBridge";
import { hijackConsole } from "./consoleBridge";

export class P5Runner {
  private p5mod: any | null = null;
  private instance: any | null = null;
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
  private buildSketchFactory(code: string): (p: any) => void {
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
    // eslint-disable-next-line no-new-func
    return new Function(wrapped)();
  }

  /** Run a new sketch; replaces any previous instance. */
  async run(code: string) {
    await this.initIfNeeded();
    const previousInstance = this.instance;

    this.restoreConsole();
    this.undoConsole = hijackConsole(this.onLog);

    let factory: (p: any) => void;
    try {
      factory = this.buildSketchFactory(code);
    } catch (e: any) {
      this.onLog(`[error] ${e?.message || e}`);
      this.restoreConsole();
      return;
    }

    let nextInstance: any | null = null;
    try {
      nextInstance = new this.p5mod(factory, this.container);
    } catch (e: any) {
      this.onLog(`[error] ${e?.message || e}`);
      this.restoreConsole();
      return;
    }

    if (previousInstance && previousInstance !== nextInstance) {
      try {
        previousInstance.remove();
      } catch {}
    }

    this.instance = nextInstance;
  }

  /** Stop and dispose current sketch. */
  stop() {
    if (this.instance && typeof this.instance.noLoop === "function") {
      try {
        this.instance.noLoop();
      } catch {}
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
