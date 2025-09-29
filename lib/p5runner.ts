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
    const wrapped = `
      return function(p){
        with(p){
          let __setup = null, __draw = null;
          (function(){
            ${code}
            if (typeof setup === 'function') __setup = setup;
            if (typeof draw === 'function') __draw = draw;
          })();
          if (__setup) p.setup = __setup;
          if (__draw) p.draw = __draw;
        }
      }
    `;
    // eslint-disable-next-line no-new-func
    return new Function(wrapped)();
  }

  /** Run a new sketch; replaces any previous instance. */
  async run(code: string) {
    await this.initIfNeeded();
    this.stop();

    this.undoConsole = hijackConsole(this.onLog);

    // clear container for a fresh canvas mount
    this.container.innerHTML = "";

    let factory: (p: any) => void;
    try {
      factory = this.buildSketchFactory(code);
    } catch (e: any) {
      this.onLog(`[error] ${e?.message || e}`);
      this.restoreConsole();
      return;
    }

    try {
      this.instance = new this.p5mod(factory, this.container);
    } catch (e: any) {
      this.onLog(`[error] ${e?.message || e}`);
      this.restoreConsole();
    }
  }

  /** Stop and dispose current sketch. */
  stop() {
    if (this.instance && typeof this.instance.remove === "function") {
      try {
        this.instance.remove();
      } catch {}
    }
    this.instance = null;
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
