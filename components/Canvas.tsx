"use client";

import { useRef, useEffect } from "react";
import { useEditor } from "@/hooks/useEditor";
import { useP5 } from "@/hooks/useP5";
import { CanvasFrame } from "@/components/ui/canvas-frame";

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
  }, [clearLogs]);

  useEffect(() => {
    registerControls({ run: api.run, stop: api.stop });
  }, [api.run, api.stop, registerControls]);

  return <CanvasFrame ref={containerRef} />;
}
