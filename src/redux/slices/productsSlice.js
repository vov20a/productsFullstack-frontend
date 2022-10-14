import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchProductsCount = createAsyncThunk(
  'products/fetchProductsCount',
  async ({ categoryId }) => {
    if (!categoryId) {
      const { data } = await axios.get(`/products/count`);
      return data;
    } else {
      const { data } = await axios.get(`/products/count/?categoryId=${categoryId}`);
      return data;
    }
  },
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ startProduct, limit, categoryId }) => {
    if (!categoryId) {
      const { data } = await axios.get(`/products/?startProduct=${startProduct}&limit=${limit}`);

      return data;
    } else {
      const { data } = await axios.get(
        `/products/categories/${categoryId}/?startProduct=${startProduct}&limit=${limit}`,
      );

      return data;
    }
  },
);

const initialState = {
  products: [],
  productsStatus: 'loading',
  productsCount: 0,
  currentPage: 1,
  categoryId: 0,
};
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setCategoryId(state, action) {
      state.categoryId = action.payload;
    },
    setFilters(state, action) {
      state.categoryId = Number(action.payload.categoryId);
      state.currentPage = Number(action.payload.currentPage);
    },
  },
  extraReducers: {
    [fetchProducts.pending]: (state) => {
      state.productsStatus = 'loading';
      state.products = [];
    },
    [fetchProducts.fulfilled]: (state, action) => {
      state.products = action.payload;
      state.productsStatus = 'loaded';
    },
    [fetchProducts.rejected]: (state) => {
      state.products = [];
      state.productsStatus = 'error';
    },
    //count
    [fetchProductsCount.pending]: (state) => {
      state.productsStatus = 'loading';
      state.productsCount = 0;
    },
    [fetchProductsCount.fulfilled]: (state, action) => {
      state.productsCount = action.payload;
      state.productsStatus = 'loaded';
    },
    [fetchProductsCount.rejected]: (state) => {
      state.productsCount = 0;
      state.productsStatus = 'error';
    },
  },
});
export const { setCurrentPage, setCategoryId, setFilters } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
