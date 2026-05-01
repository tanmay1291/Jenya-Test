import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (p = {}) => {
    const { skip = 0, limit = 10 } = p;
    
    const res = await fetch(
      `https://dummyjson.com/products?skip=${skip}&limit=${limit}`
    );

    return res.json();
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    return res.json();
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (prod) => {
    const res = await fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prod),
    });

    return res.json();
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data: d }) => {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(d),
    });

    return res.json();
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      method: 'DELETE',
    });

    return res.json();
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null,
    total: 0,
    loading: false,
    error: null,
    crudLoading: false,
    crudError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      }).addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
      }).addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }).addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      }).addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      }).addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }).addCase(createProduct.pending, (state) => {
        state.crudLoading = true;
        state.crudError = null;
      }).addCase(createProduct.fulfilled, (state, action) => {
        state.crudLoading = false;
        state.items.unshift(action.payload);
        state.total += 1;
      }).addCase(createProduct.rejected, (state, action) => {
        state.crudLoading = false;
        state.crudError = action.error.message;
      }).addCase(updateProduct.pending, (state) => {
        state.crudLoading = true;
        state.crudError = null;
      }).addCase(updateProduct.fulfilled, (state, action) => {
        state.crudLoading = false;
        const idx = state.items.findIndex(item => item.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      }).addCase(updateProduct.rejected, (state, action) => {
        state.crudLoading = false;
        state.crudError = action.error.message;
      }).addCase(deleteProduct.pending, (state) => {
        state.crudLoading = true;
        state.crudError = null;
      }).addCase(deleteProduct.fulfilled, (state, action) => {
        state.crudLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload.id);
        state.total -= 1;
      }).addCase(deleteProduct.rejected, (state, action) => {
        state.crudLoading = false;
        state.crudError = action.error.message;
      });
  },
});

export default productsSlice.reducer;
