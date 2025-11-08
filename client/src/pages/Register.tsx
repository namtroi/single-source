import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { setCredentials } from "../features/auth/authSlice";

// This component renders the Register page
export default function Register() {
 // Form state for user input
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  // Error and loading states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hooks to dispatch actions and navigate pages
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // This function runs when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Helper function to mimic backend-style error logging
    const next = (err?: { log: string; message: { err: string } }) => {
      if (!err) return;
      // prints error to console for debugging
      console.error(err.log);
      // shows readable error on the screen
      setError(err.message.err);
      // stop spinner when error occurs
      setLoading(false); 
    };

    // Conditional statement if no input is entered return error if no input
    if (!form.username || !form.name || !form.email || !form.password) {
      return setError("Please fill in all fields.");
    }
    // Conditional statement if password is incorrrect return error if incorrect
    if (form.password !== form.confirm) {
      return setError("Passwords do not match.");
    }
    //Try to send the data to the backend or mock API
    try {
      setLoading(true);

      //Send the form data to the API to register the user
      const data = await api.register({
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
      });
      //Save the user and token in Redux and LocalStorage (Keep user logged in after refresh)
      dispatch(setCredentials(data));
      localStorage.setItem("auth", JSON.stringify(data));

      navigate("/dashboard");
      setLoading(false); 
    } catch (err: any) {
    //Error Handler
      return next({
        log: `Register Error: ${err}`,
        message: {
          err: "RegisterController.handleSubmit: ERROR, check console/network for more details.",
        },
      });
    }
  };
  //Render the Register Form
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input
          placeholder="Confirm Password"
          type="password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}