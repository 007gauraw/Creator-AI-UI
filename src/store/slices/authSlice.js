import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: {
    access_token: null,
    token_type: null,
  },
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      // Only store serializable properties
      if (action.payload) {
        state.user = {
          access_token: action.payload.access_token,
          token_type: action.payload.token_type,
        };
      } else {
        state.user = initialState.user;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAuthenticated, setUser, setLoading, setError } =
  authSlice.actions;
export default authSlice.reducer;
