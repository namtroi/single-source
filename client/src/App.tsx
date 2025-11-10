import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './app/store';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import ProtectedRoute from './components/ProtectedRoute';

// This component defines all routes and main layout of the app
export default function App() {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);

  // Render app layout and route configuration
  return (
    <div className="max-w-[750px] mx-auto">
      <Header />
      <main className="p-6">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
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