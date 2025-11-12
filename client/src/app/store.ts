import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import linksReducer from '../features/links/linksSlice';

// Configure the Redux store and register all feature reducers
export const store = configureStore({
  reducer: {
    auth: authReducer, // handles authentication state (login/logout)
    links: linksReducer, // handles link CRUD and API states
    
  },
});

// Define types for RootState and AppDispatch for strong typing in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
