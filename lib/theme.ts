export type ThemePreference = "light" | "dark";

export const THEME_STORAGE_KEY = "p5js-editor-theme";
export const THEME_CHANGE_EVENT = "p5js-theme-change";

export function getStoredTheme(): ThemePreference | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

export function getSystemTheme(): ThemePreference {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getDocumentTheme(): ThemePreference {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function determineInitialTheme(): ThemePreference {
  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(next: ThemePreference) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;
  if (next === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, next);
  window.dispatchEvent(
    new CustomEvent(THEME_CHANGE_EVENT, {
      detail: { theme: next },
    })
  );
}
