import { useEffect, useRef, useState } from "react";

export function useLocalStorage(
  key: string,
  initial: string,
  debounceMs = 250
) {
  const [val, setVal] = useState<string>(() => {
    if (typeof window === "undefined") return initial;
    const v = localStorage.getItem(key);
    return v == null ? initial : v;
  });

  const t = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => {
      localStorage.setItem(key, val);
    }, debounceMs) as unknown as number;
    return () => {
      if (t.current) window.clearTimeout(t.current);
    };
  }, [key, val, debounceMs]);

  return [val, setVal] as const;
}
