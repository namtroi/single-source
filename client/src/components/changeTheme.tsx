import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { applyTheme } from "../app/theme";
// Import the action creator and the type for the theme values
import {
  setThemePreference,
  type ThemeValue,
} from "../features/auth/authSlice";
import apiService from "../api/apiService";

export default function ChangeTheme() {
  const dispatch = useDispatch();
  // Fetch the current user and their theme preference from the Redux store
  const { user } = useSelector((s: RootState) => s.auth);

  // Initialize state using the fetched Redux value, falling back to "system"
  const [theme, setTheme] = useState<ThemeValue>(
    (user?.theme_preference?.theme as ThemeValue) || "system"
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Sync local state if Redux user object changes
  useEffect(() => {
    if (
      user?.theme_preference?.theme &&
      user.theme_preference.theme !== theme
    ) {
      setTheme(user.theme_preference.theme as ThemeValue);
    }
  }, [user, theme]);

  // Apply the theme to CSS variables whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as ThemeValue;
    setTheme(newTheme);
    setLoading(true);
    setMessage("");

    try {
      // 1. Send update to the backend (Database write)
      await apiService.updateTheme(newTheme);

      // 2. Update Redux state (Client-side state change)
      dispatch(setThemePreference(newTheme));

      // 3. Immediately apply theme to the UI
      applyTheme(newTheme);

    } catch (error) {
      console.error("Theme update error:", error);
      setMessage("Failed to update theme. Please try again.");
      // Revert local state if API call fails
      setTheme(
        (user?.theme_preference?.theme as ThemeValue) || "system"
      );
    } finally {
      setLoading(false);
    }
  };

  if (user?.theme_preference?.theme === "dark") {
    console.log("DARK SELECTED!!!");
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="absolute justify-end w-full top-20 left-112">
        <select
          id="theme"
          name="theme"
          value={theme}
          onChange={handleThemeChange}
          disabled={loading}
          className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
        >
          <option value="system">System (Default)</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="calm">Calm</option>
        </select>

        {message && (
          <span
            className={`block mt-2 text-sm ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}