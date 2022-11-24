import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchOrder = createAsyncThunk('orders/fetchOrder', async (params) => {
  const { data } = await axios.post('/orders', params);
  await axios.post('/mail', { email: params.email, message: params.message });
  return data;
});
export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async () => {
  const { data } = await axios.get('/orders');
  return data;
});

export const fetchOrdersCount = createAsyncThunk('orders/fetchOrdersCount', async () => {
  const { data } = await axios.get('/orders/count');
  return data;
});

const initialState = {
  orders: [],
  ordersStatus: 'loading',
  ordersCount: 0,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: {
    //create one order
    [fetchOrder.pending]: (state) => {
      state.orders = [];
      state.ordersStatus = 'loading';
    },
    [fetchOrder.fulfilled]: (state, action) => {
      state.orders = action.payload;
      state.ordersStatus = 'loaded';
    },
    [fetchOrder.rejected]: (state) => {
      state.orders = [];
      state.ordersStatus = 'error';
    },
    //get All orders
    [fetchAllOrders.pending]: (state) => {
      state.orders = [];
      state.ordersStatus = 'loading';
    },
    [fetchAllOrders.fulfilled]: (state, action) => {
      state.orders = action.payload;
      state.ordersStatus = 'loaded';
    },
    [fetchAllOrders.rejected]: (state) => {
      state.orders = [];
      state.ordersStatus = 'error';
    },
    //get count of orders
    [fetchOrdersCount.pending]: (state) => {
      state.ordersStatus = 'loading';
      state.ordersCount = 0;
    },
    [fetchOrdersCount.fulfilled]: (state, action) => {
      state.ordersCount = action.payload;
      state.ordersStatus = 'loaded';
    },
    [fetchOrdersCount.rejected]: (state) => {
      state.ordersCount = 0;
      state.ordersStatus = 'error';
    },
  },
});

export const ordersReducer = ordersSlice.reducer;
