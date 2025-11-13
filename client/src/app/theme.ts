import type { ThemeValue } from "../features/auth/authSlice";

// map each theme -> CSS variables
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
    "--bg": "#ffffff",
    "--text": "#111827",
    "--accent": "#2563eb",
  },
  dark: {
    "--bg": "#020617",
    "--text": "#e5e7eb",
    "--accent": "#4f46e5",
  },
  calm: {
    "--bg": "#f5fbff",
    "--text": "#0f172a",
    "--accent": "#22c55e",
  },
};

// apply theme at runtime
export function applyTheme(theme: ThemeValue) {
  const vars = THEME_STYLES[theme];
  console.log("Applying theme:", theme, vars); // for debugging

  if (!vars) return;

  // if you're also using Tailwind's "dark" class, handle it here:
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}