// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: {}, // key: productId
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const id = product.id;
      state.cartItems[id] = {
        ...product,
        quantity: product.quantity || 1,
      };
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (state.cartItems[id]) {
        state.cartItems[id].quantity = quantity;
      }
    },
    removeFromCart: (state, action) => {
      delete state.cartItems[action.payload];
    },
  },
});

export const { addToCart, updateCartItemQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
