import { configureStore } from '@reduxjs/toolkit';
import { categoriesReducer } from './slices/categoriesSlice';
import { productsReducer } from './slices/productsSlice';
import { authReducer } from './slices/authSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    auth: authReducer,
  },
});

export default store;
