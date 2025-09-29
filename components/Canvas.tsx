"use client";

import { useRef, useEffect } from "react";
import { useEditor } from "@/context/EditorContext";
import { useP5 } from "@/hooks/useP5";

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { code, autoRun, appendLog, clearLogs, setCanvas, registerControls } =
    useEditor();

  const api = useP5(containerRef, {
    code,
    autoRun,
    onLog: appendLog,
    onCanvas: setCanvas,
  });

  useEffect(() => {
    clearLogs();
    registerControls({ run: api.run, stop: api.stop });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-lg border bg-black"
    />
  );
}
