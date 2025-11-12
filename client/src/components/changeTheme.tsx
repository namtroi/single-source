import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
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
  const [theme, setTheme] = useState<string>(
    user?.theme_preference?.theme || "system"
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Use useEffect to sync local state if the Redux user object changes
  useEffect(() => {
    // We only update the local state if the Redux theme is different,
    // ensuring we display the latest official preference.
    if (
      user?.theme_preference?.theme &&
      user.theme_preference.theme !== theme
    ) {
      setTheme(user.theme_preference.theme);
    }
  }, [user, theme]);

  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    setLoading(true);
    setMessage("");

    try {
      // 1. Send update to the backend (Database write)
      await apiService.updateTheme(newTheme);

      // 2. Update Redux state (Client-side state change)
      // FIX: Use type assertion (as ThemeValue) to satisfy TypeScript,
      // as newTheme is a generic string but we guarantee it's one of the ThemeValue options.
      dispatch(setThemePreference(newTheme as ThemeValue));

      setMessage(`Theme updated successfully to "${newTheme}"`);
      console.log("Theme updated successfully!");
    } catch (error) {
      console.error("Theme update error:", error);
      setMessage("Failed to update theme. Please try again.");
      // Revert local state if API call fails
      setTheme(user?.theme_preference?.theme || "system");
    } finally {
      setLoading(false);
    }
  };

  // Your logging condition is correct and will execute on every render
  // if the user's theme preference from Redux is "dark".
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
          className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50">
          <option value="system">System (Default)</option>
          <option value="dark">Dark</option>
          <option value="calm">Calm</option>
          <option value="light">Light</option>
        </select>

        {/* ... Message display ... */}
        {message && (
          <span
            className={`block mt-2 text-sm ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
