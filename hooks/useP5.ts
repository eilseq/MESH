import { useCallback, useEffect, useRef } from "react";
import { P5Runner } from "@/lib/p5runner";

export function useP5(
  container: React.RefObject<HTMLDivElement>,
  {
    code,
    onLog,
    autoRun,
    onCanvas,
  }: {
    code: string;
    autoRun: boolean;
    onLog: (line: string) => void;
    onCanvas: (canvas: HTMLCanvasElement | null) => void;
  }
) {
  const runnerRef = useRef<P5Runner | null>(null);
  const rafRef = useRef<number | null>(null);

  const cancelCanvasWatch = useCallback(() => {
    if (typeof window === "undefined") return;
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const scheduleCanvasWatch = useCallback(() => {
    if (!runnerRef.current) return;
    if (typeof window === "undefined") {
      const canvas = runnerRef.current.getCanvasEl();
      if (canvas) {
        onCanvas(canvas);
      }
      return;
    }

    cancelCanvasWatch();

    let attempts = 0;
    const maxAttempts = 60;

    const tick = () => {
      if (!runnerRef.current) {
        rafRef.current = null;
        return;
      }

      const canvas = runnerRef.current.getCanvasEl();
      if (canvas) {
        onCanvas(canvas);
        rafRef.current = null;
        return;
      }

      if (attempts >= maxAttempts) {
        rafRef.current = null;
        return;
      }

      attempts += 1;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    tick();
  }, [cancelCanvasWatch, onCanvas]);

  useEffect(() => {
    if (!container.current) return;
    runnerRef.current = new P5Runner(container.current, onLog);
    return () => {
      cancelCanvasWatch();
      runnerRef.current?.stop();
      runnerRef.current = null;
    };
  }, [cancelCanvasWatch, container, onLog]);

  // (Re)run on code change if autoRun
  useEffect(() => {
    if (!runnerRef.current) return;
    if (autoRun) {
      (async () => {
        await runnerRef.current!.run(code);
        scheduleCanvasWatch();
      })();
    }
  }, [autoRun, code, scheduleCanvasWatch]);

  // API to consumer
  return {
    run: async () => {
      if (!runnerRef.current) return;
      await runnerRef.current.run(code);
      scheduleCanvasWatch();
    },
    stop: () => {
      runnerRef.current?.stop();
      cancelCanvasWatch();
    },
  };
}
