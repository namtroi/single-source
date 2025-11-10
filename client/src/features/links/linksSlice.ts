import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/apiService';

// Define the shape of a single link
export type Link = { id: string; title: string; url: string };

// Define the overall state for links
interface LinksState {
  items: Link[];
  isLoading: boolean;
  error: string | null;
}

// Initial state for links slice
const initialState: LinksState = {
  items: [],
  isLoading: false,
  error: null,
};

// Create Redux slice for managing links data and state
const linksSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
    // Start loading and reset error
    requestStart(state) {
      state.isLoading = true;
      state.error = null;
    },
     // Handle failed requests
    requestFail(state, action: PayloadAction<string | undefined>) {
      state.isLoading = false;
      state.error = action.payload || 'Something went wrong';
    },
     // Mark request as done
    requestDone(state) {
      state.isLoading = false;
    },

       // Replace entire link list
    linksSet(state, action: PayloadAction<Link[]>) {
      state.items = action.payload;
      state.isLoading = false;
    },
    // Add a new link to the top of the list
    linkAdded(state, action: PayloadAction<Link>) {
      state.items.unshift(action.payload);
      state.isLoading = false;
    },
      // Update an existing link by ID
    linkUpdated(state, action: PayloadAction<Link>) {
      const idx = state.items.findIndex((l) => l.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.isLoading = false;
    },
       // Remove a link from the list by ID
    linkDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter((l) => l.id !== action.payload);
      state.isLoading = false;
    },
  },
});

// Export slice actions and reducer
export const {
  requestStart,
  requestFail,
  requestDone,
  linksSet,
  linkAdded,
  linkUpdated,
  linkDeleted,
} = linksSlice.actions;

export default linksSlice.reducer;

// Fetch all links from the backend
export const fetchLinks = () => async (dispatch: any) => {
  try {
    dispatch(requestStart());
    const data = await api.getLinks();           
    dispatch(linksSet(data));
  } catch (err: any) {
    dispatch(requestFail(err?.message));
  }
};

// Add a new link
export const addLink =
  (payload: { title: string; url: string }) => async (dispatch: any) => {
    try {
      dispatch(requestStart());
      const data = await api.createLink(payload.title, payload.url);
      dispatch(linkAdded(data));
    } catch (err: any) {
      dispatch(requestFail(err?.message));
    }
  };

  // Update an existing link
export const updateLink =
  (id: string, updates: Partial<{ title: string; url: string }>) =>
  async (dispatch: any) => {
    try {
      dispatch(requestStart());
      const data = await api.updateLink(id, updates);
      dispatch(linkUpdated(data));
    } catch (err: any) {
      dispatch(requestFail(err?.message));
    }
  };

  // Delete a link by ID
export const deleteLink = (id: string) => async (dispatch: any) => {
  try {
    dispatch(requestStart());
    await api.deleteLink(id);                   
    dispatch(linkDeleted(id));
  } catch (err: any) {
    dispatch(requestFail(err?.message));
  }
};