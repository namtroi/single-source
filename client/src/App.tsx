import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PublicProfile from "./pages/PublicProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangeTheme from "./components/changeTheme";

export default function App() {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    // Theme logic remains the same: it applies 'dark' class to <html>
    const storedAuth = localStorage.getItem("auth");
    const storedUser = storedAuth ? JSON.parse(storedAuth)?.user : null;
    const themePref =
      user?.theme_preference?.theme ||
      storedUser?.theme_preference?.theme ||
      "light";

    const root = document.documentElement;
    root.classList.remove("dark");

    if (themePref === "dark") {
      root.classList.add("dark");
    } else if (themePref === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) root.classList.add("dark");
    }
  }, [user]);

  // FIX: The div now only has layout and transition classes. Colors are handled globally.
  return (
    <div
      className="
        max-w-[750px] mx-auto transition-colors duration-300
      ">
        
      <Header />
      <main className="p-6">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
              
            }
          />

          <Route path="/:username" element={<PublicProfile />} />
        </Routes>
      </main>
    </div>
  );
}
