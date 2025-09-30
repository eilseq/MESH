export type LogFn = (line: string) => void;

export function hijackConsole(onLog: LogFn) {
  const orig = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    onerror: window.onerror,
  };

  function stringify(args: unknown[]) {
    return args
      .map((a) => {
        try {
          return typeof a === "string" ? a : JSON.stringify(a);
        } catch {
          return String(a);
        }
      })
      .join(" ");
  }

  console.log = (...a: unknown[]) => {
    onLog(`[log] ${stringify(a)}`);
    orig.log(...a);
  };
  console.warn = (...a: unknown[]) => {
    onLog(`[warn] ${stringify(a)}`);
    orig.warn(...a);
  };
  console.error = (...a: unknown[]) => {
    onLog(`[error] ${stringify(a)}`);
    orig.error(...a);
  };

  window.onerror = (msg, src, line, col) => {
    onLog(`[error] ${String(msg)} @${line}:${col}`);
    return false;
  };

  return () => {
    console.log = orig.log;
    console.warn = orig.warn;
    console.error = orig.error;
    window.onerror = orig.onerror!;
  };
}
