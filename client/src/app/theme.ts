import type { ThemeValue } from "../features/auth/authSlice";

export const THEME_STYLES: Record<
  ThemeValue,
  { "--bg": string; "--text": string; "--accent": string }
> = {
  system: {
    "--bg": "#ffffff",
    "--text": "#111827",
    "--accent": "#2563eb",
  },
  light: {
    "--bg": "#fdfdfd",
    "--text": "#1a1a1a",
    "--accent": "#3b82f6",
  },
  dark: {
    "--bg": "#0c0f1a",
    "--text": "#e2e8f0",
    "--accent": "#7dd3fc",
  },
  calm: {
    "--bg": "#f8fbff",
    "--text": "#334155",
    "--accent": "#6ee7b7",
  },
};

export function applyTheme(theme: ThemeValue) {
  const vars = THEME_STYLES[theme];
  if (!vars) return;

  // remove dark class (you were never using Tailwind dark mode)
  document.documentElement.classList.remove("dark");

  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}