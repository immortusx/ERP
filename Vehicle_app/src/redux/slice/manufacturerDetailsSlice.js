// manufacturerDetailsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const manufacturerDetailsSlice = createSlice({
  name: 'manufacturerDetails',
  initialState: {
    modal: '',
  },
  reducers: {
    saveManufacturerDetails: (state, action) => {
      const { modal } = action.payload;
      
      state.modal = modal;
    },
    clearManufacturerDetails: (state) => {
      state.modal = '';
    },
  },
});

export const { saveManufacturerDetails, clearManufacturerDetails } = manufacturerDetailsSlice.actions;

export default manufacturerDetailsSlice.reducer;
