import { createSlice } from '@reduxjs/toolkit';

const locationFormSlice = createSlice({
  name: 'locationForm',
  initialState: {
    state: '',
    district: '',
    taluka: '',
    village: '',
  },
  reducers: {
    saveLocationForm: (state, action) => {
      return action.payload;
    },
    clearLocationForm: (state) => {
      return {
        state: '',
        district: '',
        taluka: '',
        village: '',
      };
    },
  },
});

export const { saveLocationForm, clearLocationForm } = locationFormSlice.actions;

export default locationFormSlice.reducer;