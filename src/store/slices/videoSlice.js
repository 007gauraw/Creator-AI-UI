import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  video: null,
  story: null,
  images: [],
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    generateStoryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    generateStorySuccess: (state, action) => {
      state.loading = false;
      state.story = action.payload;
      state.error = null;
    },
    generateStoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    generateImagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    generateImagesSuccess: (state, action) => {
      state.loading = false;
      state.images = action.payload.presignedUrls;
      state.error = null;
    },
    generateImagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetVideo: (state) => {
      state.loading = false;
      state.error = null;
      state.video = null;
      state.story = null;
      state.images = [];
    },
  },
});

export const {
  generateStoryRequest,
  generateStorySuccess,
  generateStoryFailure,
  generateImagesRequest,
  generateImagesSuccess,
  generateImagesFailure,
  resetVideo,
} = videoSlice.actions;

export default videoSlice.reducer;
