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
import { applyTheme, type ThemeValue } from "./app/theme";


export default function App() {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    const storedUser = storedAuth ? JSON.parse(storedAuth)?.user : null;

    const themePref: ThemeValue =
      (user?.theme_preference?.theme as ThemeValue) ||
      (storedUser?.theme_preference?.theme as ThemeValue) ||
      "light";

    applyTheme(themePref); // sets CSS vars + dark class
  }, [user]);

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-[750px] mx-auto transition-colors duration-300">
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
    </div>
  );
}