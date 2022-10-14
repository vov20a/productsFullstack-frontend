import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { categoriesLS } from '../../utils/categoriesLS';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const { data } = await axios.get('/categories');
  return data;
});

const initialState = {
  categories: categoriesLS(),
  categoriesStatus: 'loading',
};
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCategories.pending]: (state) => {
      state.categoriesStatus = 'loading';
      state.categories = [];
    },
    [fetchCategories.fulfilled]: (state, action) => {
      state.categories = action.payload;
      state.categoriesStatus = 'loaded';
    },
    [fetchCategories.rejected]: (state) => {
      state.categories = [];
      state.categoriesStatus = 'error';
    },
  },
});

export const categoriesReducer = categoriesSlice.reducer;
