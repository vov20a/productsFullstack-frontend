import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchProductsCount = createAsyncThunk(
  'products/fetchProductsCount',
  async ({ categoryId, search }) => {
    if (!categoryId) {
      const { data } = await axios.get(`/products/count/?search=${search}`);
      return data;
    } else {
      const { data } = await axios.get(
        `/products/count/?categoryId=${categoryId}&search=${search}`,
      );
      return data;
    }
  },
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ startProduct, limit, categoryId, sort, search }) => {
    if (!categoryId) {
      const { data } = await axios.get(
        `/products/?sort=${sort}&search=${search}&startProduct=${startProduct}&limit=${limit}`,
      );
      return data;
    } else {
      const { data } = await axios.get(
        `/products/categories/${categoryId}/?sort=${sort}&search=${search}&startProduct=${startProduct}&limit=${limit}`,
      );
      return data;
    }
  },
);

const initialState = {
  products: [],
  productsStatus: 'loading',
  productsCount: 0,
};
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
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

export const productsReducer = productsSlice.reducer;
