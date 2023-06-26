// manufacturerDetailsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const manufacturerDetailsSlice = createSlice({
  name: 'manufacturerDetails',
  initialState: {
    manufacturer: '',
    modal: '',
    variant: '',
  },
  reducers: {
    saveManufacturerDetails: (state, action) => {
      const { manufacturer, modal, variant } = action.payload;
      state.manufacturer = manufacturer;
      state.modal = modal;
      state.variant = variant;
    },
  },
});

export const { saveManufacturerDetails } = manufacturerDetailsSlice.actions;

export default manufacturerDetailsSlice.reducer;
