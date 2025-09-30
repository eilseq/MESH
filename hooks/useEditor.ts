"use client";

import { useCallback } from "react";

import {
  appendLog,
  clearLogs,
  registerControls,
  setCanvas,
  setCode,
  toggleAutoRun,
  type EditorControls,
  type EditorState,
} from "@/store/editorSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type EditorActions = {
  setCode: (value: string) => void;
  toggleAutoRun: () => void;
  appendLog: (line: string) => void;
  clearLogs: () => void;
  setCanvas: (canvas: HTMLCanvasElement | null) => void;
  registerControls: (controls: EditorControls) => void;
};

type UseEditorResult = Omit<EditorState, "controls"> &
  EditorActions & {
    run?: EditorControls["run"];
    stop?: EditorControls["stop"];
  };

export function useEditor(): UseEditorResult {
  const dispatch = useAppDispatch();
  const editorState = useAppSelector((state) => state.editor);

  const handleSetCode = useCallback(
    (value: string) => {
      dispatch(setCode(value));
    },
    [dispatch]
  );

  const handleToggleAutoRun = useCallback(() => {
    dispatch(toggleAutoRun());
  }, [dispatch]);

  const handleAppendLog = useCallback(
    (line: string) => {
      dispatch(appendLog(line));
    },
    [dispatch]
  );

  const handleClearLogs = useCallback(() => {
    dispatch(clearLogs());
  }, [dispatch]);

  const handleSetCanvas = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      dispatch(setCanvas(canvas));
    },
    [dispatch]
  );

  const handleRegisterControls = useCallback(
    (controls: EditorControls) => {
      dispatch(registerControls(controls));
    },
    [dispatch]
  );

  return {
    code: editorState.code,
    autoRun: editorState.autoRun,
    logs: editorState.logs,
    canvas: editorState.canvas,
    run: editorState.controls?.run,
    stop: editorState.controls?.stop,
    setCode: handleSetCode,
    toggleAutoRun: handleToggleAutoRun,
    appendLog: handleAppendLog,
    clearLogs: handleClearLogs,
    setCanvas: handleSetCanvas,
    registerControls: handleRegisterControls,
  };
}
