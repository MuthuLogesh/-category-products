import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductDetails = createAsyncThunk(
    'productDetails/fetchProductDetails',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://fatherstock-cache.b-cdn.net/cache/${productId}-f1.json`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const productDetailsSlice = createSlice({
    name: 'productDetails',
    initialState: {
        product: null,
        status: 'idle',
        error: null
    },
    reducers: {
        clearProductDetails: (state) => {
            state.product = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.product = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { clearProductDetails } = productDetailsSlice.actions;
export default productDetailsSlice.reducer;