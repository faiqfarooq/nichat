import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user avatar
export const updateUserAvatar = createAsyncThunk(
  'user/updateUserAvatar',
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload the image to Cloudinary via our API
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update avatar');
      }
      
      const result = await response.json();
      
      // Fetch the updated profile to get the complete user data
      const profileResponse = await fetch(`/api/users/${userId}`);
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch updated profile');
      }
      
      const updatedProfile = await profileResponse.json();
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }
      
      const updatedProfile = await response.json();
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserData
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle updateUserAvatar
      .addCase(updateUserAvatar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearUserData } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.data;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
export const selectUserAvatar = (state) => state.user.data?.avatar;

export default userSlice.reducer;
