import React, { useState } from "react";
import apiService from "../api/apiService";

export default function ChangeTheme() {
  const [theme, setTheme] = useState<string>("system");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    setLoading(true);
    setMessage("");

    try {
      // get username from stored auth
      const storedAuth = localStorage.getItem("auth");
      const username = storedAuth
        ? JSON.parse(storedAuth)?.user?.username
        : null;

      if (!username) {
        setMessage("Error: user not found in localStorage");
        console.error("No username found in localStorage");
        return;
      }

      await apiService.updateTheme(username, newTheme);

      setMessage(`Theme updated successfully to "${newTheme}"`);
      console.log("Theme updated successfully!");
    } catch (error: any) {
      console.error("Theme update error:", error);
      setMessage("Failed to update theme. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <option value="">Select a theme</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>

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
