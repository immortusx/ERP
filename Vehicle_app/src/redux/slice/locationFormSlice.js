import { createSlice } from '@reduxjs/toolkit';

const locationFormSlice = createSlice({
  name: 'locationForm',
  initialState: {
    taluka: '',
    village: '',
  },
  reducers: {
    saveLocationForm: (state, action) => {
      return action.payload;
    },
    clearLocationForm: (state) => {
      return {
        taluka: '',
        village: '',
      };
    },
  },
});

export const { saveLocationForm, clearLocationForm } = locationFormSlice.actions;

export default locationFormSlice.reducer;