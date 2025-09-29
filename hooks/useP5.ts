import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!container.current) return;
    runnerRef.current = new P5Runner(container.current, onLog);
    return () => {
      runnerRef.current?.stop();
      runnerRef.current = null;
      onCanvas(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container]);

  // (Re)run on code change if autoRun
  useEffect(() => {
    if (!runnerRef.current) return;
    if (autoRun) {
      (async () => {
        await runnerRef.current!.run(code);
        onCanvas(runnerRef.current!.getCanvasEl());
      })();
    }
  }, [autoRun, code, onCanvas]);

  // API to consumer
  return {
    run: async () => {
      if (!runnerRef.current) return;
      await runnerRef.current.run(code);
      onCanvas(runnerRef.current.getCanvasEl());
    },
    stop: () => {
      runnerRef.current?.stop();
      onCanvas(null);
    },
  };
}
