import { createSlice } from '@reduxjs/toolkit';

// Define user data structure
interface User {
  id: number;
  username: string;
}

// Define structure of authentication response
interface AuthResponse {
  user: User;
  token: string;
}

// Retrieve saved authentication data from localStorage (if available)
const storedAuth = localStorage.getItem('auth');
let parsedAuth: AuthResponse | null = null;

// Safely parse stored authentication data
if (storedAuth) {
  try {
    parsedAuth = JSON.parse(storedAuth) as AuthResponse;
  } catch (error) {
    console.error('Failed to parse auth from localStorage:', error);
    parsedAuth = null;
  }
}

// Define the shape of authentication state
interface InitialState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Initialize authentication state (load from localStorage if present)
const initialState: InitialState = {
  user: parsedAuth ? parsedAuth.user : null,
  token: parsedAuth ? parsedAuth.token : null,
  isAuthenticated: parsedAuth ? true : false,
};

// Create authentication slice for Redux
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Save user credentials and mark as authenticated
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

     // Clear authentication state and log user out
    logOut(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions and reducer
export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
