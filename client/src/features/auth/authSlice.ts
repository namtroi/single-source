import { createSlice, type PayloadAction } from "@reduxjs/toolkit"; // <-- Added PayloadAction

export type ThemeValue = "dark" | "light" | "calm" | "system"; // <-- Define the types for the theme string

// 1. DEFINE ThemePreference HERE (The Missing Piece)
export interface ThemePreference {
  theme: ThemeValue;
  // Add other properties that are stored in the JSONB column if they exist
}

// 2. USE ThemePreference in the User interface
export interface User {
  id: string;
  username: string;
  email: string;
  theme_preference: ThemePreference; // <-- This is where the name was missing
  // other user data properties...
}

// Define structure of authentication response
interface AuthResponse {
  user: User;
  token: string;
}

// Retrieve saved authentication data from localStorage (if available)
const storedAuth = localStorage.getItem("auth");
let parsedAuth: AuthResponse | null = null;

// Safely parse stored authentication data
if (storedAuth) {
  try {
    parsedAuth = JSON.parse(storedAuth) as AuthResponse;
  } catch (error) {
    console.error("Failed to parse auth from localStorage:", error);
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
  name: "auth",
  initialState,
  reducers: {
    // Save user credentials and mark as authenticated
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      // Added PayloadAction for type safety
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    // Clear authentication state and log user out
    logOut(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // CRITICAL: Clear localStorage on logout
      localStorage.removeItem("auth");
    },

    // NEW REDUCER: Update the theme preference in the state
    setThemePreference(state, action: PayloadAction<ThemeValue>) {
      if (state.user && state.user.theme_preference) {
        state.user.theme_preference.theme = action.payload;

        // ALSO CRITICAL: Update localStorage to persist the change across page loads
        const storedAuth = JSON.parse(localStorage.getItem("auth") || "{}");
        if (storedAuth.user) {
          storedAuth.user.theme_preference.theme = action.payload;
          localStorage.setItem("auth", JSON.stringify(storedAuth));
        }
      }
    },
  },
});

// Export actions and reducer
// CRITICAL FIX: Export the new action
export const { setCredentials, logOut, setThemePreference } = authSlice.actions;
export default authSlice.reducer;
