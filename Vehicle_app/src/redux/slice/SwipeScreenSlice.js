// swipeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentScreen: 'New',
};

const swipeSlice = createSlice({
  name: 'swipe',
  initialState,
  reducers: {
    setScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
  },
});

export const { setScreen } = swipeSlice.actions;
export default swipeSlice.reducer;
