import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAllUsers = createAsyncThunk('auth/fetchAllUsers', async () => {
  const { data } = await axios.get('/auth/users');
  return data;
});
export const fetchUsersCount = createAsyncThunk('auth/fetchUsersCount', async () => {
  const { data } = await axios.get('/auth/count');
  return data;
});

const initialState = {
  users: [],
  status: 'loading',
  usersCount: 0,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: {
    //all users
    [fetchAllUsers.pending]: (state) => {
      state.users = [];
      state.status = 'loading';
    },
    [fetchAllUsers.fulfilled]: (state, action) => {
      state.users = action.payload;
      state.status = 'loaded';
    },
    [fetchAllUsers.rejected]: (state) => {
      state.data = [];
      state.status = 'error';
    },
    //count users
    [fetchUsersCount.pending]: (state) => {
      state.usersCount = 0;
      state.status = 'loading';
    },
    [fetchUsersCount.fulfilled]: (state, action) => {
      state.usersCount = action.payload;
      state.status = 'loaded';
    },
    [fetchUsersCount.rejected]: (state) => {
      state.usersCount = 0;
      state.status = 'error';
    },
  },
});

export const allUser = (state) => state.users.users;
export const usersReducer = usersSlice.reducer;
