import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './categoriesSlice';
import productsReducer from './productsSlice';
import productDetailsReducer from './productDetailsSlice';

export const store = configureStore({
    reducer: {
        categories: categoriesReducer,
        products: productsReducer,
        productDetails: productDetailsReducer
    }
});