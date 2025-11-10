import { useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import api from '../api/apiService';
import { setCredentials } from '../features/auth/authSlice';

// This component renders the Login page and handles authentication
export default function Login() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(''); // error message to display
  const [loading, setLoading] = useState(false); // loading state for submit

  const dispatch = useDispatch(); // redux dispatch
  const navigate = useNavigate(); // navigation helper
  const location = useLocation(); // current route/location

  // ⬅️ get path the user came from, or default to /dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Handle form submission and perform login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      return setError('Please fill in all fields.');
    }

    try {
      setLoading(true);
      const data = await api.login(form.username, form.password);
      dispatch(setCredentials(data));
      localStorage.setItem('auth', JSON.stringify(data));

      // ⬅️ redirect back to previous location or dashboard
      navigate(from, { replace: true });

      setLoading(false);
    } catch (err) {
      setLoading(false);

      let errorMessage = 'Failed to login. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

    // Render login form and messaging
  return (
    <div className='max-w-md mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>

      {error && (
        <div className='bg-red-100 text-red-700 p-2 rounded mb-3 text-sm'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-3'>
        <input
          placeholder='Username'
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className='border p-2 w-full rounded'
        />
        <input
          placeholder='Password'
          type='password'
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className='border p-2 w-full rounded'
        />

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2 disabled:opacity-60'
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className='text-sm mt-4'>
        Don't have an account?{' '}
        <Link to='/register' className='text-blue-600 underline'>
          Create Account
        </Link>
      </p>
    </div>
  );
}