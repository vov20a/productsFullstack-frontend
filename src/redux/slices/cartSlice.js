import { createSlice } from '@reduxjs/toolkit';
import { calkTotalPrice } from '../../utils/calkTotalPrice';
import { getCartFromLS } from '../../utils/getCartFromLS';

const { items, totalPrice } = getCartFromLS();

const initialState = {
  totalPrice: totalPrice,
  items: items,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const findItem = state.items.find(
        (obj) =>
          obj._id === action.payload._id &&
          obj.size === action.payload.size &&
          obj.type === action.payload.type,
      );
      if (findItem) {
        findItem.count++;
      } else {
        state.items.push({ ...action.payload, count: 1 });
      }
      state.totalPrice = calkTotalPrice(state.items);
    },

    minusItem(state, action) {
      const findItem = state.items.find(
        (obj) =>
          obj._id === action.payload._id &&
          obj.size === action.payload.size &&
          obj.type === action.payload.type,
      );
      if (findItem) {
        findItem.count--;
        if (!findItem.count) {
          state.items = state.items.filter(
            (obj) =>
              obj._id !== action.payload._id ||
              obj.size !== action.payload.size ||
              obj.type !== action.payload.type,
          );
        }
      }
      state.totalPrice = calkTotalPrice(state.items);
    },

    removeItem(state, action) {
      state.items = state.items.filter(
        (obj) =>
          obj._id !== action.payload._id ||
          obj.size !== action.payload.size ||
          obj.type !== action.payload.type,
      );
      state.totalPrice = calkTotalPrice(state.items);
    },

    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});
//сокрашяем код в useSelector()
export const selectCart = (state) => state.cart;
export const selectCartItemById = (id) => (state) => state.cart.items.find((obj) => obj.id === id);

export const { addItem, removeItem, minusItem, clearItems } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
