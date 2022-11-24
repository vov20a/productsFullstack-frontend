import { configureStore } from '@reduxjs/toolkit';
import { categoriesReducer } from './slices/categoriesSlice';
import { productsReducer } from './slices/productsSlice';
import { authReducer } from './slices/authSlice';
import { filterReducer } from './slices/filterSlice';
import { cartReducer } from './slices/cartSlice';
import { ordersReducer } from './slices/ordersSlice';
import { usersReducer } from './slices/usersSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    auth: authReducer,
    filter: filterReducer,
    cart: cartReducer,
    orders: ordersReducer,
    users: usersReducer,
  },
});

export default store;
