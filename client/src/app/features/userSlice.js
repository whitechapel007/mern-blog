import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  currentUser: null,
  token: null,
  error: null,
  loading: null,
  success: null,
};

export const signUp = createAsyncThunk(
  "users/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/signup", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    resetErrorMessage: (state) => {
      state.loading = false;
      state.error = null;
    },

    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logErrorMessage: (state, action) => {
      state.error = action.payload;
    },
    successMessage: (state, action) => {
      state.success = action.payload;
    },

    resetSuccessMessage: (state) => {
      state.success = null;
    },
    getToken: (state, action) => {
      state.token = action.payload;
    },

    deleteUserSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },

    signoutUser: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload.message;
        state.loading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  signInFailure,
  signInStart,
  signInSuccess,
  resetErrorMessage,
  updateFailure,
  updateSuccess,
  updateStart,
  successMessage,
  resetSuccessMessage,

  deleteUserSuccess,
  logErrorMessage,
  signoutUser,
  getToken,
} = userSlice.actions;

export default userSlice.reducer;
