"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type State = {
  code: string;
  autoRun: boolean;
  logs: string[];
  canvas: HTMLCanvasElement | null;
};

type Actions = {
  setCode: (v: string) => void;
  toggleAutoRun: () => void;
  appendLog: (line: string) => void;
  clearLogs: () => void;
  setCanvas: (c: HTMLCanvasElement | null) => void;
  run?: () => void; // registered by Canvas
  stop?: () => void; // registered by Canvas
  registerControls: (api: { run: () => void; stop: () => void }) => void;
};

const EditorCtx = createContext<(State & Actions) | null>(null);

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "SET_CODE":
      return { ...state, code: action.code };
    case "TOGGLE_AUTORUN":
      return { ...state, autoRun: !state.autoRun };
    case "APPEND_LOG":
      return { ...state, logs: [...state.logs, action.line] };
    case "CLEAR_LOGS":
      return { ...state, logs: [] };
    case "SET_CANVAS":
      return { ...state, canvas: action.canvas };
    case "REGISTER":
      return { ...state, ...action.api };
    default:
      return state;
  }
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [persistedCode, setPersistedCode] = useLocalStorage(
    "p5-mini-editor-sketch",
    `function setup(){ createCanvas(400,400); }
function draw(){ background(20); noStroke(); fill(255); circle(width/2,height/2,120); }`
  );

  const [state, dispatch] = useReducer(reducer, {
    code: persistedCode,
    autoRun: true,
    logs: [],
    canvas: null,
  });

  const api = useMemo<Actions>(
    () => ({
      setCode: (v) => {
        setPersistedCode(v);
        dispatch({ type: "SET_CODE", code: v });
      },
      toggleAutoRun: () => dispatch({ type: "TOGGLE_AUTORUN" }),
      appendLog: (line) => dispatch({ type: "APPEND_LOG", line }),
      clearLogs: () => dispatch({ type: "CLEAR_LOGS" }),
      setCanvas: (c) => dispatch({ type: "SET_CANVAS", canvas: c }),
      registerControls: (api) => dispatch({ type: "REGISTER", api }),
    }),
    [setPersistedCode]
  );

  return (
    <EditorCtx.Provider value={{ ...state, ...api }}>
      {children}
    </EditorCtx.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorCtx);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
