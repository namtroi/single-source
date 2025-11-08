import { configureStore } from '@reduxjs/toolkit'

// starting point for what auth data will look like later
const initialAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// simple reducer that just returns that state for now
function authReducer(state = initialAuthState) {
  return state;
}

// create and export the store
const store = configureStore({
  reducer: { auth: authReducer },
});

export default store;