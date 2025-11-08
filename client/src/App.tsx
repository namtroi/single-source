import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PublicProfile from "./pages/PublicProfile";

export default function App() {
  return (
    <div>
      {/* <h1 className="text-red-500 text-3xl font-bold text-center mt-8">
        Tailwind is working!
      </h1> */}

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/u/:username" element={<PublicProfile />} />
        </Routes>
      </main>
    </div>
  );
}